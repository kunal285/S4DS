export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://s4ds.mitaoe.ac.in";
  const now = new Date();

  const routes = [
    "",
    "/about",
    "/events",
    "/technex-2k26",
    "/team",
    "/gallery",
    "/membership",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/technex-2k26" || route === "/events" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/technex-2k26" ? 0.9 : 0.8,
  }));
}
