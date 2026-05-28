import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
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
    title: 'Teridox — Full-Service Digital Agency Bali',
    description: isEn
      ? 'Teridox is a full-service digital agency from Bali — web, mobile, AI, and marketing for businesses ready to grow.'
      : 'Teridox adalah full-service digital agency dari Bali. Web development, mobile app, UI/UX design, dan AI integration untuk bisnis yang ingin berkembang.',
    alternates: {
      canonical: `/${locale}`,
      languages: { id: '/id', en: '/en' },
    },
    openGraph: {
      title: 'Teridox — Full-Service Digital Agency Bali',
      description: isEn
        ? 'Teridox is a full-service digital agency from Bali — web, mobile, AI, and marketing for businesses ready to grow.'
        : 'Teridox adalah full-service digital agency dari Bali. Web, mobile, AI, dan marketing untuk bisnis yang ingin berkembang.',
      url: `/${locale}`,
      type: 'website',
      locale: isEn ? 'en_US' : 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Teridox — Full-Service Digital Agency Bali',
      description: isEn
        ? 'Full-service digital agency from Bali — web, mobile, AI, and marketing.'
        : 'Digital agency dari Bali — web development, mobile app, dan AI integration.',
    },
  }
}

export default function HomePage() {
  return (
    <>
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
