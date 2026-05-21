'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'

const valueProps = [
  { icon: 'bolt',     titleKey: 'fast',     descKey: 'fastDesc' },
  { icon: 'bullseye', titleKey: 'precise',  descKey: 'preciseDesc' },
  { icon: 'gem',      titleKey: 'quality',  descKey: 'qualityDesc' },
]

const stats = [
  { num: '50', suffix: '+', label: 'Proyek Selesai' },
  { num: '98', suffix: '%', label: 'Kepuasan Klien' },
  { num: '3',  suffix: '+', label: 'Tahun Pengalaman' },
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

function StatCard({ num, suffix, label, offset }: { num: string; suffix: string; label: string; offset?: boolean }) {
  const [val, ref] = useCountUp(parseInt(num))
  return (
    <div
      ref={ref}
      style={{
        background: 'white',
        borderRadius: 16,
        padding: '20px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transform: offset ? 'translateX(24px)' : 'none',
      }}
    >
      <div style={{ fontFamily: 'var(--font-syne)', fontSize: 40, fontWeight: 800, color: '#00C7B7', minWidth: 80 }}>
        {val}{suffix}
      </div>
      <div style={{ fontSize: 14, color: '#64748B', fontWeight: 500, fontFamily: 'var(--font-dmsans)' }}>{label}</div>
    </div>
  )
}

export default function AboutSnapshot() {
  const t = useTranslations('about')

  return (
    <section style={{ background: 'var(--background)', padding: '96px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 64, alignItems: 'center' }}>
        {/* Left: text */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-dmsans)', color: '#00C7B7', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 12 }}>
            {t('label')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--foreground)', marginBottom: 20, lineHeight: 1.25 }}>
            {t('title')}
          </h2>
          <p style={{ fontSize: 16, color: 'var(--muted-foreground)', lineHeight: 1.8, marginBottom: 16, fontFamily: 'var(--font-dmsans)' }}>
            {t('p1')}
          </p>
          <p style={{ fontSize: 16, color: 'var(--muted-foreground)', lineHeight: 1.8, marginBottom: 32, fontFamily: 'var(--font-dmsans)' }}>
            {t('p2')}
          </p>

          {/* Value props */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            {valueProps.map((p) => (
              <div key={p.icon} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`fa-solid fa-${p.icon}`} style={{ color: '#00C7B7', fontSize: 18 }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: 15, fontFamily: 'var(--font-dmsans)' }}>{t(p.titleKey)}</div>
                  <div style={{ fontSize: 14, color: 'var(--muted-foreground)', fontFamily: 'var(--font-dmsans)' }}>{t(p.descKey)}</div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 transition-colors hover:opacity-80"
            style={{ color: '#00C7B7', fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-dmsans)' }}
          >
            {t('more')}
            <i className="fa-solid fa-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" />
          </Link>
        </div>

        {/* Right: stat cards */}
        <div style={{ background: '#0F1B2D', borderRadius: 24, padding: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {stats.map((s, i) => (
              <StatCard key={s.label} num={s.num} suffix={s.suffix} label={s.label} offset={i === 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
