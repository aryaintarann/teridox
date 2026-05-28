'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PortfolioItem {
  id: string; title: string; title_en: string; slug: string
  description: string; description_en: string
  technologies: string[]; category: string; featured: boolean; created_at: string; image_url: string
}

const CAT_COLOR: Record<string, string> = {
  web: '#0F1B2D', mobile: '#0F172A', saas: '#1E1B4B', ai: '#1A0533',
}
const FALLBACK_COLORS = ['#0F1B2D', '#1E1B4B', '#064E3B', '#0F172A', '#1A0533', '#451A03']

export default function PortfolioContent() {
  const t      = useTranslations('portfolio')
  const locale = useLocale()

  const [items, setItems]     = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive]   = useState('All')

  useEffect(() => {
    createClient()
      .from('portfolio_items')
      .select('id,title,title_en,slug,description,description_en,technologies,category,featured,created_at,image_url')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false) })
  }, [])

  const categories = ['All', ...Array.from(new Set(items.map(p => p.category)))]
  const filtered   = active === 'All' ? items : items.filter(p => p.category === active)

  return (
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
        <div className="container-max">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0,1,2,3,4,5].map(i => <div key={i} className="rounded-2xl bg-muted animate-pulse h-72" />)}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-semibold mb-2">{locale === 'en' ? 'No projects yet' : 'Belum ada proyek'}</p>
              <p className="text-sm">{locale === 'en' ? 'Check back soon!' : 'Segera hadir!'}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActive(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${active === cat ? 'bg-primary text-white shadow-md shadow-primary/25' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filtered.map((item, i) => {
                    const color = CAT_COLOR[item.category.toLowerCase()] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]
                    const isEn = locale === 'en'
                    const localTitle       = (isEn && item.title_en)       ? item.title_en       : item.title
                    const localDescription = (isEn && item.description_en) ? item.description_en : item.description
                    return (
                      <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
                        className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                        <div className="h-48 relative overflow-hidden" style={{ background: color, backgroundImage: item.image_url ? `url(${item.image_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                          {!item.image_url && (
                            <span className="absolute inset-0 flex items-center justify-center text-white/20 text-8xl font-black">{item.title.charAt(0)}</span>
                          )}
                          <div className="absolute inset-0" style={{ background: item.image_url ? 'rgba(0,0,0,0.25)' : 'transparent' }} />
                          <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
                            {item.category}
                          </span>
                          {item.featured && (
                            <span className="absolute top-3 left-3 bg-primary text-white text-xs px-2.5 py-1 rounded-full font-medium">Featured</span>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{localTitle}</h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{localDescription}</p>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {item.technologies.slice(0, 3).map(tag => (
                              <span key={tag} className="text-xs bg-muted px-2.5 py-0.5 rounded-full text-muted-foreground">{tag}</span>
                            ))}
                          </div>
                          <Link href={`/portfolio/${item.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                            {t('viewProject')} <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
