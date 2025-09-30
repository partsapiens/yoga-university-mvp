import Script from 'next/script';
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Toaster } from '@/components/ui/Toaster'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://yoga-university.com'),
  title: {
    default: 'Yoga University - Your Personalized Yoga Journey',
    template: '%s | Yoga University'
  },
  description: 'Transform your practice with AI-powered personalized yoga flows, pose analysis, and guided meditation. Join thousands discovering their perfect yoga journey.',
  keywords: [
    'yoga',
    'meditation',
    'yoga flows',
    'personalized yoga',
    'AI yoga',
    'yoga poses',
    'mindfulness',
    'wellness',
    'yoga practice',
    'guided meditation'
  ],
  authors: [
    { name: 'Yoga University Team' },
    { name: 'Yoga University Development', url: 'https://yoga-university.com' }
  ],
  creator: 'Yoga University',
  publisher: 'Yoga University',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoga-university.com',
    siteName: 'Yoga University',
    title: 'Yoga University - Your Personalized Yoga Journey',
    description: 'Transform your practice with AI-powered personalized yoga flows, pose analysis, and guided meditation. Join thousands discovering their perfect yoga journey.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yoga University - Personalized Yoga Journey',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@YogaUniversity',
    creator: '@YogaUniversity',
    title: 'Yoga University - Your Personalized Yoga Journey',
    description: 'Transform your practice with AI-powered personalized yoga flows, pose analysis, and guided meditation.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icons/icon-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#2563eb' },
    ],
  },
  manifest: '/manifest.json',
  category: 'wellness',
  classification: 'Health & Wellness',
  referrer: 'origin-when-cross-origin',
  other: {
    'google-adsense-account': 'ca-pub-9900806169268429',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Yoga University',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Google AdSense - MUST be first element as per Google guidelines */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9900806169268429"
          crossOrigin="anonymous"
        ></script>
        
        
        {/* Performance optimizations - Preload critical resources */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        <link rel="preload" href="/_next/static/chunks/main.js" as="script" />
        
        {/* Viewport meta tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#2563eb" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e40af" media="(prefers-color-scheme: dark)" />
        
        {/* Ad network preconnects for performance */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Analytics */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-TJ9PF7HE8C"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-TJ9PF7HE8C');
              `}
            </Script>
          </>
        )}
        
        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className="h-full bg-gray-50 dark:bg-gray-900 antialiased font-sans">
        <ErrorBoundary>
          <ThemeProvider>
            <LanguageProvider>
              <QueryProvider>
                <AuthProvider>
                  <div className="min-h-full">
                    {children}
                  </div>
                  <Toaster />
                </AuthProvider>
              </QueryProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
