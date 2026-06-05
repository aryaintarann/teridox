import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { cookies } from 'next/headers'
import { Providers } from './providers'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  weight: ['300', '400', '500', '600', '700'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#060D1A' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://teridox.com'),
  title: {
    default: 'Teridox — Software House Bali',
    template: '%s | Teridox',
  },
  description:
    'Teridox adalah software house dari Bali. Spesialis web development, mobile app, dan pengembangan SaaS untuk bisnis yang ingin berkembang.',
  keywords: ['software house', 'web development', 'mobile app', 'SaaS development', 'AI integration', 'Bali', 'Indonesia', 'software house Bali'],
  authors: [{ name: 'Teridox', url: 'https://teridox.com' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo/1.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Teridox',
    locale: 'id_ID',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@teridox',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const resolvedTheme = cookieStore.get('theme')?.value
  const darkClass = resolvedTheme === 'dark' ? ' dark' : ''

  return (
    <html lang="id" suppressHydrationWarning data-scroll-behavior="smooth" className={`${syne.variable} ${dmSans.variable}${darkClass}`}>
      <head>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ptorksiyvbenpwvabils.supabase.co" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
