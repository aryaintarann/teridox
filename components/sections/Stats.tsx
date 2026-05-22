'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

const statData = [
  { num: '50', suffix: '+', labelKey: 'projects',    icon: 'rocket' },
  { num: '98', suffix: '%', labelKey: 'satisfaction', icon: 'heart' },
  { num: '3',  suffix: '+', labelKey: 'years',        icon: 'calendar-days' },
  { num: '20', suffix: '+', labelKey: 'clients',      icon: 'handshake' },
]

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

function StatItem({ num, suffix, labelKey, icon, last, isDark }: { num: string; suffix: string; labelKey: string; icon: string; last: boolean; isDark: boolean }) {
  const t = useTranslations('stats')
  const [val, ref] = useCountUp(parseInt(num))

  return (
    <div
      ref={ref}
      style={{
        textAlign: 'center',
        padding: '0 32px',
        borderRight: last ? 'none' : `1px solid ${isDark ? '#1E293B' : '#E2E8F0'}`,
      }}
    >
      <i className={`fa-solid fa-${icon}`} style={{ color: '#00C7B7', fontSize: 24, marginBottom: 12, display: 'block' }} aria-hidden="true" />
      <div style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 800, color: '#00C7B7', lineHeight: 1 }}>
        {val}{suffix}
      </div>
      <div style={{ fontSize: 15, color: isDark ? '#94A3B8' : '#64748B', marginTop: 8, fontFamily: 'var(--font-dmsans)' }}>
        {t(labelKey as any)}
      </div>
    </div>
  )
}

export default function Stats() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <section style={{ background: isDark ? '#0F1B2D' : '#F1F5F9', padding: '80px 40px' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
        }}
      >
        {statData.map((s, i) => (
          <StatItem key={s.labelKey} {...s} last={i === statData.length - 1} isDark={isDark} />
        ))}
      </div>
    </section>
  )
}
