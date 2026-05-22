'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import CTASection from '@/components/sections/CTASection'

type ServiceItem = {
  slug: string
  title: string
  desc: string
  features: string[]
  process: Array<{ step: number; title: string; desc: string }>
  detailFaq: Array<{ q: string; a: string }>
}

export default function ServiceDetailPage() {
  const { slug } = useParams() as { slug: string }
  const t = useTranslations('services')
  const d = useTranslations('services.detail')
  const items = t.raw('items') as ServiceItem[]
  const item = items.find(i => i.slug === slug) ?? null
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  if (!item) {
    return (
      <div className="pt-16 section-padding text-center text-muted-foreground">
        {d('notFound')}
      </div>
    )
  }

  return (
    <div className="pt-16">
      <section className="section-padding" style={{ background: 'var(--muted)' }}>
        <div className="container-max">
          <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            ← {t('title')}
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-extrabold mb-4">
            {item.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg max-w-2xl">
            {item.desc}
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{d('featuresHeading')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {item.features.map((f) => (
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
              <h2 className="text-2xl font-bold mb-6">{d('processHeading')}</h2>
              <div className="space-y-4">
                {item.process.map((p) => (
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
              <h2 className="text-2xl font-bold mb-6">{d('faqHeading')}</h2>
              <div className="space-y-3">
                {item.detailFaq.map((f, i) => (
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
              <h3 className="text-xl font-bold mb-3">{d('sidebarTitle')}</h3>
              <p className="text-blue-100 text-sm mb-6">{d('sidebarDesc')}</p>
              <Button asChild className="w-full bg-white text-blue-700 hover:bg-blue-50 rounded-xl gap-2 font-semibold">
                <Link href="/contact">
                  {d('sidebarCta')} <ArrowRight className="h-4 w-4" />
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
