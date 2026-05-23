'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Globe, Smartphone, Package, BrainCircuit, Code, Database, Cloud, Shield,
  Zap, Users, Settings, Layers, Server, BarChart2, Headphones, Layout, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import CTASection from '@/components/sections/CTASection'

const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Smartphone, Package, BrainCircuit, Code, Database,
  Cloud, Shield, Zap, Users, Settings, Layers, Server, BarChart2, Headphones, Layout,
}

interface Service {
  id: string; slug: string; icon: string; accent_color: string
  title: string; title_en: string; desc: string; desc_en: string
  display_order: number; active: boolean
}

export default function ServicesPage() {
  const t      = useTranslations('services')
  const locale = useLocale()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    createClient()
      .from('services')
      .select('id,slug,icon,accent_color,title,title_en,desc,desc_en,display_order,active')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => { setServices(data ?? []); setLoading(false) })
  }, [])

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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[0,1,2,3].map(i => <div key={i} className="rounded-2xl bg-muted animate-pulse h-64" />)}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">{locale === 'en' ? 'No services available.' : 'Belum ada layanan.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((item, i) => {
                const Icon  = ICON_MAP[item.icon] ?? Globe
                const title = locale === 'en' && item.title_en ? item.title_en : item.title
                const desc  = locale === 'en' && item.desc_en  ? item.desc_en  : item.desc
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="group bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${item.accent_color}20` }}>
                      <Icon className="h-7 w-7" style={{ color: item.accent_color }} />
                    </div>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{desc}</p>
                    <Button asChild variant="ghost" className="gap-2 px-0 group-hover:text-primary">
                      <Link href={`/services/${item.slug}`}>
                        {t('learnMore')} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  )
}
