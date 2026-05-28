import type { Metadata } from 'next'
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
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { id: '/id/blog', en: '/en/blog' },
    },
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
