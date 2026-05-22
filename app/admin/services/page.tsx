import { Briefcase, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const services = [
  { slug: 'web-development', title: 'Web Development', icon: '🌐' },
  { slug: 'mobile-development', title: 'Mobile App Development', icon: '📱' },
  { slug: 'software-sales', title: 'Penjualan Software', icon: '📦' },
  { slug: 'ai-integration', title: 'AI Integration', icon: '🤖' },
]

export default function ServicesAdminPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6" /> Layanan
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Konten layanan dikelola melalui file terjemahan. Klik untuk melihat halaman layanan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {services.map(s => (
          <div key={s.slug} className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-medium text-sm">{s.title}</p>
                <p className="text-xs text-muted-foreground">/services/{s.slug}</p>
              </div>
            </div>
            <Link
              href={`/id/services/${s.slug}`}
              target="_blank"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Lihat <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Info</p>
        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
          Untuk mengubah konten layanan (judul, deskripsi, fitur, proses, FAQ), edit file{' '}
          <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">messages/id.json</code> dan{' '}
          <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">messages/en.json</code>{' '}
          di bagian <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">services.items</code>.
        </p>
      </div>
    </div>
  )
}
