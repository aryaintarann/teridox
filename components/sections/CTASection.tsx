import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'

export default function CTASection() {
  const t = useTranslations('cta')

  return (
    <section
      style={{
        background: '#0F1B2D',
        padding: '96px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '4px solid #00C7B7',
      }}
    >
      {/* Decorative rings */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(0,199,183,0.1)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -40, width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(0,199,183,0.08)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 800,
            color: 'white',
            marginBottom: 20,
            lineHeight: 1.15,
            whiteSpace: 'pre-line',
          }}
        >
          {t('title')}
        </h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', marginBottom: 40, lineHeight: 1.7, fontFamily: 'var(--font-dmsans)' }}>
          {t('subtitle')}
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full text-white transition-all hover:opacity-90 hover:scale-[1.04]"
            style={{
              background: '#00C7B7',
              padding: '13px 28px',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'var(--font-dmsans)',
              boxShadow: 'var(--shadow-accent)',
            }}
          >
            {t('primary')}
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full text-white transition-all hover:bg-white/10"
            style={{
              background: 'transparent',
              padding: '13px 28px',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'var(--font-dmsans)',
              border: '1.5px solid rgba(255,255,255,0.6)',
            }}
          >
            {t('secondary')}
          </Link>
        </div>
      </div>
    </section>
  )
}
