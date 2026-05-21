'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'

const posts = [
  { id: 1, title: 'Tren Web Development 2026 yang Wajib Anda Ketahui', category: 'Web Development', author: 'Reza Pratama', date: '15 Mei 2026', readTime: '8', excerpt: 'Dunia web development terus bergerak cepat. Dari AI-generated code hingga edge computing — inilah tren yang akan mendominasi industri tahun ini.', color: '#0F1B2D', href: '/blog/tren-web-development-2026' },
  { id: 2, title: 'Panduan Lengkap UI/UX Design untuk Startup Pemula', category: 'UI/UX Design', author: 'Ayu Dewi Lestari', date: '10 Mei 2026', readTime: '12', excerpt: 'Desain yang baik bukan hanya soal estetika — ini tentang menciptakan pengalaman yang membuat pengguna kembali lagi. Panduan komprehensif untuk startup.', color: '#1E1B4B', href: '/blog/panduan-uiux-startup' },
  { id: 3, title: 'Mengintegrasikan AI dalam Bisnis: Panduan Praktis 2026', category: 'AI & Tech', author: 'Bagas Santoso', date: '5 Mei 2026', readTime: '10', excerpt: 'AI bukan lagi masa depan — ini kebutuhan bisnis hari ini. Pelajari cara mengimplementasikannya secara efektif tanpa membuang anggaran berlebihan.', color: '#1A0533', href: '/blog/ai-dalam-bisnis-2026' },
]

function BlogCard({ post }: { post: typeof posts[number] }) {
  const [hov, setHov] = useState(false)
  return (
    <Link href={post.href}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          cursor: 'pointer',
          transform: hov ? 'translateY(-4px)' : 'none',
          boxShadow: hov ? '0 16px 40px rgba(15,27,45,0.1)' : 'var(--shadow)',
          transition: 'all 0.25s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Solid color thumbnail */}
        <div
          style={{
            height: 180,
            background: post.color,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <i className="fa-solid fa-pen-nib" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 48 }} aria-hidden="true" />
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', color: 'white', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 9999, fontFamily: 'var(--font-dmsans)' }}>
            {post.category}
          </div>
        </div>
        {/* Content */}
        <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 className="line-clamp-2" style={{ fontFamily: 'var(--font-syne)', fontSize: 17, fontWeight: 700, color: 'var(--foreground)', marginBottom: 10, lineHeight: 1.4 }}>
            {post.title}
          </h3>
          <p className="line-clamp-3" style={{ fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.7, marginBottom: 16, flex: 1, fontFamily: 'var(--font-dmsans)' }}>
            {post.excerpt}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00C7B7', fontWeight: 700, fontSize: 12, flexShrink: 0, fontFamily: 'var(--font-syne)' }}>
              {post.author[0]}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-dmsans)' }}>
              <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{post.author.split(' ')[0]}</span>
              {' · '}{post.date}{' · '}
              <i className="fa-solid fa-clock" style={{ fontSize: 11 }} aria-hidden="true" />
              {' '}{post.readTime}m
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function BlogPreview() {
  const t = useTranslations('blog')

  return (
    <section style={{ background: 'var(--background)', padding: '96px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#00C7B7', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 12, fontFamily: 'var(--font-dmsans)' }}>
              {t('label')}
            </div>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--foreground)' }}>
              {t('title')}
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 transition-colors hover:opacity-80"
            style={{ color: '#00C7B7', fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-dmsans)' }}
          >
            {t('viewAll')}
            <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
