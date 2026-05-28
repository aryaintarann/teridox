import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import ServiceSlugContent from './ServiceSlugContent'

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

  const { data: service } = await getSupabase()
    .from('services')
    .select('title,title_en,description,description_en')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!service) return { title: 'Not Found' }

  const title = isEn && service.title_en ? service.title_en : service.title
  const description = isEn && service.description_en ? service.description_en : service.description

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/services/${slug}`,
      languages: { id: `/id/services/${slug}`, en: `/en/services/${slug}` },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/services/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default function ServiceSlugPage() {
  return <ServiceSlugContent />
}
