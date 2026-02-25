import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTrialEmail } from "@/lib/emails/trial-emails";

// Days after subscription creation → email type
// Day 0 is sent immediately via webhook, not cron
const TRIAL_SCHEDULE = [
  { day: 1, emailType: "trial_day1" },
  { day: 3, emailType: "trial_day3" },
  { day: 5, emailType: "trial_day5" },
  { day: 6, emailType: "trial_day6" },
];

const BATCH_LIMIT = 50;

export async function GET(request) {
  // Verify cron secret (Vercel injects this for cron routes)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {};

  for (const { day, emailType } of TRIAL_SCHEDULE) {
    // Find users whose subscription was created `day` days ago (within a 24h window)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - day);
    const windowStart = new Date(targetDate);
    windowStart.setHours(0, 0, 0, 0);
    const windowEnd = new Date(targetDate);
    windowEnd.setHours(23, 59, 59, 999);

    const users = await prisma.user.findMany({
      where: {
        stripeSubscriptionId: { not: null },
        stripeCurrentPeriodEnd: { gt: new Date() }, // still active
        unsubscribedFromEmail: false,
        email: { not: null },
        createdAt: { gte: windowStart, lte: windowEnd },
        NOT: {
          emailLogs: {
            some: { emailType },
          },
        },
      },
      take: BATCH_LIMIT,
    });

    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const user of users) {
      try {
        const result = await sendTrialEmail(user, emailType);
        if (result.sent) sent++;
        else if (result.skipped) skipped++;
        else failed++;
      } catch (err) {
        console.error(`Error sending ${emailType} to ${user.id}:`, err);
        failed++;
      }
    }

    results[emailType] = { eligible: users.length, sent, failed, skipped };
  }

  return NextResponse.json({ success: true, results });
}
