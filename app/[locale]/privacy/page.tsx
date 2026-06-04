import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import CTASection from '@/components/sections/CTASection'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Privacy Policy' : 'Kebijakan Privasi',
    description: isEn
      ? 'Read Teridox\'s privacy policy to understand how we collect, use, and protect your personal information.'
      : 'Baca kebijakan privasi Teridox untuk memahami cara kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.',
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { id: '/id/privacy', en: '/en/privacy' },
    },
    openGraph: {
      title: isEn ? 'Privacy Policy | Teridox' : 'Kebijakan Privasi | Teridox',
      description: isEn
        ? 'How Teridox collects, uses, and protects your personal information.'
        : 'Cara Teridox mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.',
      url: `/${locale}/privacy`,
      type: 'website',
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function PrivacyPage() {
  const t = await getTranslations('privacy')
  const tCommon = await getTranslations('common')
  const sections = t.raw('sections') as Array<{ title: string; content: string }>

  return (
    <div className="pt-16">
      <section className="py-16 px-6 md:px-10" style={{ background: 'var(--muted)' }}>
        <div className="container-max max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            ← {tCommon('backHome')}
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
