import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://teridox.com').replace(/\/$/, '')
const LOCALES = ['id', 'en'] as const

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '',              priority: 1.0, changeFreq: 'weekly'  },
  { path: '/services',     priority: 0.9, changeFreq: 'monthly' },
  { path: '/portfolio',    priority: 0.9, changeFreq: 'monthly' },
  { path: '/blog',         priority: 0.8, changeFreq: 'weekly'  },
  { path: '/contact',      priority: 0.8, changeFreq: 'monthly' },
  { path: '/about',        priority: 0.7, changeFreq: 'monthly' },
  { path: '/faq',          priority: 0.7, changeFreq: 'monthly' },
  { path: '/testimonials', priority: 0.6, changeFreq: 'monthly' },
  { path: '/privacy',      priority: 0.3, changeFreq: 'yearly'  },
  { path: '/terms',        priority: 0.3, changeFreq: 'yearly'  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    for (const { path, priority, changeFreq } of STATIC_ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: changeFreq,
        priority,
      })
    }
  }

  const [{ data: posts }, { data: services }, { data: portfolio }] = await Promise.all([
    supabase.from('blog_posts').select('slug,created_at').eq('published', true),
    supabase.from('services').select('slug').eq('active', true),
    supabase.from('portfolio_items').select('slug,created_at'),
  ])

  for (const post of posts ?? []) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.created_at ? new Date(post.created_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  for (const svc of services ?? []) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/services/${svc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  for (const item of portfolio ?? []) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/portfolio/${item.slug}`,
        lastModified: item.created_at ? new Date(item.created_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return entries
}
