'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

interface Testimonial {
  id: string; name: string; role: string; company: string; content: string; rating: number
}

const STYLES = `
  @keyframes testi-left {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes testi-right {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0); }
  }
  .testi-track-left  { animation: testi-left  40s linear infinite; }
  .testi-track-right { animation: testi-right 40s linear infinite; }
  .testi-track-left:hover,
  .testi-track-right:hover { animation-play-state: paused; }
`

function TestiCard({ item }: { item: Testimonial }) {
  return (
    <div style={{ width: 320, flexShrink: 0, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <i className="fa-solid fa-quote-left" style={{ color: '#00C7B7', fontSize: 28 }} aria-hidden="true" />
      <p style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.7, fontStyle: 'italic', flex: 1, fontFamily: 'var(--font-dmsans)' }}>
        {item.content}
      </p>
      <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        {Array.from({ length: item.rating }).map((_, n) => (
          <i key={n} className="fa-solid fa-star" style={{ color: '#F59E0B', fontSize: 12 }} aria-hidden="true" />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00C7B7', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-syne)', flexShrink: 0 }}>
          {item.name[0]}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--foreground)', fontFamily: 'var(--font-dmsans)' }}>{item.name}</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-dmsans)' }}>
            {item.role}{item.company ? `, ${item.company}` : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ items, direction }: { items: Testimonial[]; direction: 'left' | 'right' }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div className={direction === 'left' ? 'testi-track-left' : 'testi-track-right'} style={{ display: 'flex', flexDirection: 'row', gap: 20, width: 'max-content' }}>
        {doubled.map((item, i) => <TestiCard key={i} item={item} />)}
      </div>
    </div>
  )
}

export default function TestimonialsSlider() {
  const t = useTranslations('testimonials')
  const [items, setItems]     = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .from('testimonials')
      .select('id,name,role,company,content,rating')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false) })
  }, [])

  if (loading) return null

  const half = Math.ceil(items.length / 2)
  const row1 = items.slice(0, half)
  const row2 = items.slice(half).length > 1 ? items.slice(half) : items

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <section style={{ background: 'var(--muted)', padding: '96px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto 48px', padding: '0 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#00C7B7', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 12, fontFamily: 'var(--font-dmsans)' }}>
            {t('label')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--foreground)' }}>
            {t('title')}
          </h2>
        </div>
        {items.length >= 3 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <MarqueeRow items={row1} direction="left" />
            <MarqueeRow items={row2} direction="right" />
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontFamily: 'var(--font-dmsans)', fontSize: 15, padding: '0 40px' }}>
            {t('empty')}
          </div>
        )}
      </section>
    </>
  )
}
