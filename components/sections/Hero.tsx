'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/lib/theme-context'
import { Link } from '@/lib/i18n/navigation'

export default function Hero() {
  const t = useTranslations('hero')
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}
    >
      {/* Left — text content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(80px, 10vw, 140px) clamp(32px, 6vw, 80px) clamp(60px, 8vw, 100px)',
          background: isDark ? '#060D1A' : '#FFFFFF',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#D1D5DB'}`,
            borderRadius: 9999,
            padding: '6px 14px',
            marginBottom: 28,
            width: 'fit-content',
          }}
        >
          <i
            className="fa-solid fa-circle-dot"
            style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.5)' : '#6B7280' }}
            aria-hidden="true"
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-dmsans)',
              color: isDark ? 'rgba(255,255,255,0.6)' : '#374151',
            }}
          >
            {t('badge')}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 'clamp(40px, 5.5vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: isDark ? '#FFFFFF' : '#0A0A0A',
            marginBottom: 24,
          }}
        >
          {t('title').split('\n').map((line: string, i: number, arr: string[]) =>
            i === arr.length - 1 ? (
              <span key={i} style={{ color: '#00C7B7' }}>{line}</span>
            ) : (
              <span key={i} style={{ display: 'block' }}>{line}</span>
            )
          )}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)',
            lineHeight: 1.75,
            color: isDark ? '#94A3B8' : '#4B5563',
            marginBottom: 40,
            maxWidth: 480,
            fontFamily: 'var(--font-dmsans)',
          }}
        >
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{
              padding: '14px 28px',
              borderRadius: 9999,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'var(--font-dmsans)',
              background: isDark ? '#FFFFFF' : '#0A0A0A',
              color: isDark ? '#0A0A0A' : '#FFFFFF',
              border: 'none',
            }}
          >
            {t('ctaPrimary')}
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center transition-all hover:scale-[1.02]"
            style={{
              padding: '14px 28px',
              borderRadius: 9999,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'var(--font-dmsans)',
              background: 'transparent',
              color: isDark ? '#FFFFFF' : '#0A0A0A',
              border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.3)' : '#D1D5DB'}`,
            }}
          >
            {t('ctaSecondary')}
          </Link>
        </div>

        {/* Trust */}
        <p
          style={{
            marginTop: 36,
            fontSize: 13,
            color: isDark ? '#64748B' : '#9CA3AF',
            fontFamily: 'var(--font-dmsans)',
            letterSpacing: '0.02em',
          }}
        >
          {t('trust')}
        </p>
      </div>

      {/* Right — image panel */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(135deg, #0F1B2D 0%, #0a2540 50%, #062a35 100%)'
            : 'linear-gradient(135deg, #00C7B7 0%, #0077A8 50%, #005f8a 100%)',
        }}
      >
        {/* Decorative pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Floating accent circles */}
        <div style={{
          position: 'absolute', width: 320, height: 320, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', top: '-60px', right: '-80px',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', bottom: '60px', left: '40px',
          pointerEvents: 'none',
        }} />
        {/* Center text overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 48, textAlign: 'center',
        }}>
          <div style={{
            fontSize: 13, fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-dmsans)', marginBottom: 16,
          }}>
            Teridox Technology
          </div>
          <div style={{
            fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 20,
          }}>
            Digital Agency<br />Bali
          </div>
          <div style={{
            width: 48, height: 3, borderRadius: 2,
            background: 'rgba(255,255,255,0.4)',
          }} />
        </div>
      </div>
    </section>
  )
}
