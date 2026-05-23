'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ReactMarkdown from 'react-markdown'

// AI sometimes writes list items inline on one line — normalize them to proper markdown
function normalizeMarkdown(text: string): string {
  return text
    // " 2. Word" or " 2. **Word" → newline + "2. ..."
    .replace(/ (\d{1,2})\. (?=[A-Z*\[`])/g, '\n$1. ')
    // " * item" (not "**") → newline + "* ..."
    .replace(/ \* (?!\*)/g, '\n* ')
}

interface BlogPost {
  id: string; title: string; title_en: string; slug: string
  content: string; content_en: string; category: string
  reading_time_min: number; created_at: string; tags: string[]
  meta_title: string; meta_description: string; cover_image_url: string
}

const CAT_GRADIENT: Record<string, string> = {
  teknologi: 'from-blue-600 to-indigo-600',
  bisnis: 'from-violet-600 to-purple-600',
  tutorial: 'from-emerald-600 to-teal-600',
  berita: 'from-orange-600 to-amber-600',
  lainnya: 'from-cyan-600 to-blue-600',
}


export default function BlogDetailPage() {
  const { slug }  = useParams() as { slug: string }
  const t         = useTranslations('blog')
  const locale    = useLocale()

  const [post, setPost]       = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    createClient()
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true) } else { setPost(data) }
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="pt-16 section-padding">
        <div className="container-max max-w-4xl space-y-4 animate-pulse">
          <div className="h-64 rounded-3xl bg-muted" />
          <div className="h-8 w-2/3 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="pt-16 section-padding">
        <div className="container-max max-w-4xl text-center py-20">
          <p className="text-4xl font-bold mb-4">404</p>
          <p className="text-muted-foreground mb-6">{locale === 'en' ? 'Article not found.' : 'Artikel tidak ditemukan.'}</p>
          <Link href="/blog" className="text-primary hover:underline font-semibold">{t('title')}</Link>
        </div>
      </div>
    )
  }

  const title    = locale === 'en' && post.title_en   ? post.title_en   : post.title
  const content  = locale === 'en' && post.content_en ? post.content_en : post.content
  const gradient = CAT_GRADIENT[post.category] ?? 'from-blue-600 to-indigo-600'
  const date     = new Date(post.created_at).toLocaleDateString(
    locale === 'en' ? 'en-US' : 'id-ID',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <div className="pt-16">
      <div className="section-padding">
        <div className="container-max max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> {t('title')}
          </Link>

          {post.cover_image_url ? (
            <div className="rounded-3xl overflow-hidden h-64 mb-10 border border-border">
              <img
                src={post.cover_image_url}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <div className={`bg-gradient-to-br ${gradient} rounded-3xl h-64 flex items-center justify-center mb-10`}>
              <span className="text-white/20 text-[120px] font-black leading-none">{title.charAt(0)}</span>
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-semibold text-sm">{post.category}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2 mb-4 leading-tight">{title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {date}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.reading_time_min} {t('minRead')}</span>
              {post.tags?.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-muted px-2.5 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="max-w-none mb-12 space-y-0">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-extrabold mt-8 mb-4 text-foreground">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-3 text-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">{children}</h3>,
                  p: ({ children }) => <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-outside pl-6 mb-4 space-y-1 text-muted-foreground">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-outside pl-6 mb-4 space-y-1 text-muted-foreground">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">{children}</code>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">{children}</blockquote>,
                  hr: () => <hr className="border-border my-8" />,
                  a: ({ href, children }) => <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                }}
              >
                {normalizeMarkdown(content)}
              </ReactMarkdown>
            </div>

            <div className="flex items-center gap-4 pt-8 border-t border-border">
              <span className="text-sm font-semibold">{t('share')}:</span>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1DA1F2] transition-colors text-sm font-medium">𝕏</a>
              <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
