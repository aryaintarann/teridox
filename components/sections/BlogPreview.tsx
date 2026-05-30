'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/lib/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

const CAT_COLOR: Record<string, string> = {
  teknologi: '#0F1B2D', bisnis: '#1E1B4B', tutorial: '#064E3B',
  berita: '#451A03', lainnya: '#1C1917',
}
const DEFAULT_COLORS = ['#0F1B2D', '#1E1B4B', '#064E3B']

function stripMd(text: string) {
  return text.replace(/^#{1,3}\s+/gm, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\n+/g, ' ').trim()
}

interface Post {
  id: string; title: string; title_en: string; slug: string
  content: string; content_en: string; category: string
  reading_time_min: number; created_at: string; cover_image_url: string
}

function BlogCard({ post, color, locale }: { post: Post; color: string; locale: string }) {
  const [hov, setHov] = useState(false)
  const title   = locale === 'en' && post.title_en   ? post.title_en   : post.title
  const raw     = locale === 'en' && post.content_en ? post.content_en : post.content
  const excerpt = stripMd(raw).slice(0, 130) + (raw.length > 130 ? '…' : '')
  const date    = new Date(post.created_at).toLocaleDateString(
    locale === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <Link href={`/blog/${post.slug}`}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius)',
          overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer',
          transform: hov ? 'translateY(-4px)' : 'none',
          boxShadow: hov ? '0 16px 40px rgba(15,27,45,0.1)' : 'var(--shadow)',
          transition: 'all 0.25s ease', height: '100%', display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ height: 180, background: color, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <i className="fa-solid fa-pen-nib" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 48 }} aria-hidden="true" />
          )}
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', color: 'white', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 9999, fontFamily: 'var(--font-dmsans)' }}>
            {post.category}
          </div>
        </div>
        <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 className="line-clamp-2" style={{ fontFamily: 'var(--font-syne)', fontSize: 17, fontWeight: 700, color: 'var(--foreground)', marginBottom: 10, lineHeight: 1.4 }}>
            {title}
          </h3>
          <p className="line-clamp-3" style={{ fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.7, marginBottom: 16, flex: 1, fontFamily: 'var(--font-dmsans)' }}>
            {excerpt}
          </p>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-dmsans)' }}>
            {date} · <i className="fa-solid fa-clock" style={{ fontSize: 11 }} aria-hidden="true" /> {post.reading_time_min}m
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function BlogPreview() {
  const t      = useTranslations('blog')
  const locale = useLocale()
  const [posts, setPosts]     = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .from('blog_posts')
      .select('id,title,title_en,slug,content,content_en,category,reading_time_min,created_at,cover_image_url')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => { setPosts(data ?? []); setLoading(false) })
  }, [])

  if (!loading && posts.length === 0) return null

  return (
    <section style={{ background: 'var(--background)', padding: 'clamp(48px, 8vw, 96px) clamp(16px, 5vw, 40px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#00C7B7', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 12, fontFamily: 'var(--font-dmsans)' }}>
              {t('label')}
            </div>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--foreground)' }}>
              {t('title')}
            </h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: '#00C7B7', fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-dmsans)' }}>
            {t('viewAll')} <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ height: 320, borderRadius: 'var(--radius)', background: 'var(--muted)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {posts.map((post, i) => (
              <BlogCard key={post.id} post={post} color={CAT_COLOR[post.category] ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
