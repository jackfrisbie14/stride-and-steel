import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Get current training week and workout logs
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get or create current training week
    let currentWeek = await prisma.trainingWeek.findFirst({
      where: {
        userId: user.id,
        isComplete: false,
      },
      include: {
        workoutLogs: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    // If no active week, create one
    if (!currentWeek) {
      currentWeek = await prisma.trainingWeek.create({
        data: {
          userId: user.id,
          weekNumber: 1,
          startDate: new Date(),
        },
        include: {
          workoutLogs: true,
        },
      });
    }

    return NextResponse.json({
      trainingWeek: currentWeek,
      workoutLogs: currentWeek.workoutLogs,
    });
  } catch (error) {
    console.error("Get workouts error:", error);
    return NextResponse.json(
      { error: "Failed to get workouts" },
      { status: 500 }
    );
  }
}

// POST - Log a workout (pre-workout check-in or post-workout feedback)
export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      dayOfWeek,
      workoutType,
      workoutTitle,
      preEnergyLevel,
      preSoreness,
      preMotivation,
      difficulty,
      performance,
      enjoyment,
      completed,
      skipped,
      notes,
    } = body;

    // Get or create current training week
    let currentWeek = await prisma.trainingWeek.findFirst({
      where: {
        userId: user.id,
        isComplete: false,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    if (!currentWeek) {
      currentWeek = await prisma.trainingWeek.create({
        data: {
          userId: user.id,
          weekNumber: 1,
          startDate: new Date(),
        },
      });
    }

    // Check if workout log already exists for this day
    let workoutLog = await prisma.workoutLog.findFirst({
      where: {
        trainingWeekId: currentWeek.id,
        dayOfWeek: dayOfWeek,
      },
    });

    if (workoutLog) {
      // Update existing log
      workoutLog = await prisma.workoutLog.update({
        where: { id: workoutLog.id },
        data: {
          preEnergyLevel: preEnergyLevel ?? workoutLog.preEnergyLevel,
          preSoreness: preSoreness ?? workoutLog.preSoreness,
          preMotivation: preMotivation ?? workoutLog.preMotivation,
          difficulty: difficulty ?? workoutLog.difficulty,
          performance: performance ?? workoutLog.performance,
          enjoyment: enjoyment ?? workoutLog.enjoyment,
          completed: completed ?? workoutLog.completed,
          skipped: skipped ?? workoutLog.skipped,
          completedAt: completed ? new Date() : workoutLog.completedAt,
          notes: notes ?? workoutLog.notes,
        },
      });
    } else {
      // Create new log
      workoutLog = await prisma.workoutLog.create({
        data: {
          trainingWeekId: currentWeek.id,
          dayOfWeek,
          workoutType,
          workoutTitle,
          preEnergyLevel,
          preSoreness,
          preMotivation,
          difficulty,
          performance,
          enjoyment,
          completed: completed || false,
          skipped: skipped || false,
          completedAt: completed ? new Date() : null,
          notes,
        },
      });
    }

    // Check if week is complete (all 7 days logged)
    const allLogs = await prisma.workoutLog.findMany({
      where: { trainingWeekId: currentWeek.id },
    });

    const completedOrSkipped = allLogs.filter((log) => log.completed || log.skipped);

    if (completedOrSkipped.length >= 7) {
      // Calculate averages and complete the week
      const completedLogs = allLogs.filter((log) => log.completed);

      const avgDifficulty =
        completedLogs.length > 0
          ? completedLogs.reduce((sum, log) => sum + (log.difficulty || 0), 0) /
            completedLogs.length
          : null;

      const avgEnergy =
        completedLogs.length > 0
          ? completedLogs.reduce((sum, log) => sum + (log.preEnergyLevel || 0), 0) /
            completedLogs.length
          : null;

      const avgSoreness =
        completedLogs.length > 0
          ? completedLogs.reduce((sum, log) => sum + (log.preSoreness || 0), 0) /
            completedLogs.length
          : null;

      await prisma.trainingWeek.update({
        where: { id: currentWeek.id },
        data: {
          isComplete: true,
          endDate: new Date(),
          avgDifficulty,
          avgEnergy,
          avgSoreness,
        },
      });

      // Create next week
      await prisma.trainingWeek.create({
        data: {
          userId: user.id,
          weekNumber: currentWeek.weekNumber + 1,
          startDate: new Date(),
        },
      });
    }

    return NextResponse.json({ workoutLog });
  } catch (error) {
    console.error("Log workout error:", error);
    return NextResponse.json(
      { error: "Failed to log workout" },
      { status: 500 }
    );
  }
}
