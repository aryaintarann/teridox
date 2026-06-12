import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import FAQContent from './FAQContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'FAQ' : 'FAQ',
    description: isEn
      ? 'Find answers to common questions about Teridox services, pricing, project timelines, and our working process as a software house in Bali.'
      : 'Temukan jawaban atas pertanyaan umum tentang layanan, harga, waktu pengerjaan proyek, dan proses kerja Teridox sebagai software house di Bali.',
    keywords: isEn
      ? ['FAQ Teridox', 'software house questions', 'software house pricing Indonesia', 'web development FAQ', 'how long website takes']
      : ['FAQ Teridox', 'pertanyaan software house', 'harga software house Indonesia', 'FAQ web development', 'berapa lama buat website'],
    alternates: buildAlternates(locale, 'faq'),
    openGraph: {
      title: isEn ? 'FAQ | Teridox' : 'FAQ | Teridox',
      description: isEn
        ? 'Answers to common questions about Teridox services and process.'
        : 'Jawaban atas pertanyaan umum tentang layanan dan proses Teridox.',
      url: `/${locale}/faq`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: isEn ? 'FAQ | Teridox' : 'FAQ | Teridox',
      description: isEn
        ? 'Answers to common questions about Teridox services and process.'
        : 'Jawaban atas pertanyaan umum tentang layanan dan proses Teridox.',
    },
  }
}

export default function FAQPage() {
  return <FAQContent />
}
