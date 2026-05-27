'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/lib/theme-context'
import { useSiteSettings } from '@/lib/context/SiteSettingsContext'
import { Link } from '@/lib/i18n/navigation'

export default function Hero() {
  const t = useTranslations('hero')
  const { resolvedTheme } = useTheme()
  const settings = useSiteSettings()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = mounted && resolvedTheme === 'dark'
  const heroImage = settings.hero_image_url

  return (
    <section
      className="flex flex-col md:grid md:grid-cols-2"
      style={{ minHeight: '100vh' }}
    >
      {/* Left — text content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(60px, 10vw, 140px) clamp(20px, 6vw, 80px) clamp(40px, 8vw, 100px)',
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
            fontSize: 'clamp(32px, 5.5vw, 72px)',
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
            fontSize: 'clamp(14px, 1.5vw, 18px)',
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
        className="h-56 sm:h-72 md:h-auto"
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
        {/* Hero image or illustration */}
        {heroImage ? (
          <img
            src={heroImage}
            alt="Hero"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : null}

        {/* Illustration fallback (hidden when photo is set) */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(24px, 5vw, 56px)',
          opacity: heroImage ? 0 : 1,
          pointerEvents: heroImage ? 'none' : 'auto',
        }}>
          <svg viewBox="0 0 480 500" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', maxWidth: 460, height: 'auto', userSelect: 'none' }}
            aria-hidden="true"
          >
            {/* Browser window */}
            <rect x="15" y="50" width="310" height="210" rx="12" fill="rgba(6,13,26,0.95)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
            <rect x="15" y="50" width="310" height="32" rx="12" fill="rgba(255,255,255,0.05)"/>
            <rect x="15" y="70" width="310" height="12" fill="rgba(255,255,255,0.05)"/>
            <circle cx="33" cy="66" r="4" fill="#FF5F57" fillOpacity="0.8"/>
            <circle cx="47" cy="66" r="4" fill="#FFBD2E" fillOpacity="0.8"/>
            <circle cx="61" cy="66" r="4" fill="#28C840" fillOpacity="0.8"/>
            <rect x="90" y="58" width="140" height="16" rx="8" fill="rgba(255,255,255,0.07)"/>
            <rect x="15" y="82" width="52" height="178" fill="rgba(255,255,255,0.02)"/>
            <rect x="25" y="96"  width="32" height="5" rx="2.5" fill="rgba(0,199,183,0.7)"/>
            <rect x="25" y="111" width="26" height="4" rx="2"   fill="rgba(255,255,255,0.1)"/>
            <rect x="25" y="124" width="22" height="4" rx="2"   fill="rgba(255,255,255,0.07)"/>
            <rect x="25" y="137" width="28" height="4" rx="2"   fill="rgba(255,255,255,0.07)"/>
            <rect x="25" y="150" width="24" height="4" rx="2"   fill="rgba(255,255,255,0.07)"/>
            <circle cx="41" cy="238" r="12" fill="rgba(0,199,183,0.15)" stroke="rgba(0,199,183,0.3)" strokeWidth="1"/>
            <rect x="76"  y="88" width="70" height="40" rx="7" fill="rgba(0,199,183,0.12)" stroke="rgba(0,199,183,0.2)"   strokeWidth="1"/>
            <rect x="84"  y="96" width="36" height="4"  rx="2" fill="rgba(0,199,183,0.45)"/>
            <rect x="84"  y="108" width="18" height="10" rx="2" fill="rgba(0,199,183,0.85)"/>
            <rect x="84"  y="121" width="28" height="3"  rx="1.5" fill="rgba(0,199,183,0.2)"/>
            <rect x="154" y="88" width="70" height="40" rx="7" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
            <rect x="162" y="96" width="36" height="4"  rx="2" fill="rgba(255,255,255,0.18)"/>
            <rect x="162" y="108" width="22" height="10" rx="2" fill="rgba(255,255,255,0.45)"/>
            <rect x="162" y="121" width="28" height="3"  rx="1.5" fill="rgba(255,255,255,0.06)"/>
            <rect x="232" y="88" width="70" height="40" rx="7" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
            <rect x="240" y="96" width="36" height="4"  rx="2" fill="rgba(255,255,255,0.18)"/>
            <rect x="240" y="108" width="16" height="10" rx="2" fill="rgba(255,255,255,0.45)"/>
            <rect x="240" y="121" width="28" height="3"  rx="1.5" fill="rgba(255,255,255,0.06)"/>
            <rect x="76" y="138" width="126" height="78" rx="7" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            <rect x="86"  y="186" width="9" height="22" rx="2" fill="rgba(0,199,183,0.3)"/>
            <rect x="99"  y="174" width="9" height="34" rx="2" fill="rgba(0,199,183,0.4)"/>
            <rect x="112" y="178" width="9" height="30" rx="2" fill="rgba(0,199,183,0.5)"/>
            <rect x="125" y="165" width="9" height="43" rx="2" fill="rgba(0,199,183,0.65)"/>
            <rect x="138" y="170" width="9" height="38" rx="2" fill="rgba(0,199,183,0.55)"/>
            <rect x="151" y="158" width="9" height="50" rx="2" fill="#00C7B7"/>
            <rect x="164" y="163" width="9" height="45" rx="2" fill="rgba(0,199,183,0.6)"/>
            <rect x="177" y="172" width="9" height="36" rx="2" fill="rgba(0,199,183,0.38)"/>
            <rect x="210" y="138" width="115" height="78" rx="7" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            <polyline points="218,198 232,182 246,188 260,172 274,177 288,165 303,168 320,157" stroke="#00C7B7" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <polygon  points="218,198 232,182 246,188 260,172 274,177 288,165 303,168 320,157 320,208 218,208" fill="rgba(0,199,183,0.07)"/>
            <rect x="76" y="224" width="249" height="6" rx="3"   fill="rgba(255,255,255,0.05)"/>
            <rect x="76" y="236" width="190" height="5" rx="2.5" fill="rgba(255,255,255,0.03)"/>
            <rect x="76" y="247" width="220" height="5" rx="2.5" fill="rgba(255,255,255,0.04)"/>
            <rect x="290" y="198" width="112" height="208" rx="18" fill="rgba(6,13,26,0.96)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
            <rect x="320" y="205" width="52"  height="9"   rx="4.5" fill="rgba(255,255,255,0.07)"/>
            <rect x="300" y="223" width="92"  height="14"  rx="4"   fill="rgba(0,199,183,0.25)"/>
            <rect x="300" y="245" width="42"  height="42"  rx="7"   fill="rgba(0,199,183,0.1)" stroke="rgba(0,199,183,0.2)" strokeWidth="1"/>
            <rect x="306" y="252" width="26"  height="3"   rx="1.5" fill="rgba(0,199,183,0.5)"/>
            <rect x="306" y="259" width="18"  height="3"   rx="1.5" fill="rgba(0,199,183,0.3)"/>
            <rect x="306" y="272" width="14"  height="8"   rx="2"   fill="rgba(0,199,183,0.6)"/>
            <rect x="350" y="245" width="42"  height="42"  rx="7"   fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
            <rect x="356" y="252" width="26"  height="3"   rx="1.5" fill="rgba(255,255,255,0.2)"/>
            <rect x="356" y="259" width="18"  height="3"   rx="1.5" fill="rgba(255,255,255,0.12)"/>
            <rect x="356" y="272" width="18"  height="8"   rx="2"   fill="rgba(255,255,255,0.25)"/>
            <rect x="300" y="295" width="92"  height="58"  rx="7"   fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            <polyline points="308,336 320,320 333,325 344,311 357,315 370,305 382,308 390,300" stroke="#00C7B7" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="300" y="361" width="42" height="5" rx="2.5" fill="rgba(255,255,255,0.1)"/>
            <rect x="300" y="370" width="58" height="4" rx="2"   fill="rgba(255,255,255,0.06)"/>
            <rect x="300" y="379" width="50" height="4" rx="2"   fill="rgba(255,255,255,0.06)"/>
            <rect x="324" y="390" width="44" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>
            <rect x="5" y="3" width="152" height="46" rx="10" fill="rgba(6,13,26,0.92)" stroke="rgba(0,199,183,0.25)" strokeWidth="1"/>
            <circle cx="22" cy="26" r="11" fill="rgba(0,199,183,0.15)"/>
            <path d="M17 26 L21 30 L28 22" stroke="#00C7B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="38" y="16" width="76" height="5" rx="2.5" fill="rgba(255,255,255,0.15)"/>
            <rect x="38" y="26" width="50" height="4" rx="2"   fill="rgba(0,199,183,0.5)"/>
            <rect x="38" y="35" width="62" height="3" rx="1.5" fill="rgba(255,255,255,0.07)"/>
            <rect x="308" y="4" width="164" height="66" rx="10" fill="rgba(6,13,26,0.92)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            <circle cx="322" cy="16" r="3.5" fill="#FF5F57" fillOpacity="0.6"/>
            <circle cx="332" cy="16" r="3.5" fill="#FFBD2E" fillOpacity="0.6"/>
            <circle cx="342" cy="16" r="3.5" fill="#28C840"  fillOpacity="0.6"/>
            <rect x="318" y="27" width="18" height="5" rx="2.5" fill="rgba(255,121,198,0.65)"/>
            <rect x="340" y="27" width="52" height="5" rx="2.5" fill="rgba(255,255,255,0.12)"/>
            <rect x="318" y="38" width="14" height="5" rx="2.5" fill="rgba(139,233,253,0.65)"/>
            <rect x="336" y="38" width="62" height="5" rx="2.5" fill="rgba(0,199,183,0.4)"/>
            <rect x="318" y="49" width="22" height="5" rx="2.5" fill="rgba(80,250,123,0.65)"/>
            <rect x="344" y="49" width="45" height="5" rx="2.5" fill="rgba(255,255,255,0.1)"/>
            <rect x="318" y="60" width="12" height="4" rx="2"   fill="rgba(255,255,255,0.12)"/>
            <rect x="334" y="60" width="36" height="4" rx="2"   fill="rgba(255,121,198,0.4)"/>
            <rect x="46" y="426" width="198" height="68" rx="10" fill="rgba(6,13,26,0.92)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
            <rect x="58" y="438" width="76"  height="4" rx="2"   fill="rgba(255,255,255,0.12)"/>
            <rect x="58" y="448" width="174" height="6" rx="3"   fill="rgba(255,255,255,0.06)"/>
            <rect x="58" y="448" width="138" height="6" rx="3"   fill="rgba(0,199,183,0.5)"/>
            <rect x="58" y="460" width="174" height="5" rx="2.5" fill="rgba(255,255,255,0.06)"/>
            <rect x="58" y="460" width="98"  height="5" rx="2.5" fill="rgba(0,199,183,0.3)"/>
            <rect x="58" y="472" width="174" height="5" rx="2.5" fill="rgba(255,255,255,0.06)"/>
            <rect x="58" y="472" width="158" height="5" rx="2.5" fill="rgba(0,199,183,0.42)"/>
            <rect x="58" y="483" width="60"  height="4" rx="2"   fill="rgba(255,255,255,0.07)"/>
            <circle cx="12"  cy="100" r="3"   fill="rgba(0,199,183,0.35)"/>
            <circle cx="22"  cy="100" r="3"   fill="rgba(0,199,183,0.2)"/>
            <circle cx="460" cy="130" r="5"   fill="rgba(0,199,183,0.25)"/>
            <circle cx="472" cy="116" r="3.5" fill="rgba(0,199,183,0.18)"/>
            <circle cx="466" cy="145" r="2.5" fill="rgba(0,199,183,0.12)"/>
            <circle cx="428" cy="420" r="5"   fill="rgba(0,199,183,0.2)"/>
            <circle cx="442" cy="408" r="3"   fill="rgba(0,199,183,0.13)"/>
            <circle cx="8"   cy="390" r="4"   fill="rgba(0,199,183,0.2)"/>
            <circle cx="20"  cy="402" r="2.5" fill="rgba(0,199,183,0.12)"/>
            <circle cx="470" cy="300" r="3"   fill="rgba(0,199,183,0.2)"/>
            <circle cx="478" cy="314" r="2"   fill="rgba(0,199,183,0.12)"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
