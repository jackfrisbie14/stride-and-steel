import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { determineArchetype } from "@/lib/archetypes";
import { generateQuizWorkouts } from "@/lib/workout-generator";

export async function POST(request) {
  try {
    const { email, answers, utm } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Determine archetype from quiz answers (5 questions — training days and experience come from onboarding)
    const answersArray = Array.isArray(answers) ? answers : Object.values(answers || {});
    const archetype = determineArchetype(answersArray);
    const trainingDays = 5; // Default until onboarding
    const experience = "intermediate"; // Default until onboarding

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Build UTM fields (only set if not already stored — first-touch attribution)
    const utmData = utm ? {
      utmSource: utm.utm_source || undefined,
      utmMedium: utm.utm_medium || undefined,
      utmCampaign: utm.utm_campaign || undefined,
      utmContent: utm.utm_content || undefined,
    } : {};

    if (user) {
      // Update existing user's quiz answers (only set UTM if not already stored)
      const utmUpdate = !user.utmSource ? utmData : {};
      user = await prisma.user.update({
        where: { email },
        data: {
          quizAnswers: answers,
          archetype: archetype.label,
          trainingDays,
          ...utmUpdate,
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          quizAnswers: answers,
          archetype: archetype.label,
          trainingDays,
          ...utmData,
        },
      });
    }

    // Generate personalized workouts
    const workouts = generateQuizWorkouts({
      archetype,
      trainingDays,
      experience,
    });

    // Delete existing quiz workouts for this user
    await prisma.workout.deleteMany({
      where: { userId: user.id, source: "quiz" },
    });

    // Store generated workouts
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
      message: "Quiz submitted successfully",
      userId: user.id,
      archetype: archetype.label,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
