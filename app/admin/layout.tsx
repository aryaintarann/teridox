import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages({ locale: 'id' })

  return (
    <NextIntlClientProvider locale="id" messages={messages}>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/20">
          {children}
        </main>
      </div>
    </NextIntlClientProvider>
  )
}
