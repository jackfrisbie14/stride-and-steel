import { resend } from "@/lib/resend";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://strideandsteel.com";
const PRICING_URL = `${BASE_URL}/pricing`;

function unsubscribeUrl(userId) {
  const token = Buffer.from(userId).toString("base64");
  return `${BASE_URL}/api/email/unsubscribe?token=${token}`;
}

function layout(content, userId) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090b;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <span style="color:#f97316;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Stride & Steel</span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="background-color:#18181b;border-radius:12px;padding:40px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <a href="${unsubscribeUrl(userId)}" style="color:#71717a;font-size:12px;text-decoration:underline;">Unsubscribe from these emails</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text, href) {
  return `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
  <tr>
    <td align="center">
      <a href="${href}" style="display:inline-block;background-color:#f97316;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">${text}</a>
    </td>
  </tr>
</table>`;
}

const typeEmoji = { Lift: "🏋️", Run: "🏃", Recovery: "🧘", Swim: "🏊", Bike: "🚴" };
const dayAbbrev = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
  Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};
const dayColors = {
  Monday: "#22c55e", Tuesday: "#3b82f6", Wednesday: "#22c55e",
  Thursday: "#a855f7", Friday: "#3b82f6", Saturday: "#22c55e", Sunday: "#71717a",
};

