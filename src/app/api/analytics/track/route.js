import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendFBEvent } from "@/lib/facebook";

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, path, step, visitorId, referrer, userAgent, metadata, fbEventId, utm, userEmail: bodyEmail } = body;

    if (!visitorId) {
      return NextResponse.json({ error: "Missing visitorId" }, { status: 400 });
    }

    // Get user ID and email if logged in
    let userId = null;
    let userEmail = null;
    try {
      const session = await auth();
      if (session?.user?.email) {
        userEmail = session.user.email;
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true },
        });
        userId = user?.id;
      }
    } catch (e) {
      // Ignore auth errors for analytics
    }

    if (type === "pageview" && path) {
      await prisma.pageView.create({
        data: {
          path,
          visitorId,
          userId,
          referrer: referrer || null,
          userAgent: userAgent || null,
        },
      });

      // Send server-side PageView to Facebook CAPI with email for better matching
      sendFBEvent("PageView", {
        email: userEmail || undefined,
        sourceUrl: path,
        userAgent: userAgent || request.headers.get("user-agent") || undefined,
        eventId: fbEventId || undefined,
      });
    }

    if (type === "funnel" && step) {
      // Check if this step was already tracked for this visitor (prevent duplicates)
      const existing = await prisma.funnelEvent.findFirst({
        where: {
          visitorId,
          step,
        },
      });

      if (!existing) {
        // Merge UTM data into metadata for attribution
        const enrichedMetadata = { ...(metadata || {}), ...(utm ? { utm } : {}) };

        await prisma.funnelEvent.create({
          data: {
            step,
            visitorId,
            userId,
            metadata: Object.keys(enrichedMetadata).length > 0 ? enrichedMetadata : null,
          },
        });

        if (step === "landing") {
          sendFBEvent("ViewContent", {
            userAgent: userAgent || request.headers.get("user-agent") || undefined,
          });
        }
      }
    }

    // Handle Lead event (quiz completion / email capture)
    if (type === "lead") {
      sendFBEvent("Lead", {
        email: bodyEmail || userEmail || undefined,
        userAgent: userAgent || request.headers.get("user-agent") || undefined,
        eventId: fbEventId || undefined,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics track error:", error);
    // Don't fail the request for analytics errors
    return NextResponse.json({ success: true });
  }
}
