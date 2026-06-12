import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
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
      ? 'Learn about Teridox — a software house from Bali building world-class web, mobile, and SaaS solutions for businesses across Indonesia and beyond.'
      : 'Kenali Teridox — software house dari Bali yang membangun solusi web, mobile, dan SaaS berkualitas dunia untuk bisnis di Indonesia dan mancanegara.',
    keywords: isEn
      ? ['about Teridox', 'software house Bali', 'software house Indonesia', 'web development team', 'tech company Bali']
      : ['tentang Teridox', 'software house Bali', 'software house Indonesia', 'tim web development', 'perusahaan teknologi Bali'],
    alternates: buildAlternates(locale, 'about'),
    openGraph: {
      title: isEn ? 'About Us | Teridox' : 'Tentang Kami | Teridox',
      description: isEn
        ? 'Learn about Teridox — a software house from Bali.'
        : 'Kenali Teridox — software house dari Bali.',
      url: `/${locale}/about`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'About Us | Teridox' : 'Tentang Kami | Teridox',
      description: isEn
        ? 'Learn about Teridox — a software house from Bali.'
        : 'Kenali Teridox — software house dari Bali.',
    },
  }
}

export default function AboutPage() {
  return <AboutContent />
}
