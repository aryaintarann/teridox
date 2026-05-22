import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import CTASection from '@/components/sections/CTASection'

export default async function TermsPage() {
  const t = await getTranslations('terms')
  const sections = t.raw('sections') as Array<{ title: string; content: string }>

  return (
    <div className="pt-16">
      <section className="py-16 px-6 md:px-10" style={{ background: 'var(--muted)' }}>
        <div className="container-max max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            ← Beranda
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('lastUpdated')}</p>
        </div>
      </section>

      <section className="py-12 px-6 md:px-10">
        <div className="container-max max-w-3xl">
          <p className="text-muted-foreground text-lg leading-relaxed mb-10 pb-10 border-b border-border">
            {t('intro')}
          </p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold mb-3">
                  {i + 1}. {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
