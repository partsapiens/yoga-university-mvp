import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { Toaster } from '@/components/ui/Toaster'

export const metadata = {
  title: 'Yoga Flow University - AI-Powered Yoga Platform',
  description: 'Create personalized yoga flows with AI assistance, track your practice, and grow your teaching skills.',
  keywords: 'yoga, flow, AI, poses, sequences, teacher training, mindfulness',
  authors: [{ name: 'Yoga Flow University Team' }],
  openGraph: {
    title: 'Yoga Flow University',
    description: 'AI-powered yoga platform for students and teachers',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-50 antialiased font-sans">
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-full">
              {children}
            </div>
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
