'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/lib/theme-context'
import { createClient } from '@/lib/supabase/client'

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let cur = 0
    const steps = 50
    const iv = setInterval(() => {
      cur += target / steps
      if (cur >= target) { setCount(target); clearInterval(iv) }
      else setCount(Math.floor(cur))
    }, duration / steps)
    return () => clearInterval(iv)
  }, [started, target, duration])

  return [count, ref] as const
}

function StatItem({ num, suffix, labelKey, icon, isDark }: {
  num: string; suffix: string; labelKey: string; icon: string; isDark: boolean
}) {
  const t = useTranslations('stats')
  const [val, ref] = useCountUp(parseInt(num))

  return (
    <div
      ref={ref}
      className="text-center py-7 px-4 md:py-0 md:px-8 border-slate-200 dark:border-slate-800
                 not-last:border-b md:not-last:border-b-0 md:not-last:border-r"
    >
      <i className={`fa-solid fa-${icon}`} style={{ color: '#00C7B7', fontSize: 24, marginBottom: 12, display: 'block' }} aria-hidden="true" />
      <div style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 800, color: '#00C7B7', lineHeight: 1 }}>
        {val}{suffix}
      </div>
      <div style={{ fontSize: 15, color: isDark ? '#94A3B8' : '#64748B', marginTop: 8, fontFamily: 'var(--font-dmsans)' }}>
        {t(labelKey as any)}
      </div>
    </div>
  )
}

export default function Stats() {
  const t = useTranslations('stats')
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [portfolioCount, setPortfolioCount] = useState(0)
  const [satisfactionPct, setSatisfactionPct] = useState(0)
  const [clientCount, setClientCount] = useState(0)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const supabase = createClient()

    async function fetchStats() {
      const [{ count: portCount }, { data: testimonials }, { count: testCount }] = await Promise.all([
        supabase.from('portfolio_items').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('rating').eq('published', true),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('published', true),
      ])

      const count = portCount ?? 0
      setPortfolioCount(count)

      const minClients = parseInt(t('clientsMin') ?? '20')
      setClientCount(Math.max(testCount ?? 0, minClients))

      if (testimonials && testimonials.length > 0) {
        const avg = testimonials.reduce((sum, r) => sum + (r.rating ?? 0), 0) / testimonials.length
        setSatisfactionPct(Math.round((avg / 5) * 100))
      }
    }

    fetchStats()
  }, [t])

  const isDark = mounted && resolvedTheme === 'dark'

  const statData = [
    { num: String(portfolioCount),  suffix: '+', labelKey: 'projects',    icon: 'rocket' },
    { num: String(satisfactionPct), suffix: '%', labelKey: 'satisfaction', icon: 'heart' },
    { num: '2',                     suffix: '+', labelKey: 'years',        icon: 'calendar-days' },
    { num: String(clientCount),     suffix: '+', labelKey: 'clients',      icon: 'handshake' },
  ]

  return (
    <section style={{ background: isDark ? '#0F1B2D' : '#F1F5F9', padding: 'clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)' }}>
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ maxWidth: 1200, margin: '0 auto' }}
      >
        {statData.map((s) => (
          <StatItem key={s.labelKey} {...s} isDark={isDark} />
        ))}
      </div>
    </section>
  )
}
