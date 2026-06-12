import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import ServicesContent from './ServicesContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Services' : 'Layanan',
    description: isEn
      ? 'Web development, mobile apps, SaaS solutions, and AI integration — technology services from Teridox to grow your business.'
      : 'Web development, aplikasi mobile, solusi SaaS, dan integrasi AI — layanan teknologi dari Teridox untuk bisnis Anda.',
    alternates: buildAlternates(locale, 'services'),
    keywords: isEn
      ? ['web development Bali', 'mobile app development Indonesia', 'SaaS development', 'AI integration service', 'software house Bali', 'IT consulting Indonesia', 'software house services']
      : ['web development Bali', 'pembuatan aplikasi mobile Indonesia', 'pengembangan SaaS', 'integrasi AI', 'software house Bali', 'konsultasi IT Indonesia', 'layanan software house'],
    openGraph: {
      title: isEn ? 'Services | Teridox' : 'Layanan | Teridox',
      description: isEn
        ? 'Web development, mobile apps, AI integration, and more from Teridox.'
        : 'Web development, aplikasi mobile, integrasi AI, dan lainnya dari Teridox.',
      url: `/${locale}/services`,
      type: 'website',
    },
  }
}

export default function ServicesPage() {
  return <ServicesContent />
}
