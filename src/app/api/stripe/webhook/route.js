import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );

        await prisma.user.update({
          where: { stripeCustomerId: session.customer },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription
          );

          await prisma.user.update({
            where: { stripeCustomerId: invoice.customer },
            data: {
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        await prisma.user.update({
          where: { stripeCustomerId: subscription.customer },
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

        await prisma.user.update({
          where: { stripeCustomerId: subscription.customer },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
