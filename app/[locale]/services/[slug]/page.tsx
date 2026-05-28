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

async function ServiceJsonLd({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const isEn = locale === 'en'
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://teridox.com'

  const { data: service } = await getSupabase()
    .from('services')
    .select('title,title_en,description,description_en,features,features_en')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!service) return null

  const title = isEn && service.title_en ? service.title_en : service.title
  const description = isEn && service.description_en ? service.description_en : service.description
  const features: string[] = (isEn && service.features_en?.length ? service.features_en : service.features) ?? []

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url: `${baseUrl}/${locale}/services/${slug}`,
    provider: {
      '@type': 'Organization',
      name: 'Teridox',
      url: baseUrl,
    },
    areaServed: { '@type': 'Place', name: 'Indonesia' },
    hasOfferCatalog: features.length > 0 ? {
      '@type': 'OfferCatalog',
      name: title,
      itemListElement: features.map((f, i) => ({
        '@type': 'Offer',
        position: i + 1,
        name: f,
      })),
    } : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default async function ServiceSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  return (
    <>
      <ServiceJsonLd params={params} />
      <ServiceSlugContent />
    </>
  )
}
