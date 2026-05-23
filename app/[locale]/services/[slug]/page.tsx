'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import CTASection from '@/components/sections/CTASection'

interface Service {
  id: string; slug: string; icon: string; accent_color: string
  title: string; title_en: string; description: string; description_en: string
  features: string[]; features_en: string[]
  process: Array<{ step: number; title: string; desc: string }>
  process_en: Array<{ step: number; title: string; desc: string }>
  faq: Array<{ q: string; a: string }>
  faq_en: Array<{ q: string; a: string }>
}

export default function ServiceDetailPage() {
  const { slug } = useParams() as { slug: string }
  const t        = useTranslations('services')
  const d        = useTranslations('services.detail')
  const locale   = useLocale()

  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    if (!slug) return
    createClient()
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
      .then(({ data }) => { setService(data); setLoading(false) })
  }, [slug])

  if (loading) {
    return (
      <div className="pt-16 section-padding">
        <div className="container-max space-y-4 animate-pulse">
          <div className="h-8 w-1/3 bg-muted rounded" />
          <div className="h-12 w-2/3 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="pt-16 section-padding text-center text-muted-foreground">
        {d('notFound')}
      </div>
    )
  }

  const title    = locale === 'en' && service.title_en ? service.title_en : service.title
  const desc     = locale === 'en' && service.description_en ? service.description_en : service.description
  const features = locale === 'en' && service.features_en?.length ? service.features_en : service.features
  const process  = locale === 'en' && service.process_en?.length  ? service.process_en  : service.process
  const faq      = locale === 'en' && service.faq_en?.length      ? service.faq_en      : service.faq

  return (
    <div className="pt-16">
      <section className="section-padding" style={{ background: 'var(--muted)' }}>
        <div className="container-max">
          <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            ← {t('title')}
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-extrabold mb-4">
            {title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg max-w-2xl">
            {desc}
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">

            {/* Features */}
            {features?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{d('featuresHeading')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${service.accent_color}20` }}>
                        <Check className="h-3.5 w-3.5" style={{ color: service.accent_color }} />
                      </div>
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process */}
            {process?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{d('processHeading')}</h2>
                <div className="space-y-4">
                  {process.map((p) => (
                    <div key={p.step} className="flex gap-4 p-4 rounded-xl border border-border">
                      <div className="w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0" style={{ background: service.accent_color }}>
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
            )}

            {/* FAQ */}
            {faq?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{d('faqHeading')}</h2>
                <div className="space-y-3">
                  {faq.map((f, i) => (
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
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${service.accent_color}, ${service.accent_color}cc)` }}>
              <h3 className="text-xl font-bold mb-3">{d('sidebarTitle')}</h3>
              <p className="text-white/80 text-sm mb-6">{d('sidebarDesc')}</p>
              <Button asChild className="w-full bg-white hover:bg-white/90 rounded-xl gap-2 font-semibold" style={{ color: service.accent_color }}>
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
