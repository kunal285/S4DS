/**
 * S4DS MITAOE - Centralized Public Page Availability Configuration
 * All public pages are live and fully accessible.
 */

export const PUBLIC_PAGES_CONFIG = {
  "/": "live",
  "/technex-2k26": "live",
  "/contact": "live",
  "/about": "live",
  "/events": "live",
  "/projects": "live",
  "/team": "live",
  "/gallery": "live",
  "/membership": "live",
};

export async function isRouteLive() {
  // All public routes are live
  return true;
}
