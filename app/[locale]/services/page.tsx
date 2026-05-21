'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Globe, Smartphone, Cloud, Palette, Zap, Server, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CTASection from '@/components/sections/CTASection'

const iconMap: Record<string, React.ElementType> = { Globe, Smartphone, Cloud, Palette, Zap, Server }

export default function ServicesPage() {
  const t = useTranslations('services')
  const items = t.raw('items') as Array<{ slug: string; icon: string; title: string; desc: string }>

  return (
    <div className="pt-16">
      <section className="section-padding" style={{ background: 'var(--muted)' }}>
        <div className="container-max text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-extrabold mb-4">
            {t('title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, i) => {
              const Icon = iconMap[item.icon] || Globe
              return (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{item.desc}</p>
                  <Button asChild variant="ghost" className="gap-2 px-0 group-hover:text-primary">
                    <Link href={`/services/${item.slug}`}>
                      {t('learnMore')} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
