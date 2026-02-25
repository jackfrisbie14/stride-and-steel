import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { determineArchetype, parseTrainingDays, parseExperience } from "@/lib/archetypes";
import { generateQuizWorkouts } from "@/lib/workout-generator";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { trainingDays, experience, raceStatus, gender, height, weight, heightWeightUnit } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse training days and experience from the option strings
    const parsedDays = parseTrainingDays(trainingDays);
    const parsedExperience = parseExperience(experience);

    // Update user record with onboarding data
    await prisma.user.update({
      where: { id: user.id },
      data: {
        trainingDays: parsedDays,
        experience: parsedExperience,
        gender: gender || null,
        height: height || null,
        weight: weight || null,
        heightWeightUnit: heightWeightUnit || null,
        onboardingCompleted: true,
      },
    });

    // Regenerate workouts with real preferences
    const answersArray = Array.isArray(user.quizAnswers) ? user.quizAnswers : [];
    const archetype = user.archetype
      ? { label: user.archetype, ratios: getArchetypeRatios(user.archetype) }
      : determineArchetype(answersArray);

    const workouts = generateQuizWorkouts({
      archetype,
      trainingDays: parsedDays,
      experience: parsedExperience,
    });

    // Delete existing quiz workouts and regenerate
    await prisma.workout.deleteMany({
      where: { userId: user.id, source: "quiz" },
    });

    if (Array.isArray(workouts) && workouts.length > 0) {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}

// Helper to get ratios from archetype label
function getArchetypeRatios(label) {
  const ratioMap = {
    "The Iron Runner": { lift: 35, run: 50, recovery: 15 },
    "The Steel Strider": { lift: 50, run: 35, recovery: 15 },
    "The Balanced Athlete": { lift: 40, run: 40, recovery: 20 },
    "The Endurance Machine": { lift: 25, run: 55, recovery: 20 },
  };
  return ratioMap[label] || ratioMap["The Balanced Athlete"];
}
