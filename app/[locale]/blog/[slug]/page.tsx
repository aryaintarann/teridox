'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ArrowLeft, Clock, Calendar, Share2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const post = {
  title: 'Cara Memilih Tech Stack yang Tepat untuk Produk SaaS Anda',
  category: 'SaaS',
  date: '15 Mei 2025',
  readingTime: 8,
  author: { name: 'Rizky Pratama', role: 'CEO & Co-Founder', avatar: 'RP' },
  gradient: 'from-blue-600 to-indigo-600',
  content: `
## Mengapa Pemilihan Tech Stack Sangat Penting?

Dalam membangun produk SaaS, pemilihan tech stack adalah salah satu keputusan paling krusial yang akan mempengaruhi skalabilitas, maintenance cost, dan kecepatan pengembangan fitur di masa depan.

Tech stack yang tepat tidak hanya harus memenuhi kebutuhan teknis saat ini, tetapi juga harus bisa berkembang seiring pertumbuhan bisnis Anda.

## Faktor-Faktor yang Perlu Dipertimbangkan

### 1. Skalabilitas
Pilih teknologi yang bisa handle pertumbuhan dari 100 ke 100.000 user tanpa major rewrite.

### 2. Developer Ecosystem
Teknologi dengan komunitas besar lebih mudah direcruit dan memiliki lebih banyak library/tools.

### 3. Time to Market
Framework opinionated seperti Next.js membantu team ship faster di early stage.

### 4. Total Cost of Ownership
Pertimbangkan biaya hosting, licensing, dan maintenance jangka panjang.

## Rekomendasi Stack untuk SaaS 2025

Berdasarkan pengalaman kami membangun 50+ produk SaaS, berikut stack yang kami rekomendasikan:

**Frontend:** Next.js 15 dengan TypeScript
**Backend:** Node.js/Python atau Next.js API Routes
**Database:** PostgreSQL via Supabase
**Auth:** Supabase Auth atau Clerk
**Payment:** Stripe
**Email:** Resend
**Hosting:** Vercel + Supabase

## Kesimpulan

Tidak ada "one size fits all" dalam pemilihan tech stack. Yang terpenting adalah memilih teknologi yang dikuasai tim Anda dan bisa memenuhi kebutuhan bisnis baik sekarang maupun di masa depan.
  `,
  faq: [
    { q: 'Apakah Next.js cocok untuk semua jenis SaaS?', a: 'Next.js sangat cocok untuk SaaS dengan kebutuhan SEO atau SSR. Untuk aplikasi yang sangat interaktif, pertimbangkan menggunakan React murni dengan Vite.' },
    { q: 'Haruskah saya menggunakan microservices dari awal?', a: 'Tidak. Mulailah dengan monolith yang well-structured, lalu ekstrak ke microservices ketika ada pain point yang nyata dan tim sudah cukup besar.' },
    { q: 'Berapa lama waktu yang dibutuhkan untuk membangun SaaS MVP?', a: 'Dengan stack modern seperti yang kami rekomendasikan, MVP yang solid bisa dibangun dalam 2–3 bulan dengan tim 3–4 orang.' },
  ],
}

export default function BlogDetailPage() {
  const t = useTranslations('blog')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="pt-16">
      <div className="section-padding">
        <div className="container-max max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> {t('title')}
          </Link>

          <div className={`bg-gradient-to-br ${post.gradient} rounded-3xl h-64 flex items-center justify-center mb-10`}>
            <span className="text-white/20 text-[120px] font-black leading-none">S</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-semibold text-sm">{post.category}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2 mb-4 leading-tight">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  {post.author.avatar}
                </div>
                <div>
                  <span className="font-medium text-foreground">{post.author.name}</span>
                  <span className="text-muted-foreground"> · {post.author.role}</span>
                </div>
              </div>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readingTime} {t('minRead')}</span>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              {post.content.split('\n\n').map((para, i) => {
                if (para.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{para.slice(3)}</h2>
                if (para.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-6 mb-3">{para.slice(4)}</h3>
                if (para.startsWith('**')) return <p key={i} className="text-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{para}</p>
              })}
            </div>

            {/* FAQ */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{t('faqTitle')}</h2>
              <div className="space-y-3">
                {post.faq.map((f, i) => (
                  <div key={i} className="border border-border rounded-xl overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors">
                      {f.q}
                      {openFaq === i ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
                    </button>
                    {openFaq === i && <div className="px-4 pb-4 text-muted-foreground text-sm">{f.a}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="flex items-center gap-4 pt-8 border-t border-border">
              <span className="text-sm font-semibold">{t('share')}:</span>
              <a href="#" className="text-muted-foreground hover:text-[#1DA1F2] transition-colors text-sm font-medium">𝕏</a>
              <a href="#" className="text-muted-foreground hover:text-[#0A66C2] transition-colors text-sm font-medium">in</a>
              <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
