/**
 * S4DS MITAOE - Centralized Public Page Availability Configuration
 * Dynamically queries RushDB settings to determine whether a route is live or under development.
 */

export const PUBLIC_PAGES_CONFIG = {
  "/": "live",
  "/technex-2k26": "live",
  "/contact": "live",
  "/about": "development",
  "/events": "development",
  "/projects": "development",
  "/team": "development",
  "/gallery": "development",
  "/membership": "development",
};

export async function isRouteLive(route) {
  const normalized = route === "/" ? "/" : route.replace(/\/$/, "");

  // Permanent live routes
  if (
    normalized === "/" ||
    normalized === "/technex-2k26" ||
    normalized === "/contact" ||
    normalized === "/registration/success"
  ) {
    return true;
  }

  // Client-side execution: fetch from settings API
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      const map = {
        "/about": "about",
        "/events": "events",
        "/projects": "projects",
        "/team": "team",
        "/gallery": "gallery",
        "/membership": "membership",
        "/join": "membership",
      };
      const key = map[normalized];
      return Boolean(json?.data?.pageAvailability?.[key]);
    } catch {
      return false;
    }
  }

  // Server-side execution: dynamic import of db without bundling fs into client
  try {
    const { getSettings } = await import("@/lib/db");
    const settings = await getSettings();
    const map = {
      "/about": "about",
      "/events": "events",
      "/projects": "projects",
      "/team": "team",
      "/gallery": "gallery",
      "/membership": "membership",
      "/join": "membership",
    };
    const key = map[normalized];
    if (key && settings?.pageAvailability) {
      return Boolean(settings.pageAvailability[key]);
    }
  } catch (err) {
    console.warn("Notice: isRouteLive check fallback:", err.message);
  }

  return false;
}
