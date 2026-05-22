'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { Link } from '@/lib/i18n/navigation'

export default function Hero() {
  const t = useTranslations('hero')
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  // Before mount, render neutral light styles to match SSR, then switch to actual theme.
  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <section
      className="dot-grid"
      style={{
        minHeight: '100vh',
        background: isDark
          ? '#060D1A'
          : 'linear-gradient(160deg, #F0FDFC 0%, #F8FAFC 60%, #FFFFFF 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 40px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating shapes */}
      <div
        className="animate-float"
        style={{
          position: 'absolute', width: 280, height: 280, borderRadius: '50%',
          border: `1px solid rgba(0,199,183,${isDark ? '0.1' : '0.15'})`,
          top: '12%', left: '6%',
          background: `rgba(0,199,183,${isDark ? '0.03' : '0.05'})`,
          pointerEvents: 'none',
        }}
      />
      <div
        className="animate-float-2"
        style={{
          position: 'absolute', width: 160, height: 160, borderRadius: 24,
          border: `1px solid rgba(0,199,183,${isDark ? '0.07' : '0.12'})`,
          bottom: '18%', right: '8%',
          background: `rgba(0,199,183,${isDark ? '0.02' : '0.04'})`,
          pointerEvents: 'none',
        }}
      />
      <div
        className="animate-float-3"
        style={{
          position: 'absolute', width: 70, height: 70, borderRadius: '50%',
          background: `rgba(0,199,183,${isDark ? '0.07' : '0.1'})`,
          top: '28%', right: '16%',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: 820, zIndex: 1 }}>
        {/* Badge */}
        <div
          className="fade-up"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,199,183,0.1)', border: '1px solid rgba(0,199,183,0.25)',
            borderRadius: 9999, padding: '8px 18px', marginBottom: 32,
            color: '#00C7B7', fontSize: 14, fontWeight: 600,
            fontFamily: 'var(--font-dmsans)',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00C7B7', display: 'inline-block', boxShadow: '0 0 0 3px rgba(0,199,183,0.2)' }} />
          <i className="fa-solid fa-star" style={{ fontSize: 12 }} aria-hidden="true" />
          {t('badge')}
        </div>

        {/* Title */}
        <h1
          className="fade-up-1"
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 'clamp(48px, 7vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          {t('title').split('\n').map((line: string, i: number) => (
            <span key={i} style={{ display: 'block', color: i === 1 ? '#00C7B7' : isDark ? 'white' : '#0F172A' }}>
              {line}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          className="fade-up-2"
          style={{
            fontSize: 20,
            color: isDark ? '#94A3B8' : '#475569',
            lineHeight: 1.7,
            maxWidth: 580, margin: '0 auto 40px',
            fontFamily: 'var(--font-dmsans)',
          }}
        >
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div
          className="fade-up-3"
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}
        >
          <HeroButton href="/contact" primary isDark={isDark}>
            {t('ctaPrimary')}
          </HeroButton>
          <HeroButton href="/portfolio" isDark={isDark}>
            {t('ctaSecondary')}
          </HeroButton>
        </div>

        {/* Trust text */}
        <div
          className="fade-up-4"
          style={{ fontSize: 14, color: isDark ? '#64748B' : '#94A3B8', letterSpacing: '0.5px', fontFamily: 'var(--font-dmsans)' }}
        >
          {t('trust')}
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: 56, display: 'flex', justifyContent: 'center' }}>
          <i
            className="fa-solid fa-chevron-down animate-chevron-bounce"
            style={{ color: isDark ? '#64748B' : '#94A3B8', fontSize: 20 }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}

function HeroButton({
  href,
  primary,
  isDark,
  children,
}: {
  href: string
  primary?: boolean
  isDark: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="transition-all hover:scale-[1.04] inline-flex items-center justify-center"
      style={{
        padding: '14px 32px',
        borderRadius: 9999,
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'var(--font-dmsans)',
        border: primary ? 'none' : isDark ? '1.5px solid rgba(255,255,255,0.35)' : '1.5px solid #CBD5E1',
        background: primary ? '#00C7B7' : 'transparent',
        color: primary ? 'white' : isDark ? 'white' : '#0F172A',
        boxShadow: primary ? 'var(--shadow-accent)' : 'none',
      }}
    >
      {children}
    </Link>
  )
}
