// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://fltwht.com";
const ADSENSE_PUBLISHER = "ca-pub-9900806169268429"; // <-- replace if you ever change accounts

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "fltwht",
    template: "%s | fltwht",
  },
  description:
    "fltwht — flows, breath, and tools for practice. Build, explore, and share your yoga flows.",
  themeColor: "#000000",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "fltwht",
    siteName: "fltwht",
    description:
      "fltwht — flows, breath, and tools for practice. Build, explore, and share your yoga flows.",
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    site: "@fltwht",
    creator: "@fltwht",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* AdSense account declaration (helps crawler discover your account) */}
        <meta name="google-adsense-account" content={ADSENSE_PUBLISHER} />

        {/* AdSense loader script (must be in <head>, async, with your client id) */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9900806169268429"
     crossOrigin="anonymous"></script>

        {/* Optional: Search Console or other site verifications can go here */}
        {/* <meta name="google-site-verification" content="XXXX" /> */}
      </head>
      <body>
        {children}

        {/* If you render display ad units manually, you can queue them like this:
            <script dangerouslySetInnerHTML={{
              __html: '(adsbygoogle = window.adsbygoogle || []).push({});'
            }} />
          */}
      </body>
    </html>
  );
}
