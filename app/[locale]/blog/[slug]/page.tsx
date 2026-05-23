'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ArrowLeft, Clock, Calendar, Share2, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ReactMarkdown from 'react-markdown'

function normalizeMarkdown(text: string): string {
  return text
    .replace(/ (\d{1,2})\. (?=[A-Z*\[`])/g, '\n$1. ')
    .replace(/ \* (?!\*)/g, '\n* ')
}

interface FaqItem { q: string; a: string }

// Split raw content into body (before FAQ) and FAQ items
function splitFaq(raw: string): { body: string; faqItems: FaqItem[] } {
  const normalized = normalizeMarkdown(raw)
  const faqRegex = /^#{1,3}\s*FAQ\s*$/im
  const match = faqRegex.exec(normalized)
  if (!match || match.index === undefined) return { body: normalized, faqItems: [] }

  const body = normalized.slice(0, match.index).trim()
  const faqSection = normalized.slice(match.index + match[0].length).trim()

  // Parse "Q: ... A: ..." pairs, each possibly prefixed by "* " or a number
  const items: FaqItem[] = []
  const lines = faqSection.split('\n')
  for (const line of lines) {
    const clean = line.replace(/^[\*\-\d\.]+\s*/, '').trim()
    const aIdx = clean.search(/\bA:\s/)
    if (clean.startsWith('Q:') && aIdx !== -1) {
      const q = clean.slice(2, aIdx).trim()
      const a = clean.slice(aIdx + 2).trim()
      if (q && a) items.push({ q, a })
    }
  }

  return { body, faqItems: items }
}

interface BlogPost {
  id: string; title: string; title_en: string; slug: string
  content: string; content_en: string; category: string
  reading_time_min: number; created_at: string; tags: string[]
  meta_title: string; meta_description: string; cover_image_url: string
  faq: Array<{ q: string; a: string }>
  faq_en: Array<{ q: string; a: string }>
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

  const [post, setPost]         = useState<BlogPost | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [openFaq, setOpenFaq]   = useState<number | null>(null)

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

  const title      = locale === 'en' && post.title_en   ? post.title_en   : post.title
  const rawContent = locale === 'en' && post.content_en ? post.content_en : post.content
  // Prefer structured FAQ from DB; fall back to parsing from markdown content
  const dbFaq      = locale === 'en' ? (post.faq_en ?? []) : (post.faq ?? [])
  const { body, faqItems: parsedFaq } = splitFaq(rawContent)
  const faqItems   = dbFaq.length > 0 ? dbFaq : parsedFaq
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
            <div className="rounded-3xl overflow-hidden mb-10 border border-border">
              <img
                src={post.cover_image_url}
                alt={title}
                className="w-full h-auto block"
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

            <div className="max-w-none mb-12">
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
                {body}
              </ReactMarkdown>

              {faqItems.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">FAQ</h2>
                  <div className="space-y-3">
                    {faqItems.map((item, i) => {
                      const isOpen = openFaq === i
                      return (
                        <div
                          key={i}
                          className="rounded-xl overflow-hidden transition-all duration-200"
                          style={{
                            border: `1px solid ${isOpen ? 'var(--primary)' : 'var(--border)'}`,
                            borderTopWidth: isOpen ? 2 : 1,
                          }}
                        >
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : i)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                          >
                            <span className="font-medium text-sm pr-4" style={{ color: isOpen ? 'var(--primary)' : 'var(--foreground)' }}>
                              {item.q}
                            </span>
                            {isOpen
                              ? <ChevronUp className="h-4 w-4 shrink-0 text-primary" />
                              : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                              {item.a}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
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
