export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://s4ds.mitaoe.ac.in";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
