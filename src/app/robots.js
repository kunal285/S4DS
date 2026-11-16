export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://s4ds.mitaoe.ac.in";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/technex-2k26", "/contact"],
        disallow: [
          "/admin/",
          "/api/",
          "/about",
          "/events",
          "/projects",
          "/team",
          "/gallery",
          "/membership",
          "/join",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
