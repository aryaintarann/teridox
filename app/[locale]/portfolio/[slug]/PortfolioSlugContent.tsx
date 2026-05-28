'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import CTASection from '@/components/sections/CTASection'

interface PortfolioItem {
  id: string; title: string; title_en: string; slug: string
  description: string; description_en: string
  challenge: string; challenge_en: string
  solution: string; solution_en: string
  outcome: string; outcome_en: string
  technologies: string[]; image_url: string; project_url: string
  category: string; featured: boolean; created_at: string
}

const CAT_COLOR: Record<string, string> = {
  web: '#0F1B2D', mobile: '#0F172A', saas: '#1E1B4B', ai: '#1A0533',
}

export default function PortfolioSlugContent() {
  const { slug }  = useParams() as { slug: string }
  const t         = useTranslations('portfolio')
  const locale    = useLocale()

  const [item, setItem]         = useState<PortfolioItem | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    createClient()
      .from('portfolio_items')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true) } else { setItem(data) }
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="pt-16 section-padding">
        <div className="container-max space-y-4 animate-pulse">
          <div className="h-72 rounded-3xl bg-muted" />
          <div className="h-8 w-1/2 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (notFound || !item) {
    return (
      <div className="pt-16 section-padding">
        <div className="container-max text-center py-20">
          <p className="text-4xl font-bold mb-4">404</p>
          <p className="text-muted-foreground mb-6">{locale === 'en' ? 'Project not found.' : 'Proyek tidak ditemukan.'}</p>
          <Link href="/portfolio" className="text-primary hover:underline font-semibold">{t('title')}</Link>
        </div>
      </div>
    )
  }

  const bgColor = CAT_COLOR[item.category.toLowerCase()] ?? '#0F1B2D'
  const isEn = locale === 'en'
  const localTitle       = (isEn && item.title_en)       ? item.title_en       : item.title
  const localDescription = (isEn && item.description_en) ? item.description_en : item.description
  const localChallenge   = (isEn && item.challenge_en)   ? item.challenge_en   : item.challenge
  const localSolution    = (isEn && item.solution_en)    ? item.solution_en    : item.solution
  const localOutcome     = (isEn && item.outcome_en)     ? item.outcome_en     : item.outcome

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-max">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> {t('title')}
          </Link>

          {item.image_url ? (
            <div className="w-full rounded-3xl overflow-hidden mb-10 bg-muted flex items-center justify-center">
              <img src={item.image_url} alt={item.title} className="w-full h-auto max-h-[70vh] object-contain" />
            </div>
          ) : (
            <div className="rounded-3xl h-72 flex items-center justify-center mb-10" style={{ background: bgColor }}>
              <span className="text-white/20 text-[140px] font-black leading-none">{item.title.charAt(0)}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-primary font-semibold text-sm">{item.category}</span>
                <h1 className="text-3xl md:text-4xl font-extrabold mt-1 mb-6">{localTitle}</h1>
                {localDescription && (
                  <p className="text-muted-foreground leading-relaxed text-lg">{localDescription}</p>
                )}
              </motion.div>

              {[
                { label: t('challenge'), content: localChallenge },
                { label: t('solution'),  content: localSolution  },
                { label: t('outcome'),   content: localOutcome   },
              ].filter(s => s.content).map(({ label, content }) => (
                <div key={label}>
                  <h2 className="text-xl font-bold mb-3 text-primary">{label}</h2>
                  <p className="text-muted-foreground leading-relaxed">{content}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 space-y-6">
              {item.technologies?.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold mb-4">{t('technologies')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map(tag => (
                      <span key={tag} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              {item.project_url && (
                <a href={item.project_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors">
                  {t('visitSite')} <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <div className="bg-card border border-border rounded-2xl p-6 text-sm text-muted-foreground space-y-2">
                <div><span className="font-medium text-foreground">{locale === 'en' ? 'Category' : 'Kategori'}:</span> {item.category}</div>
                <div><span className="font-medium text-foreground">{locale === 'en' ? 'Year' : 'Tahun'}:</span> {new Date(item.created_at).getFullYear()}</div>
                {item.featured && <div className="text-primary font-semibold">★ Featured Project</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
