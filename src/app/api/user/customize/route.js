import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { determineArchetype, parseExperience } from "@/lib/archetypes";
import { generateQuizWorkouts } from "@/lib/workout-generator";

const VALID_SPLITS = ["ppl", "arnold", "upper_lower", "bro_split", "full_body"];
const VALID_LEVELS = ["beginner", "intermediate", "advanced"];

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { trainingDays, liftingSplit, customExercises, experience } = body;

    // Validate trainingDays
    if (trainingDays !== undefined && (trainingDays < 3 || trainingDays > 7)) {
      return NextResponse.json({ error: "Training days must be between 3 and 7" }, { status: 400 });
    }

    // Validate liftingSplit
    if (liftingSplit !== null && liftingSplit !== undefined && !VALID_SPLITS.includes(liftingSplit)) {
      return NextResponse.json({ error: "Invalid lifting split" }, { status: 400 });
    }

    // Validate customExercises
    if (customExercises !== null && customExercises !== undefined) {
      if (!Array.isArray(customExercises)) {
        return NextResponse.json({ error: "Custom exercises must be an array" }, { status: 400 });
      }
      if (customExercises.length > 10) {
        return NextResponse.json({ error: "Maximum 10 custom exercises allowed" }, { status: 400 });
      }
      if (customExercises.some(e => typeof e !== "string" || e.trim().length === 0)) {
        return NextResponse.json({ error: "Each exercise must be a non-empty string" }, { status: 400 });
      }
    }

    // Validate experience
    if (experience !== undefined && !VALID_LEVELS.includes(experience)) {
      return NextResponse.json({ error: "Experience must be one of: beginner, intermediate, advanced" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build update data — only include fields that were sent
    const updateData = {};
    if (trainingDays !== undefined) updateData.trainingDays = trainingDays;
    if (liftingSplit !== undefined) updateData.liftingSplit = liftingSplit || null;
    if (customExercises !== undefined) {
      const cleaned = customExercises
        ? customExercises.map(e => e.trim()).filter(Boolean)
        : null;
      updateData.customExercises = cleaned && cleaned.length > 0 ? cleaned : null;
    }
    if (experience !== undefined) updateData.experience = experience;

    // Save all settings at once
    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Use the new values for regeneration
    const finalDays = trainingDays !== undefined ? trainingDays : user.trainingDays || 5;
    const finalSplit = liftingSplit !== undefined ? (liftingSplit || null) : (user.liftingSplit || null);
    const finalExercises = customExercises !== undefined
      ? (updateData.customExercises || null)
      : (user.customExercises || null);
    const finalExperience = experience !== undefined
      ? experience
      : (user.experience || parseExperience(
          (Array.isArray(user.quizAnswers) ? user.quizAnswers : Object.values(user.quizAnswers || {}))[3]
        ));

    // Parse archetype from quiz
    const answersArray = Array.isArray(user.quizAnswers)
      ? user.quizAnswers
      : Object.values(user.quizAnswers || {});
    const archetype = determineArchetype(answersArray);

    // Regenerate quiz workouts once with all new settings
    const workouts = await generateQuizWorkouts({
      archetype,
      trainingDays: finalDays,
      experience: finalExperience,
      liftingSplit: finalSplit,
      customExercises: finalExercises,
    });

    // Delete existing quiz workouts
    await prisma.workout.deleteMany({
      where: { userId: user.id, source: "quiz" },
    });

    // Store new workouts
    if (workouts.length > 0) {
      await prisma.workout.createMany({
        data: workouts.map((w) => ({
          userId: user.id,
          day: w.day,
          type: w.type,
          title: w.title,
          exercises: w.exercises,
          dayNumber: w.dayNumber,
          source: "quiz",
          weekNumber: 1,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      racePlanRegenerating: user.racePlanActive,
    });
  } catch (error) {
    console.error("Update customization error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
