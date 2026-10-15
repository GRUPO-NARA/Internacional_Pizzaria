import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://internacional-pizzaria.carlosrodriguesreal.chatgpt.site";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/unidades/renascenca`, changeFrequency: "weekly", priority: .8 },
    { url: `${base}/unidades/cohama`, changeFrequency: "weekly", priority: .8 },
    { url: `${base}/unidades/cohafuma`, changeFrequency: "weekly", priority: .8 },
  ];
}
