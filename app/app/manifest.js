export default function manifest() {
  return {
    name: "Cryptara Holdings",
    short_name: "Cryptara",
    description:
      "Digital asset holding company managing diversified crypto portfolios for long-term holders.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#1e0f1e",
    theme_color: "#1e0f1e",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}