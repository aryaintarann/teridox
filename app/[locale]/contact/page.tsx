import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import ContactContent from './ContactContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Contact' : 'Kontak',
    description: isEn
      ? 'Get in touch with Teridox for a free consultation on web development, mobile apps, SaaS, or AI integration. Based in Bali, serving businesses across Indonesia.'
      : 'Hubungi Teridox untuk konsultasi gratis tentang web development, aplikasi mobile, SaaS, atau integrasi AI. Berbasis di Bali, melayani bisnis di seluruh Indonesia.',
    keywords: isEn
      ? ['contact Teridox', 'software house consultation', 'web development Bali', 'hire software house Indonesia', 'free consultation']
      : ['kontak Teridox', 'konsultasi software house', 'web development Bali', 'sewa software house Indonesia', 'konsultasi gratis'],
    alternates: buildAlternates(locale, 'contact'),
    openGraph: {
      title: isEn ? 'Contact | Teridox' : 'Kontak | Teridox',
      description: isEn
        ? 'Contact Teridox for a free consultation on web, mobile, or AI solutions.'
        : 'Hubungi Teridox untuk konsultasi gratis solusi web, mobile, atau AI.',
      url: `/${locale}/contact`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'Contact | Teridox' : 'Kontak | Teridox',
      description: isEn
        ? 'Contact Teridox for a free consultation.'
        : 'Hubungi Teridox untuk konsultasi gratis.',
    },
  }
}

export default function ContactPage() {
  return <ContactContent />
}
