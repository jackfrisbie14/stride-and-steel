import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe, PRICE_ID, TRIAL_PRICE_ID } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
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

    // Check if user already has an active subscription
    if (user.stripeSubscriptionId && user.stripeCurrentPeriodEnd) {
      const isActive = new Date(user.stripeCurrentPeriodEnd) > new Date();
      if (isActive) {
        return NextResponse.json(
          { error: "Already subscribed" },
          { status: 400 }
        );
      }
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Create checkout session with $0.99 trial fee + 7-day free trial on subscription
    const lineItems = [
      {
        price: PRICE_ID,
        quantity: 1,
      },
    ];

    // Add $0.99 one-time trial fee if configured
    if (TRIAL_PRICE_ID) {
      lineItems.push({
        price: TRIAL_PRICE_ID,
        quantity: 1,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId: user.id,
        },
      },
      success_url: `${process.env.NEXTAUTH_URL?.trim()}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL?.trim()}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
