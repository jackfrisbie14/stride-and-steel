import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const ADMIN_EMAIL = "jackfrisbie14@gmail.com";

// Exclude test/internal accounts from stats
const EXCLUDE_TEST_USERS = [
  { email: { contains: "jackfrisbie", mode: "insensitive" } },
  { name: { contains: "jack frisbie", mode: "insensitive" } },
  { name: { equals: "jack", mode: "insensitive" } },
  { name: { contains: "hannah betron", mode: "insensitive" } },
  { name: { contains: "richard buehling", mode: "insensitive" } },
  { name: { contains: "nextdirk", mode: "insensitive" } },
  { email: { contains: "nextdirk", mode: "insensitive" } },
  { name: { contains: "stuart bladon", mode: "insensitive" } },
  { email: { contains: "hbetron", mode: "insensitive" } },
  { email: { contains: "richard@benmore", mode: "insensitive" } },
];

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const allUsers = searchParams.get("allUsers") === "true";

    // Get user stats
    const totalUsers = await prisma.user.count({
      where: { NOT: EXCLUDE_TEST_USERS },
    });

    const usersWithSubscription = await prisma.user.count({
      where: {
        stripeCurrentPeriodEnd: { gt: new Date() },
        NOT: EXCLUDE_TEST_USERS,
      },
    });

    // Get users by signup date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersLast30Days = await prisma.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        NOT: EXCLUDE_TEST_USERS,
      },
    });

    // Get recent signups (last 7 days breakdown)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await prisma.user.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        NOT: EXCLUDE_TEST_USERS,
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate MRR from Stripe
    let mrr = 0;
    try {
      const subscriptions = await stripe.subscriptions.list({
        status: "active",
        limit: 100,
      });

      mrr = subscriptions.data.reduce((total, sub) => {
        const item = sub.items.data[0];
        if (item?.price?.unit_amount) {
          // Convert to monthly if annual
          const amount = item.price.unit_amount / 100;
          const interval = item.price.recurring?.interval;
          if (interval === "year") {
            return total + (amount / 12);
          }
          return total + amount;
        }
        return total;
      }, 0);
    } catch (e) {
      console.error("Error fetching Stripe subscriptions:", e);
    }

    // Get workout completion stats
    const totalWorkoutsCompleted = await prisma.workoutLog.count({
      where: { completed: true },
    });

    const totalWorkoutsSkipped = await prisma.workoutLog.count({
      where: { skipped: true },
    });

    // Analytics - Page views
    const totalPageViews = await prisma.pageView.count();

    const pageViewsToday = await prisma.pageView.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const pageViewsLast7Days = await prisma.pageView.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Unique visitors
    const uniqueVisitorsResult = await prisma.pageView.groupBy({
      by: ["visitorId"],
    });
    const uniqueVisitors = uniqueVisitorsResult.length;

    const uniqueVisitorsLast7DaysResult = await prisma.pageView.groupBy({
      by: ["visitorId"],
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });
    const uniqueVisitorsLast7Days = uniqueVisitorsLast7DaysResult.length;

    // Funnel metrics
    const funnelSteps = ["landing", "quiz_start", "quiz_complete", "signup_page", "signup_complete", "checkout_page", "subscribed", "dashboard"];
    const funnelCounts = {};

    for (const step of funnelSteps) {
      const result = await prisma.funnelEvent.groupBy({
        by: ["visitorId"],
        where: { step },
      });
      funnelCounts[step] = result.length;
    }

    // Page views by path (top 10)
    const pageViewsByPath = await prisma.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    });

    // Free trial users: active subscription but no first real payment yet
    const freeTrialUsers = await prisma.user.count({
      where: {
        stripeCurrentPeriodEnd: { gt: new Date() },
        firstPaidAt: null,
        stripeSubscriptionId: { not: null },
        NOT: EXCLUDE_TEST_USERS,
      },
    });

    // Get users list
    const recentUsersList = await prisma.user.findMany({
      ...(allUsers ? {} : { take: 10 }),
      where: { NOT: EXCLUDE_TEST_USERS },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        stripeCurrentPeriodEnd: true,
        firstPaidAt: true,
        stripeSubscriptionId: true,
      },
    });

    // Cancellation feedback stats
    const cancellationFeedback = await prisma.cancellationFeedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Aggregate reasons
    const reasonCounts = {};
    let totalCancelled = 0;
    let totalSaved = 0;

    cancellationFeedback.forEach((fb) => {
      reasonCounts[fb.reason] = (reasonCounts[fb.reason] || 0) + 1;
      if (fb.cancelled) totalCancelled++;
      if (fb.acceptedOffer) totalSaved++;
    });

    return NextResponse.json({
      totalUsers,
      activeSubscriptions: usersWithSubscription,
      newUsersLast30Days,
      freeTrialUsers,
      mrr: Math.round(mrr * 100) / 100,
      totalWorkoutsCompleted,
      totalWorkoutsSkipped,
      recentUsers: recentUsersList,
      signupsLast7Days: recentUsers.length,
      // Analytics
      totalPageViews,
      pageViewsToday,
      pageViewsLast7Days,
      uniqueVisitors,
      uniqueVisitorsLast7Days,
      funnelCounts,
      pageViewsByPath: pageViewsByPath.map((p) => ({
        path: p.path,
        views: p._count.path,
      })),
      // Cancellation data
      cancellationFeedback: cancellationFeedback.map((fb) => ({
        id: fb.id,
        reason: fb.reason,
        otherReason: fb.otherReason,
        acceptedOffer: fb.acceptedOffer,
        cancelled: fb.cancelled,
        createdAt: fb.createdAt,
      })),
      cancellationStats: {
        total: cancellationFeedback.length,
        cancelled: totalCancelled,
        saved: totalSaved,
        saveRate: cancellationFeedback.length > 0
          ? Math.round((totalSaved / cancellationFeedback.length) * 100)
          : 0,
        reasonCounts,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to get stats" },
      { status: 500 }
    );
  }
}
