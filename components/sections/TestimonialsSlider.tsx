'use client'

import { useTranslations } from 'next-intl'

const testimonials = [
  { name: 'Ahmad Ridwan',       role: 'CEO, PT. NusaTech',              quote: 'Teridox benar-benar mengubah cara kami berbisnis digital. Website baru kami meningkatkan leads 300% dalam 3 bulan pertama. Tim yang sangat profesional!', rating: 5 },
  { name: 'Sari Indah Pertiwi', role: 'Owner, Batik Boutique',           quote: 'Awalnya ragu menggunakan digital agency, tapi Teridox membuktikan investasi ini sangat worth it. Online store kami kini menghasilkan lebih dari toko fisik!', rating: 5 },
  { name: 'Denny Kurniawan',    role: 'CTO, StartupX Indonesia',         quote: 'Kolaborasi yang luar biasa! Mereka tidak hanya mengeksekusi dengan baik, tapi juga memberikan insights berharga yang tidak kami pikirkan sebelumnya.', rating: 5 },
  { name: 'Maya Pratiwi',       role: 'Marketing Director, Bali Hotels', quote: 'Platform booking yang dibangun Teridox jauh melampaui ekspektasi. Konversi naik 85% dan review bintang 5 dari tamu terus berdatangan!', rating: 5 },
  { name: 'Fahmi Ramadan',      role: 'Founder, EduIndo',                quote: 'Aplikasi e-learning kami kini punya 50.000+ pengguna aktif, semua dimulai dari desain yang Teridox kerjakan. Detail dan kualitasnya benar-benar top!', rating: 5 },
  { name: 'Rina Setyawati',     role: 'Owner, FreshBakery Bali',         quote: 'Tim Teridox sangat sabar dan memahami kebutuhan bisnis kecil. Pesanan online kami naik 5x lipat setelah website baru diluncurkan. Terima kasih!', rating: 5 },
]

const doubled = [...testimonials, ...testimonials]

const CARD_WIDTH = 320
const CARD_GAP = 20

function TestiCard({ item }: { item: typeof testimonials[number] }) {
  return (
    <div
      style={{
        width: CARD_WIDTH,
        flexShrink: 0,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '24px 24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <i className="fa-solid fa-quote-left" style={{ color: '#00C7B7', fontSize: 28 }} aria-hidden="true" />
      <p style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.7, fontStyle: 'italic', flex: 1, fontFamily: 'var(--font-dmsans)' }}>
        {item.quote}
      </p>
      <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <i key={n} className="fa-solid fa-star" style={{ color: '#F59E0B', fontSize: 12 }} aria-hidden="true" />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--accent-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#00C7B7', fontWeight: 700, fontSize: 14,
            fontFamily: 'var(--font-syne)',
            flexShrink: 0,
          }}
        >
          {item.name[0]}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--foreground)', fontFamily: 'var(--font-dmsans)' }}>{item.name}</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-dmsans)' }}>{item.role}</div>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ direction }: { direction: 'left' | 'right' }) {
  const animName = direction === 'left' ? 'marqueeLeft' : 'marqueeRight'
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: CARD_GAP,
          width: 'max-content',
          animation: `${animName} 40s linear infinite`,
          willChange: 'transform',
        }}
      >
        {doubled.map((item, i) => (
          <TestiCard key={i} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function TestimonialsSlider() {
  const t = useTranslations('testimonials')

  return (
    <section style={{ background: 'var(--muted)', padding: '96px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto 48px', padding: '0 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#00C7B7', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 12, fontFamily: 'var(--font-dmsans)' }}>
          {t('label')}
        </div>
        <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--foreground)' }}>
          {t('title')}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <MarqueeRow direction="left" />
        <MarqueeRow direction="right" />
      </div>
    </section>
  )
}
