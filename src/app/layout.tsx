import Script from 'next/script';
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { Toaster } from '@/components/ui/Toaster'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://yogaflowuniversity.com'),
  title: {
    default: 'Yoga Flow University - ✨-Powered Yoga Platform',
    template: '%s | Yoga Flow University'
  },
  description: 'Create personalized yoga flows with ✨ assistance, track your practice, and grow your teaching skills. Join thousands of yogis in our comprehensive platform.',
  keywords: [
    'yoga',
    'flow',
    'AI',
    'poses',
    'sequences',
    'teacher training',
    'mindfulness',
    'meditation',
    'breathing exercises',
    'yoga therapy',
    'wellness',
    'practice tracking'
  ],
  authors: [
    { name: 'Yoga Flow University Team' },
    { name: 'YFU Development', url: 'https://yogaflowuniversity.com' }
  ],
  creator: 'Yoga Flow University',
  publisher: 'Yoga Flow University',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Yoga Flow University',
    title: 'Yoga Flow University - ✨-Powered Yoga Platform',
    description: 'Create personalized yoga flows with ✨ assistance, track your practice, and grow your teaching skills.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yoga Flow University - ✨-Powered Yoga Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yogaflowuni',
    creator: '@yogaflowuni',
    title: 'Yoga Flow University - ✨-Powered Yoga Platform',
    description: 'Create personalized yoga flows with ✨ assistance, track your practice, and grow your teaching skills.',
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
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Yoga Flow',
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
        {/* Viewport meta tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#2563eb" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e40af" media="(prefers-color-scheme: dark)" />
        
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
      </body>
    </html>
  )
}
