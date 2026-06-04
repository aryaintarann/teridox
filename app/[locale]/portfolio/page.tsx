import type { Metadata } from 'next'
import PortfolioContent from './PortfolioContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Portfolio' : 'Portfolio',
    description: isEn
      ? 'Explore Teridox projects — web apps, mobile apps, and custom software built for businesses across Indonesia and beyond.'
      : 'Jelajahi proyek-proyek Teridox — aplikasi web, mobile, dan software yang dibangun untuk bisnis di Indonesia dan mancanegara.',
    alternates: {
      canonical: `/${locale}/portfolio`,
      languages: { id: '/id/portfolio', en: '/en/portfolio' },
    },
    keywords: isEn
      ? ['Teridox portfolio', 'web app projects Bali', 'mobile app portfolio Indonesia', 'software projects', 'digital agency work', 'case studies Indonesia']
      : ['portfolio Teridox', 'proyek web Bali', 'portfolio aplikasi mobile Indonesia', 'proyek software', 'karya digital agency', 'studi kasus Indonesia'],
    openGraph: {
      title: isEn ? 'Portfolio | Teridox' : 'Portfolio | Teridox',
      description: isEn
        ? 'Explore Teridox projects — web, mobile, and custom software.'
        : 'Jelajahi proyek-proyek Teridox — web, mobile, dan software.',
      url: `/${locale}/portfolio`,
      type: 'website',
    },
  }
}

export default function PortfolioPage() {
  return <PortfolioContent />
}
