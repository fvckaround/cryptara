const SITE_URL = "https://cryptaraholdings.com";

export default function sitemap() {
  const now = new Date();

  const staticPages = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/careers", priority: 0.4, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/security", priority: 0.6, changeFrequency: "monthly" },
    { path: "/help", priority: 0.5, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/risk-disclosure", priority: 0.3, changeFrequency: "yearly" },
    { path: "/register", priority: 0.8, changeFrequency: "monthly" },
    { path: "/login", priority: 0.4, changeFrequency: "monthly" },
  ];

  return staticPages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}