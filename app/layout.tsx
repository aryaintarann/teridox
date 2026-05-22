import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
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

export const metadata: Metadata = {
  title: {
    default: 'Teridox — Full-Service Digital Agency Bali',
    template: '%s | Teridox',
  },
  description:
    'Teridox adalah full-service digital agency dari Bali. Web development, mobile app, UI/UX design, digital marketing, dan AI integration untuk bisnis yang ingin berkembang.',
  keywords: ['software house', 'web development', 'mobile app', 'digital agency', 'UI/UX design', 'AI integration', 'Bali', 'Indonesia'],
  authors: [{ name: 'Teridox', url: 'https://teridox.com' }],
  openGraph: {
    type: 'website',
    siteName: 'Teridox',
    locale: 'id_ID',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');var dark=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);}catch(e){}` }} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
