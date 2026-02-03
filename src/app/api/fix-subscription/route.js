import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Temporary endpoint to fix subscription sync issues
// DELETE THIS FILE after use
export async function POST(request) {
  try {
    const { email, customerId } = await request.json();

    if (!email || !customerId) {
      return NextResponse.json({ error: "Missing email or customerId" }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Found user:", user.id, "Current stripeCustomerId:", user.stripeCustomerId);

    // Get subscriptions for this customer from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    const subscription = subscriptions.data[0];

    // Update the user with correct subscription data
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        stripeCustomerId: updatedUser.stripeCustomerId,
        stripeSubscriptionId: updatedUser.stripeSubscriptionId,
        stripeCurrentPeriodEnd: updatedUser.stripeCurrentPeriodEnd,
      },
    });
  } catch (error) {
    console.error("Fix subscription error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
