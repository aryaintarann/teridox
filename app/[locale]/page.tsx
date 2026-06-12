import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import Hero from '@/components/sections/Hero'
import AboutSnapshot from '@/components/sections/AboutSnapshot'
import ServicesPreview from '@/components/sections/ServicesPreview'
import Stats from '@/components/sections/Stats'
import PortfolioHighlight from '@/components/sections/PortfolioHighlight'
import TestimonialsSlider from '@/components/sections/TestimonialsSlider'
import BlogPreview from '@/components/sections/BlogPreview'
import CTASection from '@/components/sections/CTASection'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: 'Teridox — Software House Bali',
    description: isEn
      ? 'Teridox is a software house from Bali — web development, mobile apps, and SaaS solutions for businesses ready to grow.'
      : 'Teridox adalah software house dari Bali. Spesialis web development, mobile app, dan pengembangan SaaS untuk bisnis yang ingin berkembang.',
    alternates: buildAlternates(locale),
    openGraph: {
      title: 'Teridox — Software House Bali',
      description: isEn
        ? 'Teridox is a software house from Bali — web development, mobile apps, and SaaS solutions for businesses ready to grow.'
        : 'Teridox adalah software house dari Bali. Web development, mobile app, dan pengembangan SaaS untuk bisnis yang ingin berkembang.',
      url: `/${locale}`,
      type: 'website',
      locale: isEn ? 'en_US' : 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Teridox — Software House Bali',
      description: isEn
        ? 'Software house from Bali — web development, mobile apps, and SaaS solutions.'
        : 'Software house dari Bali — web development, mobile app, dan pengembangan SaaS.',
    },
  }
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Teridox',
  url: 'https://teridox.com',
  logo: 'https://teridox.com/logo.png',
  description:
    'Software house from Bali — web development, mobile apps, and SaaS solutions for businesses ready to grow.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bali',
    addressCountry: 'ID',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['Indonesian', 'English'],
  },
  sameAs: [
    'https://instagram.com/teridox',
    'https://tiktok.com/@teridox',
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Hero />
      <AboutSnapshot />
      <ServicesPreview />
      <Stats />
      <PortfolioHighlight />
      <TestimonialsSlider />
      <BlogPreview />
      <CTASection />
    </>
  )
}
