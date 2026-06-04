import type { Metadata } from 'next'
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
      ? 'Web development, mobile apps, UI/UX design, AI integration, and more — technology services from Teridox to grow your business.'
      : 'Web development, aplikasi mobile, UI/UX design, integrasi AI, dan lainnya — layanan teknologi dari Teridox untuk bisnis Anda.',
    alternates: {
      canonical: `/${locale}/services`,
      languages: { id: '/id/services', en: '/en/services' },
    },
    keywords: isEn
      ? ['web development Bali', 'mobile app development Indonesia', 'UI UX design', 'AI integration service', 'software house Bali', 'IT consulting Indonesia', 'digital agency services']
      : ['web development Bali', 'pembuatan aplikasi mobile Indonesia', 'desain UI UX', 'integrasi AI', 'software house Bali', 'konsultasi IT Indonesia', 'layanan digital agency'],
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
