'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import CTASection from '@/components/sections/CTASection'
import Script from 'next/script'

export default function FAQPage() {
  const t = useTranslations('faq')
  const items = t.raw('items') as Array<{ q: string; a: string }>
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="pt-16">
        <section className="section-padding" style={{ background: 'var(--muted)' }}>
          <div className="container-max text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-extrabold mb-4">
              {t('title')}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg max-w-xl mx-auto">
              {t('subtitle')}
            </motion.p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-max max-w-3xl">
            <div className="space-y-3">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-border rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-start justify-between gap-4 p-5 text-left font-semibold hover:bg-muted/50 transition-colors"
                  >
                    <span>{item.q}</span>
                    {openIndex === i
                      ? <ChevronUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      : <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    }
                  </button>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5"
                    >
                      <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </div>
    </>
  )
}
