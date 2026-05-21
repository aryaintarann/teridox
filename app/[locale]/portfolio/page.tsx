'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ExternalLink } from 'lucide-react'

const projects = [
  { slug: 'saas-crm', title: 'CRM Platform SaaS', category: 'SaaS', tags: ['Next.js', 'Supabase', 'Stripe'], gradient: 'from-blue-600 to-indigo-700', desc: 'Multi-tenant CRM untuk 500+ perusahaan' },
  { slug: 'fintech-app', title: 'Fintech Mobile App', category: 'Mobile', tags: ['Flutter', 'Firebase'], gradient: 'from-violet-600 to-purple-700', desc: 'Aplikasi keuangan digital dengan fitur lengkap' },
  { slug: 'elearning', title: 'E-Learning Platform', category: 'Web', tags: ['React', 'Node.js'], gradient: 'from-emerald-600 to-teal-700', desc: 'Platform belajar online dengan sertifikasi' },
  { slug: 'hrms', title: 'HRMS System', category: 'SaaS', tags: ['Next.js', 'PostgreSQL'], gradient: 'from-rose-600 to-pink-700', desc: 'Manajemen SDM untuk perusahaan menengah' },
  { slug: 'delivery-app', title: 'Delivery Tracking App', category: 'Mobile', tags: ['React Native', 'Maps API'], gradient: 'from-orange-600 to-amber-600', desc: 'Aplikasi tracking pengiriman real-time' },
  { slug: 'company-website', title: 'Corporate Website', category: 'Web', tags: ['Next.js', 'CMS'], gradient: 'from-cyan-600 to-blue-600', desc: 'Website company profile premium dengan CMS' },
]

const categories = ['All', 'Web', 'Mobile', 'SaaS']

export default function PortfolioPage() {
  const t = useTranslations('portfolio')
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active)

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
          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  active === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <div className={`bg-gradient-to-br ${p.gradient} h-48 flex items-center justify-center relative`}>
                    <span className="text-white/20 text-8xl font-black">{p.title.charAt(0)}</span>
                    <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-muted px-2.5 py-0.5 rounded-full text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                    <Link href={`/portfolio/${p.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                      {t('viewProject')} <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
