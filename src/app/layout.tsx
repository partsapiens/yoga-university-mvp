// src/app/layout.tsx
import Script from "next/script";
import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://fltwht.com";
const ADSENSE_PUBLISHER = "ca-pub-9900806169268429"; // <-- replace if you ever change accounts

const defaultTitle = "Yoga Flow University | AI-Powered Yoga & Meditation";
const defaultDescription =
  "Create personalized yoga flows with AI, explore a comprehensive 500+ pose library, and deepen your practice with guided meditations. For yogis of all levels.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: defaultTitle,
    template: "%s | Yoga Flow University",
  },
  description: defaultDescription,
  themeColor: "#000000",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: defaultTitle,
    siteName: "Yoga Flow University",
    description: defaultDescription,
    images: [
      {
        url: "/images/pose-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Yoga Flow University",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/images/pose-placeholder.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* AdSense account declaration (helps crawler discover your account) */}
        <meta name="google-adsense-account" content={ADSENSE_PUBLISHER} />
        {/* Optional: Search Console or other site verifications can go here */}
        {/* <meta name="google-site-verification" content="XXXX" /> */}
      </head>
      <body>
        <AppProviders>
          {children}
        </AppProviders>

        {/* AdSense loader script (must be in <head>, async, with your client id) */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        {/* If you render display ad units manually, you can queue them like this:
            <script dangerouslySetInnerHTML={{
              __html: '(adsbygoogle = window.adsbygoogle || []).push({});'
            }} />
          */}
      </body>
    </html>
  );
}
