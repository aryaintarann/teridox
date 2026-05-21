import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/i18n/routing'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import ChatWidget from '@/components/chatbot/ChatWidget'
import { Toaster } from '@/components/ui/sonner'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'id' | 'en')) {
    notFound()
  }
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
          <Toaster richColors position="top-right" />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
