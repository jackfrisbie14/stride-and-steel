import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { getWorkoutsArray, getWorkoutEmailHtml } from "@/lib/workouts";

export async function POST(request) {
  try {
    const { email, answers } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Update existing user's quiz answers
      user = await prisma.user.update({
        where: { email },
        data: {
          quizAnswers: answers,
          archetype: "Balanced Athlete", // Can be dynamic based on answers later
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          quizAnswers: answers,
          archetype: "Balanced Athlete",
        },
      });
    }

    // Get template workouts
    const workouts = getWorkoutsArray();

    // Send email with workouts
    const { error: emailError } = await resend.emails.send({
      from: "Stride & Steel <onboarding@resend.dev>",
      to: email,
      subject: "Your Custom Training Plan from Stride & Steel",
      html: getWorkoutEmailHtml(workouts),
    });

    if (emailError) {
      console.error("Email error:", emailError);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({
      success: true,
      message: "Quiz submitted successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
