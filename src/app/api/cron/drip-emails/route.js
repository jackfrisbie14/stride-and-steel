import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDripEmail } from "@/lib/emails";

const DRIP_SCHEDULE = [
  { emailType: "drip_1hr", delayMs: 1 * 60 * 60 * 1000 },
  { emailType: "drip_24hr", delayMs: 24 * 60 * 60 * 1000 },
  { emailType: "drip_72hr", delayMs: 72 * 60 * 60 * 1000 },
];

const BATCH_LIMIT = 50;

export async function GET(request) {
  // Verify cron secret (Vercel injects this for cron routes)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {};

  for (const { emailType, delayMs } of DRIP_SCHEDULE) {
    const cutoff = new Date(Date.now() - delayMs);

    const users = await prisma.user.findMany({
      where: {
        password: { not: null },
        stripeSubscriptionId: null,
        unsubscribedFromEmail: false,
        createdAt: { lte: cutoff },
        email: { not: null },
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
        const result = await sendDripEmail(user, emailType);
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
