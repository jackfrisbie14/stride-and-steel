import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Valid promo codes and their duration in days
const PROMO_CODES = {
  HYBRID90: { days: 90, description: "Beta tester - 90 day free access" },
  FREEACCESS: { days: 90, description: "Forum promotion - 90 day free access" },
};

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { code } = await request.json();
    const normalizedCode = code?.trim()?.toUpperCase();

    if (!normalizedCode || !PROMO_CODES[normalizedCode]) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
    }

    const promo = PROMO_CODES[normalizedCode];

    // Check if user already has an active subscription
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { stripeCurrentPeriodEnd: true, stripeSubscriptionId: true },
    });

    if (user?.stripeSubscriptionId && user?.stripeCurrentPeriodEnd && new Date(user.stripeCurrentPeriodEnd) > new Date()) {
      return NextResponse.json({ error: "You already have an active subscription" }, { status: 400 });
    }

    // Grant free access by setting stripeCurrentPeriodEnd
    const accessEnd = new Date();
    accessEnd.setDate(accessEnd.getDate() + promo.days);

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        stripeCurrentPeriodEnd: accessEnd,
      },
    });

    return NextResponse.json({
      success: true,
      accessUntil: accessEnd.toISOString(),
      days: promo.days,
    });
  } catch (error) {
    console.error("Promo redeem error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
