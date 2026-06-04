import type { Metadata } from 'next'
import AboutContent from './AboutContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'About Us' : 'Tentang Kami',
    description: isEn
      ? 'Learn about Teridox — a full-service digital agency from Bali building world-class web, mobile, and AI solutions for businesses across Indonesia and beyond.'
      : 'Kenali Teridox — full-service digital agency dari Bali yang membangun solusi web, mobile, dan AI berkualitas dunia untuk bisnis di Indonesia dan mancanegara.',
    keywords: isEn
      ? ['about Teridox', 'digital agency Bali', 'software house Indonesia', 'web development team', 'tech company Bali']
      : ['tentang Teridox', 'digital agency Bali', 'software house Indonesia', 'tim web development', 'perusahaan teknologi Bali'],
    alternates: {
      canonical: `/${locale}/about`,
      languages: { id: '/id/about', en: '/en/about' },
    },
    openGraph: {
      title: isEn ? 'About Us | Teridox' : 'Tentang Kami | Teridox',
      description: isEn
        ? 'Learn about Teridox — a full-service digital agency from Bali.'
        : 'Kenali Teridox — full-service digital agency dari Bali.',
      url: `/${locale}/about`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'About Us | Teridox' : 'Tentang Kami | Teridox',
      description: isEn
        ? 'Learn about Teridox — a full-service digital agency from Bali.'
        : 'Kenali Teridox — full-service digital agency dari Bali.',
    },
  }
}

export default function AboutPage() {
  return <AboutContent />
}
