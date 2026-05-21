'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'

const serviceData: Record<string, {
  features: string[]
  process: Array<{ step: number; title: string; desc: string }>
  faq: Array<{ q: string; a: string }>
}> = {
  'web-development': {
    features: [
      'Website responsif mobile-first',
      'SEO-optimized dengan Next.js SSG/ISR',
      'Performa tinggi (Lighthouse score >90)',
      'CMS admin panel',
      'Custom domain & SSL',
      'Analitik & tracking',
    ],
    process: [
      { step: 1, title: 'Discovery & Planning', desc: 'Kami memahami kebutuhan bisnis dan goals Anda.' },
      { step: 2, title: 'Design & Prototyping', desc: 'Membuat wireframe dan desain UI yang disetujui.' },
      { step: 3, title: 'Development', desc: 'Pengembangan dengan teknologi modern dan best practices.' },
      { step: 4, title: 'Testing & Launch', desc: 'QA menyeluruh sebelum go-live.' },
    ],
    faq: [
      { q: 'Berapa lama pembuatan website?', a: 'Company profile: 2–4 minggu. Web app kompleks: 2–4 bulan.' },
      { q: 'Teknologi apa yang digunakan?', a: 'Next.js, React, TypeScript, Tailwind CSS, Supabase/PostgreSQL.' },
      { q: 'Apakah ada revisi desain?', a: 'Ya, termasuk 3 kali revisi desain tanpa biaya tambahan.' },
    ],
  },
  'mobile-development': {
    features: [
      'iOS & Android dari satu codebase',
      'Desain native-like yang smooth',
      'Push notifications',
      'Offline mode support',
      'App Store & Google Play deployment',
      'Analytics terintegrasi',
    ],
    process: [
      { step: 1, title: 'Konsultasi & Scope', desc: 'Mendefinisikan fitur dan user flow aplikasi.' },
      { step: 2, title: 'UI/UX Design', desc: 'Prototype interaktif yang bisa dicoba sebelum development.' },
      { step: 3, title: 'Development Sprint', desc: 'Agile development dengan demo setiap 2 minggu.' },
      { step: 4, title: 'QA & Submit', desc: 'Testing di berbagai device dan submit ke app stores.' },
    ],
    faq: [
      { q: 'Flutter atau React Native?', a: 'Kami merekomendasikan Flutter untuk performa terbaik, React Native untuk integrasi React ecosystem.' },
      { q: 'Berapa lama review App Store?', a: 'Apple: 1–3 hari. Google Play: beberapa jam–2 hari.' },
      { q: 'Apakah support update di masa depan?', a: 'Ya, tersedia paket maintenance dan update fitur secara berkala.' },
    ],
  },
}

const defaultService = {
  features: ['Layanan profesional dan berkualitas tinggi', 'Tim berpengalaman', 'Dukungan penuh', 'Dokumentasi lengkap', 'Support pasca proyek', 'Garansi kualitas'],
  process: [
    { step: 1, title: 'Konsultasi', desc: 'Diskusi kebutuhan dan goals Anda.' },
    { step: 2, title: 'Perencanaan', desc: 'Menyusun proposal dan timeline.' },
    { step: 3, title: 'Eksekusi', desc: 'Pengerjaan dengan standar tinggi.' },
    { step: 4, title: 'Delivery', desc: 'Handover dan pelatihan penggunaan.' },
  ],
  faq: [
    { q: 'Bagaimana cara memulai proyek?', a: 'Hubungi kami untuk konsultasi gratis, lalu kami akan menyiapkan proposal.' },
    { q: 'Berapa lama waktu pengerjaan?', a: 'Tergantung kompleksitas proyek, biasanya 2–12 minggu.' },
    { q: 'Apakah ada garansi?', a: 'Ya, kami memberikan garansi bug fix 30 hari setelah delivery.' },
  ],
}

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const t = useTranslations('services')
  const items = t.raw('items') as Array<{ slug: string; title: string; desc: string }>
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="pt-16">
      <section className="section-padding bg-gradient-to-br from-blue-50 to-white dark:from-[#0a0f1e] dark:to-[#0d1526]">
        <div className="container-max">
          <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            ← {t('title')}
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-extrabold mb-4">
            Web Development
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg max-w-2xl">
            High-performance websites and web apps built with Next.js, React, and modern technologies.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Yang Anda Dapatkan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {defaultService.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Proses Kerja</h2>
              <div className="space-y-4">
                {defaultService.process.map((p) => (
                  <div key={p.step} className="flex gap-4 p-4 rounded-xl border border-border">
                    <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {p.step}
                    </div>
                    <div>
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold mb-6">FAQ</h2>
              <div className="space-y-3">
                {defaultService.faq.map((f, i) => (
                  <div key={i} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors"
                    >
                      {f.q}
                      {openFaq === i ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-muted-foreground text-sm">{f.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Siap Memulai?</h3>
              <p className="text-blue-100 text-sm mb-6">Konsultasikan kebutuhan proyek Anda dengan tim kami. Gratis, tanpa komitmen.</p>
              <Button asChild className="w-full bg-white text-blue-700 hover:bg-blue-50 rounded-xl gap-2 font-semibold">
                <Link href="/contact">
                  Hubungi Kami <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
