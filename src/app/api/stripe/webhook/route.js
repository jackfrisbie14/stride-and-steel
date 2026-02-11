import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Helper function to find user by stripeCustomerId or customer metadata
async function findUserByCustomer(customerId) {
  // First try to find by stripeCustomerId
  let user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (user) return user;

  // If not found, try to get userId from Stripe customer metadata
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer && !customer.deleted && customer.metadata?.userId) {
      user = await prisma.user.findUnique({
        where: { id: customer.metadata.userId },
      });

      // If found, update the stripeCustomerId
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      }
    }

    // If still not found, try by email
    if (!user && customer && !customer.deleted && customer.email) {
      user = await prisma.user.findUnique({
        where: { email: customer.email },
      });

      // If found, update the stripeCustomerId
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      }
    }
  } catch (e) {
    console.error("Error retrieving Stripe customer:", e);
  }

  return user;
}

export async function POST(request) {
  const buf = await request.arrayBuffer();
  const body = Buffer.from(buf).toString("utf8");
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json({ error: "Invalid signature", details: error.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const user = await findUserByCustomer(session.customer);

        if (!user) {
          console.error("User not found for customer:", session.customer);
          return NextResponse.json({ received: true, warning: "User not found" });
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeCustomerId: session.customer,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });

        // Track subscription in funnel (use visitorId from metadata if available)
        try {
          await prisma.funnelEvent.create({
            data: {
              step: "subscribed",
              visitorId: session.metadata?.visitorId || `user_${user.id}`,
              userId: user.id,
              metadata: { priceId: subscription.items.data[0].price.id },
            },
          });
        } catch (e) {
          // Don't fail webhook for analytics
          console.error("Failed to track subscription funnel:", e);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const user = await findUserByCustomer(invoice.customer);

          if (!user) {
            console.error("User not found for customer:", invoice.customer);
            return NextResponse.json({ received: true, warning: "User not found" });
          }

          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);

          await prisma.user.update({
            where: { id: user.id },
            data: {
              stripeCustomerId: invoice.customer,
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const user = await findUserByCustomer(subscription.customer);

        if (!user) {
          console.error("User not found for customer:", subscription.customer);
          return NextResponse.json({ received: true, warning: "User not found" });
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const user = await findUserByCustomer(subscription.customer);

        if (!user) {
          console.error("User not found for customer:", subscription.customer);
          return NextResponse.json({ received: true, warning: "User not found" });
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeCustomerId: subscription.customer,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object;
        const user = await findUserByCustomer(subscription.customer);

        if (!user) {
          console.error("User not found for customer:", subscription.customer);
          return NextResponse.json({ received: true, warning: "User not found" });
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeCustomerId: subscription.customer,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed", details: error.message },
      { status: 500 }
    );
  }
}
