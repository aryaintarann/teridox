'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Search, Clock, Calendar, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

interface BlogPost {
  id: string; title: string; title_en: string; slug: string
  content: string; content_en: string; category: string
  reading_time_min: number; created_at: string; tags: string[]
  cover_image_url: string
}

const CAT_GRADIENT: Record<string, string> = {
  teknologi: 'from-blue-600 to-indigo-600',
  bisnis: 'from-violet-600 to-purple-600',
  tutorial: 'from-emerald-600 to-teal-600',
  berita: 'from-orange-600 to-amber-600',
  lainnya: 'from-cyan-600 to-blue-600',
}
const FALLBACK_GRADIENTS = [
  'from-blue-600 to-indigo-600', 'from-violet-600 to-purple-600',
  'from-emerald-600 to-teal-600', 'from-orange-600 to-amber-600',
  'from-rose-600 to-pink-600', 'from-cyan-600 to-blue-600',
]

function stripMd(text: string) {
  return text.replace(/^#{1,3}\s+/gm, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\n+/g, ' ').trim()
}

export default function BlogContent() {
  const t      = useTranslations('blog')
  const locale = useLocale()

  const [posts, setPosts]           = useState<BlogPost[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [activeCategory, setActive] = useState('All')

  useEffect(() => {
    createClient()
      .from('blog_posts')
      .select('id,title,title_en,slug,content,content_en,category,reading_time_min,created_at,tags,cover_image_url')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setPosts(data ?? []); setLoading(false) })
  }, [])

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))]

  const filtered = posts.filter(p => {
    const title   = locale === 'en' && p.title_en   ? p.title_en   : p.title
    const content = locale === 'en' && p.content_en ? p.content_en : p.content
    const matchSearch = title.toLowerCase().includes(search.toLowerCase()) ||
                        stripMd(content).toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div className="pt-16">
      <section className="section-padding" style={{ background: 'var(--muted)' }}>
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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className="rounded-2xl bg-muted animate-pulse h-72" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-semibold mb-2">{locale === 'en' ? 'No articles yet' : 'Belum ada artikel'}</p>
              <p className="text-sm">{locale === 'en' ? 'Check back soon!' : 'Segera hadir!'}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3 mb-10">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActive(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  {locale === 'en' ? 'No matching articles.' : 'Tidak ada artikel yang sesuai.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((post, i) => {
                    const title   = locale === 'en' && post.title_en   ? post.title_en   : post.title
                    const content = locale === 'en' && post.content_en ? post.content_en : post.content
                    const excerpt = stripMd(content).slice(0, 120) + '…'
                    const gradient = CAT_GRADIENT[post.category] ?? FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]
                    const date = new Date(post.created_at).toLocaleDateString(
                      locale === 'en' ? 'en-US' : 'id-ID',
                      { day: 'numeric', month: 'short', year: 'numeric' }
                    )
                    return (
                      <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
                        className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                        <div className={`${post.cover_image_url ? '' : `bg-gradient-to-br ${gradient}`} h-36 relative overflow-hidden flex items-end p-4`}>
                          {post.cover_image_url && (
                            <img
                              src={post.cover_image_url}
                              alt={title}
                              className="absolute inset-0 w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                          <span className="relative z-10 text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">{post.category}</span>
                        </div>
                        <div className="p-5">
                          <h2 className="font-bold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">{title}</h2>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{excerpt}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {date}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.reading_time_min} {t('minRead')}</span>
                          </div>
                          <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                            {t('readMore')} <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </motion.article>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
