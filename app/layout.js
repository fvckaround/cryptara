import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "./components/WhatsAppButton";
import InstallButton from "./components/InstallButton";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const SITE_URL = "https://cryptaraholdings.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cryptara Holdings — Digital Asset Holding Company",
    template: "%s | Cryptara Holdings",
  },
  description:
    "Cryptara Holdings manages diversified crypto portfolios for long-term holders. Fixed-term holding plans, transparent custody, and clear statements of what you hold.",
  keywords: [
    "crypto investment",
    "digital asset custody",
    "crypto holding plans",
    "bitcoin investment",
    "ethereum investment",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon-180.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Cryptara Holdings — Digital Asset Holding Company",
    description:
      "Fixed-term crypto holding plans, transparent custody, and clear statements of what you hold.",
    url: SITE_URL,
    siteName: "Cryptara Holdings",
    images: [
      {
        url: "/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Cryptara Holdings",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cryptara Holdings — Digital Asset Holding Company",
    description:
      "Fixed-term crypto holding plans, transparent custody, and clear statements of what you hold.",
    images: ["/hero-bg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#1e0f1e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              name: "Cryptara Holdings",
              url: SITE_URL,
              description:
                "Digital asset holding company managing diversified crypto portfolios for long-term holders.",
              areaServed: "Worldwide",
            }),
          }}
        />
        {children}
        <WhatsAppButton />
        <InstallButton />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function () {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}