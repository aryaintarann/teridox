'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CTASection from '@/components/sections/CTASection'

export default function PortfolioDetailPage() {
  const t = useTranslations('portfolio')

  const project = {
    title: 'CRM Platform SaaS',
    category: 'SaaS',
    gradient: 'from-blue-600 to-indigo-700',
    challenge: 'Perusahaan membutuhkan sistem CRM yang dapat mengelola ribuan leads, pipeline penjualan, dan komunikasi klien dalam satu platform yang terintegrasi.',
    solution: 'Kami membangun platform SaaS multi-tenant menggunakan Next.js 15 dan Supabase dengan fitur pipeline kanban, analitik real-time, dan integrasi email via Resend.',
    outcome: 'Produktivitas tim sales meningkat 40%, waktu closing deal berkurang 25%, dan NPS pelanggan naik dari 62 ke 78 dalam 6 bulan pertama.',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Stripe', 'Resend'],
    url: 'https://example.com',
  }

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-max">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> {t('title')}
          </Link>

          <div className={`bg-gradient-to-br ${project.gradient} rounded-3xl h-72 flex items-center justify-center mb-10`}>
            <span className="text-white/20 text-[140px] font-black leading-none">{project.title.charAt(0)}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-primary font-semibold text-sm">{project.category}</span>
                <h1 className="text-3xl md:text-4xl font-extrabold mt-1 mb-6">{project.title}</h1>
              </motion.div>

              {[
                { label: t('challenge'), content: project.challenge },
                { label: t('solution'), content: project.solution },
                { label: t('outcome'), content: project.outcome },
              ].map(({ label, content }) => (
                <div key={label}>
                  <h2 className="text-xl font-bold mb-3 text-primary">{label}</h2>
                  <p className="text-muted-foreground leading-relaxed">{content}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold mb-4">{t('technologies')}</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
              >
                {t('visitSite')} <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
