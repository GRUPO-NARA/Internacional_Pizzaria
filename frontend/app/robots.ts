import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/admin" }, sitemap: "https://internacional-pizzaria.carlosrodriguesreal.chatgpt.site/sitemap.xml" };
}
