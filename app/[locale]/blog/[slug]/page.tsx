import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import BlogSlugContent from './BlogSlugContent'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const isEn = locale === 'en'

  const { data: post } = await getSupabase()
    .from('blog_posts')
    .select('title,title_en,content,content_en,cover_image_url,tags,category')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'Not Found' }

  const title = isEn && post.title_en ? post.title_en : post.title
  const content = isEn && post.content_en ? post.content_en : post.content
  const description = stripMarkdown(content).slice(0, 160)

  return {
    title,
    description,
    keywords: post.tags ?? [],
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: { id: `/id/blog/${slug}`, en: `/en/blog/${slug}` },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/blog/${slug}`,
      type: 'article',
      images: post.cover_image_url ? [{ url: post.cover_image_url, alt: title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  }
}

async function ArticleJsonLd({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const isEn = locale === 'en'
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://teridox.com'

  const { data: post } = await getSupabase()
    .from('blog_posts')
    .select('title,title_en,content,content_en,cover_image_url,created_at,tags')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return null

  const title = isEn && post.title_en ? post.title_en : post.title
  const content = isEn && post.content_en ? post.content_en : post.content
  const description = stripMarkdown(content).slice(0, 200)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: post.cover_image_url ? [post.cover_image_url] : [],
    datePublished: post.created_at,
    dateModified: post.created_at,
    keywords: (post.tags ?? []).join(', '),
    url: `${baseUrl}/${locale}/blog/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Teridox',
      url: baseUrl,
      logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
    },
    author: {
      '@type': 'Organization',
      name: 'Teridox',
      url: baseUrl,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  return (
    <>
      <ArticleJsonLd params={params} />
      <BlogSlugContent />
    </>
  )
}
