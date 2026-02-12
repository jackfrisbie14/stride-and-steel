import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { determineArchetype, parseExperience } from "@/lib/archetypes";
import { generateQuizWorkouts } from "@/lib/workout-generator";

const VALID_SPLITS = ["ppl", "arnold", "upper_lower", "bro_split", "full_body"];

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { liftingSplit, customExercises } = body;

    // Validate liftingSplit
    if (liftingSplit !== null && liftingSplit !== undefined && !VALID_SPLITS.includes(liftingSplit)) {
      return NextResponse.json(
        { error: "Invalid lifting split" },
        { status: 400 }
      );
    }

    // Validate customExercises
    if (customExercises !== null && customExercises !== undefined) {
      if (!Array.isArray(customExercises)) {
        return NextResponse.json(
          { error: "Custom exercises must be an array" },
          { status: 400 }
        );
      }
      if (customExercises.length > 10) {
        return NextResponse.json(
          { error: "Maximum 10 custom exercises allowed" },
          { status: 400 }
        );
      }
      if (customExercises.some(e => typeof e !== "string" || e.trim().length === 0)) {
        return NextResponse.json(
          { error: "Each exercise must be a non-empty string" },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Save preferences
    const cleanedExercises = customExercises
      ? customExercises.map(e => e.trim()).filter(Boolean)
      : null;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        liftingSplit: liftingSplit || null,
        customExercises: cleanedExercises && cleanedExercises.length > 0 ? cleanedExercises : null,
      },
    });

    // Parse quiz answers for archetype
    const answersArray = Array.isArray(user.quizAnswers)
      ? user.quizAnswers
      : Object.values(user.quizAnswers || {});
    const archetype = determineArchetype(answersArray);
    const experience = parseExperience(answersArray[3]);

    // Generate new workouts with preferences
    const workouts = await generateQuizWorkouts({
      archetype,
      trainingDays: user.trainingDays || 5,
      experience,
      liftingSplit: liftingSplit || null,
      customExercises: cleanedExercises && cleanedExercises.length > 0 ? cleanedExercises : null,
    });

    // Delete existing quiz workouts
    await prisma.workout.deleteMany({
      where: { userId: user.id, source: "quiz" },
    });

    // Store new workouts
    if (workouts && workouts.length > 0) {
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
    console.error("Update workout preferences error:", error);
    return NextResponse.json(
      { error: "Failed to update workout preferences" },
      { status: 500 }
    );
  }
}