function workoutPreviewHtml(workouts, archetype) {
  if (!workouts || workouts.length === 0) return "";

  const rows = workouts.map((w, i) => {
    const emoji = typeEmoji[w.type] || "💪";
    const color = dayColors[w.day] || "#d4d4d8";
    const abbrev = dayAbbrev[w.day] || w.day;
    const bg = i % 2 === 1 ? "#0d0d0f" : "#09090b";
    const exercises = Array.isArray(w.exercises) ? w.exercises : [];
    const preview = exercises.slice(0, 3).map((e) => {
      const name = e.name || e.exercise || "";
      const detail = e.sets && e.reps ? ` · ${e.sets}×${e.reps}` : e.duration ? ` · ${e.duration}` : "";
      return `<span style="color:#a1a1aa;font-size:12px;">  •  ${name}${detail}</span>`;
    }).join("<br/>");
    const more = exercises.length > 3 ? `<br/><span style="color:#71717a;font-size:11px;font-style:italic;">  + ${exercises.length - 3} more</span>` : "";

    return `<tr style="background-color:${bg};">
      <td style="padding:12px 14px;border-bottom:1px solid #1c1c1f;">
        <div>
          <span style="color:${color};font-size:13px;font-weight:600;min-width:32px;display:inline-block;">${abbrev}</span>
          <span style="color:#d4d4d8;font-size:13px;margin-left:4px;">${emoji} ${w.title}</span>
        </div>
        ${preview ? `<div style="margin-top:6px;padding-left:4px;">${preview}${more}</div>` : ""}
      </td>
    </tr>`;
  }).join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 8px;">
      <tr>
        <td style="padding:10px 14px;background-color:#09090b;border-radius:8px 8px 0 0;border:1px solid #27272a;border-bottom:none;">
          <span style="color:#f97316;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Your Week 1 — ${archetype || "Hybrid Athlete"}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:0;border:1px solid #27272a;border-top:none;border-radius:0 0 8px 8px;overflow:hidden;">
          <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        </td>
      </tr>
    </table>
    <div style="text-align:center;margin:8px 0 16px;">
      <a href="${PRICING_URL}" style="color:#f97316;font-size:13px;text-decoration:underline;">See full workout details →</a>
    </div>`;
}

const templates = {
  // 1 hour after signup — show them their actual workouts
  drip_1hr: (user, workouts) => ({
    subject: `${user.name?.split(" ")[0] || "Hey"}, here's your Week 1 training plan`,
    html: layout(
      `<h1 style="color:#ffffff;font-size:22px;margin:0 0 16px;">Your plan is ready</h1>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Hey${user.name ? ` ${user.name.split(" ")[0]}` : ""},
       </p>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         We built you a personalized training plan based on your <strong style="color:#f97316;">${user.archetype || "Hybrid Athlete"}</strong> profile — running and lifting programmed together so they don't conflict.
       </p>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 4px;">
         Here's what your first week looks like:
       </p>
       ${workoutPreviewHtml(workouts, user.archetype)}
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Every workout includes specific exercises, sets, reps, and pacing — and adapts each week based on your feedback.
       </p>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Try everything free for 7 days. Just <strong style="color:#ffffff;">$19.99/mo</strong> after that — cancel anytime.
       </p>
       ${ctaButton("Start Your 7-Day Free Trial →", PRICING_URL)}`,
      user.id
    ),
  }),

  // 24 hours — value comparison + reminder of their workouts
  drip_24hr: (user, workouts) => ({
    subject: "Your personalized workouts are waiting",
    html: layout(
      `<h1 style="color:#ffffff;font-size:22px;margin:0 0 16px;">What's your training actually costing you?</h1>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Let's be real about what personalized coaching costs:
       </p>
       <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
         <tr>
           <td style="padding:12px 16px;border-left:3px solid #f97316;background-color:#1c1c1f;border-radius:0 8px 8px 0;margin-bottom:8px;">
             <span style="color:#71717a;font-size:13px;">Personal running coach</span><br/>
             <span style="color:#ffffff;font-size:18px;font-weight:700;">$200–400/month</span>
           </td>
         </tr>
         <tr><td style="height:8px;"></td></tr>
         <tr>
           <td style="padding:12px 16px;border-left:3px solid #f97316;background-color:#1c1c1f;border-radius:0 8px 8px 0;margin-bottom:8px;">
             <span style="color:#71717a;font-size:13px;">Personal trainer (2x/week)</span><br/>
             <span style="color:#ffffff;font-size:18px;font-weight:700;">$480–800/month</span>
           </td>
         </tr>
         <tr><td style="height:8px;"></td></tr>
         <tr>
           <td style="padding:12px 16px;border-left:3px solid #f97316;background-color:#1c1c1f;border-radius:0 8px 8px 0;">
             <span style="color:#71717a;font-size:13px;">Stride & Steel (both, personalized)</span><br/>
             <span style="color:#f97316;font-size:18px;font-weight:700;">$19.99/month</span>
           </td>
         </tr>
       </table>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Your <strong style="color:#f97316;">${user.archetype || "Hybrid Athlete"}</strong> plan is still waiting — here's a reminder of what's inside:
       </p>
       ${workoutPreviewHtml(workouts, user.archetype)}
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         7-day free trial. <strong style="color:#ffffff;">$19.99/mo</strong> after. Cancel anytime.
       </p>
       ${ctaButton("Start Your Free Trial →", PRICING_URL)}`,
      user.id
    ),
  }),

  // 72 hours — urgency + one more look at their workouts
  drip_72hr: (user, workouts) => ({
    subject: `${user.name?.split(" ")[0] || "Hey"}, your training plan is still here`,
    html: layout(
      `<h1 style="color:#ffffff;font-size:22px;margin:0 0 16px;">Still thinking about it?</h1>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         ${user.name ? `${user.name.split(" ")[0]}, your` : "Your"} <strong style="color:#f97316;">${user.archetype || "Hybrid Athlete"}</strong> training plan is still in your dashboard — fully built out and ready to go.
       </p>
       ${workoutPreviewHtml(workouts, user.archetype)}
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Every day without structured programming is a day of wasted potential. No more guessing what to do at the gym or how to balance running with lifting.
       </p>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         <strong style="color:#ffffff;">Free for 7 days</strong> — nothing to lose. $19.99/mo after that if you love it.
       </p>
       ${ctaButton("Start Your Free Trial →", PRICING_URL)}`,
      user.id
    ),
  }),
};

export async function sendDripEmail(user, emailType) {
  if (user.unsubscribedFromEmail) return { skipped: true, reason: "unsubscribed" };
  if (!resend) return { skipped: true, reason: "resend_not_configured" };

  const template = templates[emailType];
  if (!template) return { skipped: true, reason: "unknown_email_type" };

  // Fetch the user's personalized workouts for the email preview
  let workouts = [];
  try {
    workouts = await prisma.workout.findMany({
      where: { userId: user.id, weekNumber: 1, source: "quiz" },
      orderBy: { dayNumber: "asc" },
      select: { day: true, type: true, title: true, dayNumber: true, exercises: true },
    });
  } catch (e) {
    console.error(`Failed to fetch workouts for ${user.email}:`, e);
  }

  const { subject, html } = template(user, workouts);

  const { error } = await resend.emails.send({
    from: "Stride & Steel <hello@strideandsteel.com>",
    to: user.email,
    subject,
    html,
  });

  if (error) {
    console.error(`Failed to send ${emailType} to ${user.email}:`, error);
    return { sent: false, error };
  }

  await prisma.emailLog.create({
    data: {
      userId: user.id,
      emailType,
    },
  });

  return { sent: true };
}
