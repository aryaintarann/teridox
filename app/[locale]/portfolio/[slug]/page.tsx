import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import PortfolioSlugContent from './PortfolioSlugContent'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const isEn = locale === 'en'

  const { data: item } = await getSupabase()
    .from('portfolio_items')
    .select('title,title_en,description,description_en,technologies,image_url,category')
    .eq('slug', slug)
    .single()

  if (!item) return { title: 'Not Found' }

  const title = isEn && item.title_en ? item.title_en : item.title
  const description = isEn && item.description_en ? item.description_en : item.description

  return {
    title,
    description,
    keywords: item.technologies ?? [],
    alternates: {
      canonical: `/${locale}/portfolio/${slug}`,
      languages: { id: `/id/portfolio/${slug}`, en: `/en/portfolio/${slug}` },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/portfolio/${slug}`,
      type: 'website',
      images: item.image_url ? [{ url: item.image_url, alt: title }] : [],
    },
    twitter: {
      card: item.image_url ? 'summary_large_image' : 'summary',
      title,
      description,
      images: item.image_url ? [item.image_url] : [],
    },
  }
}

export default function PortfolioSlugPage() {
  return <PortfolioSlugContent />
}
