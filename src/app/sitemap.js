import { PUBLIC_PAGES_CONFIG } from "@/config/site-mode";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://s4ds.mitaoe.ac.in";
  const now = new Date();

  // Only include live public routes in the sitemap during temporary launch
  const routes = Object.entries(PUBLIC_PAGES_CONFIG)
    .filter(([route, status]) => status === "live" && !route.startsWith("/registration"))
    .map(([route]) => route);

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/technex-2k26" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/technex-2k26" ? 0.9 : 0.8,
  }));
}
