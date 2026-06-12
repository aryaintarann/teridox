import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import BlogContent from './BlogContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Blog' : 'Blog',
    description: isEn
      ? 'Insights, tutorials, and news from the Teridox team — web development, mobile apps, AI, and digital business.'
      : 'Wawasan, tutorial, dan berita dari tim Teridox — web development, aplikasi mobile, AI, dan bisnis digital.',
    alternates: buildAlternates(locale, 'blog'),
    keywords: isEn
      ? ['Teridox blog', 'web development tips', 'mobile app development', 'AI technology', 'software house insights', 'software tutorial Indonesia']
      : ['blog Teridox', 'tips web development', 'pengembangan aplikasi mobile', 'teknologi AI', 'wawasan software house', 'tutorial software Indonesia'],
    openGraph: {
      title: isEn ? 'Blog | Teridox' : 'Blog | Teridox',
      description: isEn
        ? 'Insights, tutorials, and news from the Teridox team.'
        : 'Wawasan, tutorial, dan berita dari tim Teridox.',
      url: `/${locale}/blog`,
      type: 'website',
    },
  }
}

export default function BlogPage() {
  return <BlogContent />
}
