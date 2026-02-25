import { resend } from "@/lib/resend";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://strideandsteel.com";
const DASHBOARD_URL = `${BASE_URL}/dashboard`;

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
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <span style="color:#f97316;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Stride & Steel</span>
            </td>
          </tr>
          <tr>
            <td style="background-color:#18181b;border-radius:12px;padding:40px 32px;">
              ${content}
            </td>
          </tr>
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

const trialTemplates = {
  // Day 0: Welcome — sent immediately on subscription creation
  trial_day0: (user) => ({
    subject: "Your Hybrid Athlete plan is ready",
    html: layout(
      `<h1 style="color:#ffffff;font-size:22px;margin:0 0 16px;">Your plan is ready, ${user.name?.split(" ")[0] || "Athlete"}</h1>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Welcome to Stride & Steel! Your <strong style="color:#f97316;">${user.archetype || "Hybrid Athlete"}</strong> training plan is live in your dashboard.
       </p>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Here's what's waiting for you:
       </p>
       <ul style="color:#d4d4d8;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
         <li>Your personalized weekly workout plan</li>
         <li>Strength + running sessions programmed together</li>
         <li>Active recovery built in</li>
         <li>Progress tracking for every workout</li>
       </ul>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Open your dashboard and start today's workout. Your first session takes less than an hour.
       </p>
       ${ctaButton("Start Today's Workout →", DASHBOARD_URL)}
       <p style="color:#71717a;font-size:13px;margin-top:24px;">
         Your 7-day free trial is active. Cancel anytime in Settings.
       </p>`,
      user.id
    ),
  }),

  // Day 1: Why your archetype matters
  trial_day1: (user) => ({
    subject: `Why your ${user.archetype || "Hybrid Athlete"} archetype matters`,
    html: layout(
      `<h1 style="color:#ffffff;font-size:22px;margin:0 0 16px;">Why your archetype matters</h1>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Hey ${user.name?.split(" ")[0] || "there"},
       </p>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         You were matched as <strong style="color:#f97316;">${user.archetype || "a Hybrid Athlete"}</strong>. That's not a label — it's how your entire plan is built.
       </p>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Your archetype determines:
       </p>
       <ul style="color:#d4d4d8;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
         <li>How many days are lifting vs. running vs. recovery</li>
         <li>The intensity and volume of each session</li>
         <li>How workouts are sequenced to avoid interference</li>
         <li>How your plan progresses week over week</li>
       </ul>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Most generic programs treat every athlete the same. Yours doesn't. Every workout in your dashboard is built around your profile.
       </p>
       ${ctaButton("See Today's Workout →", DASHBOARD_URL)}`,
      user.id
    ),
  }),

  // Day 3: The science behind your plan
  trial_day3: (user) => ({
    subject: "The science behind your hybrid plan",
    html: layout(
      `<h1 style="color:#ffffff;font-size:22px;margin:0 0 16px;">The science behind your plan</h1>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Hey ${user.name?.split(" ")[0] || "there"},
       </p>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         The biggest mistake hybrid athletes make? Running and lifting on the same schedule without considering <strong style="color:#ffffff;">interference</strong>.
       </p>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Your Stride & Steel plan avoids this by:
       </p>
       <ul style="color:#d4d4d8;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
         <li><strong style="color:#ffffff;">Session sequencing</strong> — hard runs and heavy lifts are never back-to-back</li>
         <li><strong style="color:#ffffff;">Progressive overload</strong> — your plan adapts week over week based on your feedback</li>
         <li><strong style="color:#ffffff;">Built-in recovery</strong> — deload logic and active recovery prevent burnout</li>
         <li><strong style="color:#ffffff;">4-5 hour design</strong> — full programming for real schedules, not 15-hour weeks</li>
       </ul>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Have you tried this week's workouts yet? Each one is designed to build on the last.
       </p>
       ${ctaButton("Open Your Dashboard →", DASHBOARD_URL)}`,
      user.id
    ),
  }),

  // Day 5: Halfway through — preview of week 2
  trial_day5: (user) => ({
    subject: "You're halfway through — here's what week 2 looks like",
    html: layout(
      `<h1 style="color:#ffffff;font-size:22px;margin:0 0 16px;">Halfway through your trial</h1>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Hey ${user.name?.split(" ")[0] || "there"},
       </p>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         You're 5 days into your free trial. Here's what's coming in Week 2:
       </p>
       <ul style="color:#d4d4d8;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
         <li>Progressive overload on your main lifts</li>
         <li>Running volume builds based on your archetype</li>
         <li>New exercise variations to prevent plateaus</li>
         <li>Adjusted based on your workout feedback</li>
       </ul>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Features you might not have tried yet:
       </p>
       <ul style="color:#d4d4d8;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
         <li><strong style="color:#ffffff;">Pre & post workout check-ins</strong> — rate energy, soreness, and difficulty after each session</li>
         <li><strong style="color:#ffffff;">Weight logging</strong> — track your lifts to see progress over time</li>
         <li><strong style="color:#ffffff;">Race training mode</strong> — add a race and get a periodized plan</li>
       </ul>
       ${ctaButton("Continue Training →", DASHBOARD_URL)}`,
      user.id
    ),
  }),

  // Day 6: Trial ends tomorrow
  trial_day6: (user) => ({
    subject: "Your trial ends tomorrow",
    html: layout(
      `<h1 style="color:#ffffff;font-size:22px;margin:0 0 16px;">Your trial ends tomorrow</h1>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Hey ${user.name?.split(" ")[0] || "there"},
       </p>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Your free trial ends tomorrow. If you've been following the plan, you already know — this isn't another cookie-cutter program.
       </p>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Here's what you keep when you stay:
       </p>
       <ul style="color:#d4d4d8;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
         <li>New personalized workouts every week</li>
         <li>Progressive overload that adapts to your feedback</li>
         <li>Race-specific training when you need it</li>
         <li>The <strong style="color:#f97316;">PR-or-Free Promise</strong> — set a PR in 90 days or train free</li>
       </ul>
       <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 16px;">
         No action needed to continue — your subscription will activate automatically. If it's not for you, just cancel in Settings before tomorrow. No hard feelings.
       </p>
       <p style="color:#f97316;font-size:15px;font-weight:600;line-height:1.6;margin:0 0 16px;">
         Either you PR, or you train free. You literally cannot lose.
       </p>
       ${ctaButton("Open Your Dashboard →", DASHBOARD_URL)}`,
      user.id
    ),
  }),
};

/**
 * Send a trial onboarding email.
 * @param {Object} user - User record from DB
 * @param {string} emailType - One of: trial_day0, trial_day1, trial_day3, trial_day5, trial_day6
 */
export async function sendTrialEmail(user, emailType) {
  if (user.unsubscribedFromEmail) return { skipped: true, reason: "unsubscribed" };
  if (!resend) return { skipped: true, reason: "resend_not_configured" };

  const template = trialTemplates[emailType];
  if (!template) return { skipped: true, reason: "unknown_email_type" };

  const { subject, html } = template(user);

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
