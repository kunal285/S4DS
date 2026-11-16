/**
 * S4DS MITAOE - Centralized Public Page Availability Configuration
 * Controls which pages are live vs. in "coming-soon" (under development) mode.
 */

export const PUBLIC_PAGES_CONFIG = {
  "/": "live",
  "/technex-2k26": "live",
  "/contact": "live",
  "/registration/success": "live",
  "/about": "coming-soon",
  "/events": "coming-soon",
  "/projects": "coming-soon",
  "/team": "coming-soon",
  "/gallery": "coming-soon",
  "/membership": "coming-soon",
  "/join": "coming-soon",
};

/**
 * Check if a route is currently live
 * @param {string} route
 * @returns {boolean}
 */
export function isRouteLive(route) {
  // Normalize trailing slash
  const normalized = route === "/" ? "/" : route.replace(/\/$/, "");
  return PUBLIC_PAGES_CONFIG[normalized] === "live";
}
