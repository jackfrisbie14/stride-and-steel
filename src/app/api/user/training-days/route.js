import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { determineArchetype, parseExperience } from "@/lib/archetypes";
import { generateQuizWorkouts } from "@/lib/workout-generator";
import { generateRacePlan } from "@/lib/race-plan-generator";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { trainingDays } = body;

    if (!trainingDays || trainingDays < 3 || trainingDays > 7) {
      return NextResponse.json(
        { error: "Training days must be between 3 and 7" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse quiz answers for archetype
    const answersArray = Array.isArray(user.quizAnswers)
      ? user.quizAnswers
      : Object.values(user.quizAnswers || {});
    const archetype = determineArchetype(answersArray);
    const experience = parseExperience(answersArray[3]);

    // Generate new workouts with updated day count
    const workouts = generateQuizWorkouts({
      archetype,
      trainingDays,
      experience,
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

    // Update user's training days
    await prisma.user.update({
      where: { id: user.id },
      data: { trainingDays },
    });

    // If race plan is active, regenerate it with the new day count
    if (user.racePlanActive) {
      const activePlan = await prisma.racePlan.findFirst({
        where: { userId: user.id, isActive: true },
      });

      if (activePlan) {
        const plan = await generateRacePlan({
          raceName: activePlan.raceName,
          raceDate: activePlan.raceDate.toISOString(),
          raceDistance: activePlan.raceDistance,
          trainingDays,
          experience,
          archetype: archetype.label,
        });

        // Deactivate old plan
        await prisma.racePlan.update({
          where: { id: activePlan.id },
          data: { isActive: false },
        });

        // Create new plan preserving current week
        await prisma.racePlan.create({
          data: {
            userId: user.id,
            raceName: activePlan.raceName,
            raceDate: activePlan.raceDate,
            raceDistance: activePlan.raceDistance,
            totalWeeks: plan.totalWeeks,
            currentWeek: Math.min(activePlan.currentWeek, plan.totalWeeks),
            phases: plan.phases,
            isActive: true,
          },
        });

        // Replace race workouts
        await prisma.workout.deleteMany({
          where: { userId: user.id, source: "race" },
        });

        const workoutRecords = [];
        for (const week of plan.weeks) {
          for (const workout of week.workouts) {
            workoutRecords.push({
              userId: user.id,
              day: workout.day,
              type: workout.type,
              title: workout.title,
              exercises: workout.exercises,
              dayNumber: workout.dayNumber,
              source: "race",
              weekNumber: week.weekNumber,
              phase: week.phase,
            });
          }
        }

        if (workoutRecords.length > 0) {
          await prisma.workout.createMany({ data: workoutRecords });
        }
      }
    }

    return NextResponse.json({ success: true, trainingDays });
  } catch (error) {
    console.error("Update training days error:", error);
    return NextResponse.json(
      { error: "Failed to update training days" },
      { status: 500 }
    );
  }
}
