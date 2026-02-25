"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Generate or retrieve visitor ID
function getVisitorId() {
  if (typeof window === "undefined") return null;

  let visitorId = localStorage.getItem("ss_visitor_id");
  if (!visitorId) {
    visitorId = "v_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("ss_visitor_id", visitorId);
  }
  return visitorId;
}

// Capture UTM params from URL (first-touch only — don't overwrite)
function captureUtmParams() {
  if (typeof window === "undefined") return;

  // Only store on first touch
  if (localStorage.getItem("ss_utm_source")) return;

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");

  // Only store if at least utm_source is present
  if (utmSource) {
    localStorage.setItem("ss_utm_source", utmSource);
    const medium = params.get("utm_medium");
    const campaign = params.get("utm_campaign");
    const content = params.get("utm_content");
    if (medium) localStorage.setItem("ss_utm_medium", medium);
    if (campaign) localStorage.setItem("ss_utm_campaign", campaign);
    if (content) localStorage.setItem("ss_utm_content", content);
  }
}

// Get stored UTM data (returns null if no UTM params were captured)
export function getUtmData() {
  if (typeof window === "undefined") return null;

  const source = localStorage.getItem("ss_utm_source");
  if (!source) return null;

  return {
    utm_source: source,
    utm_medium: localStorage.getItem("ss_utm_medium") || undefined,
    utm_campaign: localStorage.getItem("ss_utm_campaign") || undefined,
    utm_content: localStorage.getItem("ss_utm_content") || undefined,
  };
}

// Track a page view
async function trackPageView(path) {
  const visitorId = getVisitorId();
  if (!visitorId) return;

  // Generate a shared event ID for Facebook dedup (client pixel + server CAPI)
  const fbEventId = "pv_" + Math.random().toString(36).substring(2) + Date.now().toString(36);

  // Fire client-side Facebook PageView with eventID for dedup
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView", {}, { eventID: fbEventId });
  }

  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pageview",
        path,
        visitorId,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent || null,
        fbEventId,
        utm: getUtmData(),
      }),
    });
  } catch (e) {
    // Silently fail
  }
}

// Track a funnel event
export async function trackFunnelEvent(step, metadata = null) {
  const visitorId = getVisitorId();
  if (!visitorId) return;

  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "funnel",
        step,
        visitorId,
        metadata,
        utm: getUtmData(),
      }),
    });
  } catch (e) {
    // Silently fail
  }
}

// Map paths to funnel steps
const pathToFunnelStep = {
  "/": "landing",
  "/quiz": "quiz_start",
  "/results": "quiz_complete",
  "/signup": "signup_page",
  "/signin": "signin_page",
  "/checkout": "checkout_page",
  "/dashboard": "dashboard",
};

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Capture UTM params on first page load
    captureUtmParams();

    // Track page view
    trackPageView(pathname);

    // Track funnel step if applicable
    const funnelStep = pathToFunnelStep[pathname];
    if (funnelStep) {
      trackFunnelEvent(funnelStep);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
