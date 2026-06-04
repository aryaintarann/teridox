import type { Metadata } from 'next'
import TestimonialsContent from './TestimonialsContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Share Your Experience' : 'Bagikan Pengalaman',
    description: isEn
      ? 'Share your experience working with Teridox. Your feedback helps other businesses find the right technology partner in Bali, Indonesia.'
      : 'Bagikan pengalaman Anda bekerja bersama Teridox. Masukan Anda membantu bisnis lain menemukan mitra teknologi yang tepat di Bali, Indonesia.',
    alternates: {
      canonical: `/${locale}/testimonials`,
      languages: { id: '/id/testimonials', en: '/en/testimonials' },
    },
    openGraph: {
      title: isEn ? 'Share Your Experience | Teridox' : 'Bagikan Pengalaman | Teridox',
      description: isEn
        ? 'Share your experience working with Teridox digital agency.'
        : 'Bagikan pengalaman Anda bekerja bersama Teridox digital agency.',
      url: `/${locale}/testimonials`,
      type: 'website',
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default function TestimonialsPage() {
  return <TestimonialsContent />
}
