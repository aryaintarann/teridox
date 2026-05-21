'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Search, Clock, Calendar, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'

const posts = [
  { slug: 'cara-memilih-tech-stack-untuk-saas', category: 'SaaS', title: 'Cara Memilih Tech Stack yang Tepat untuk Produk SaaS Anda', excerpt: 'Memilih teknologi yang tepat bisa membuat atau menghancurkan produk SaaS Anda.', readingTime: 8, date: '15 Mei 2025', gradient: 'from-blue-600 to-indigo-600' },
  { slug: 'flutter-vs-react-native-2025', category: 'Mobile', title: 'Flutter vs React Native di 2025: Mana yang Lebih Baik?', excerpt: 'Perbandingan mendalam dua framework mobile terpopuler berdasarkan pengalaman nyata.', readingTime: 12, date: '8 Mei 2025', gradient: 'from-violet-600 to-purple-600' },
  { slug: 'nextjs-15-fitur-terbaru', category: 'Web Dev', title: 'Next.js 15: Fitur Terbaru yang Wajib Anda Ketahui', excerpt: 'Eksplorasi lengkap fitur-fitur baru di Next.js 15.', readingTime: 10, date: '1 Mei 2025', gradient: 'from-emerald-600 to-teal-600' },
  { slug: 'seo-untuk-saas-indonesia', category: 'SEO', title: 'Strategi SEO untuk Produk SaaS di Pasar Indonesia', excerpt: 'Tips dan strategi SEO yang spesifik untuk memasarkan produk SaaS ke pasar Indonesia.', readingTime: 9, date: '25 Apr 2025', gradient: 'from-orange-600 to-amber-600' },
  { slug: 'supabase-vs-firebase', category: 'Database', title: 'Supabase vs Firebase: Mana yang Tepat untuk Project Anda?', excerpt: 'Analisis mendalam Supabase dan Firebase dari perspektif developer Indonesia.', readingTime: 11, date: '18 Apr 2025', gradient: 'from-cyan-600 to-blue-600' },
  { slug: 'ui-ux-trend-2025', category: 'Design', title: 'Tren UI/UX 2025 yang Mendominasi Desain Digital', excerpt: 'Dari glassmorphism ke AI-driven design, berikut tren desain yang wajib diketahui.', readingTime: 7, date: '10 Apr 2025', gradient: 'from-rose-600 to-pink-600' },
]

const categories = ['All', 'SaaS', 'Mobile', 'Web Dev', 'SEO', 'Database', 'Design']

export default function BlogPage() {
  const t = useTranslations('blog')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div className="pt-16">
      <section className="section-padding bg-gradient-to-br from-blue-50 to-white dark:from-[#0a0f1e] dark:to-[#0d1526]">
        <div className="container-max text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-extrabold mb-4">
            {t('title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            {t('subtitle')}
          </motion.p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder={t('search')}
              className="pl-11 rounded-full"
            />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">Tidak ada artikel yang sesuai.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className={`bg-gradient-to-br ${post.gradient} h-36 flex items-end p-4`}>
                    <span className="text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{post.category}</span>
                  </div>
                  <div className="p-5">
                    <h2 className="font-bold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readingTime} {t('minRead')}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                      {t('readMore')} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
