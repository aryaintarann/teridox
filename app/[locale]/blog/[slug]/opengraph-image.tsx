import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CAT_COLOR: Record<string, string> = {
  teknologi: '#3B82F6',
  bisnis:    '#8B5CF6',
  tutorial:  '#10B981',
  berita:    '#F59E0B',
  lainnya:   '#06B6D4',
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title,title_en,category,reading_time_min')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  const title = (locale === 'en' && post?.title_en ? post.title_en : post?.title) ?? 'Blog'
  const category = post?.category ?? 'artikel'
  const accentColor = CAT_COLOR[category] ?? '#00C7B7'
  const readingTime = post?.reading_time_min ?? 5

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: brand + category */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#00C7B7', fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
            TERIDOX
          </div>
          <div style={{
            background: accentColor + '25',
            border: `1px solid ${accentColor}60`,
            color: accentColor,
            padding: '8px 20px',
            borderRadius: 100,
            fontSize: 18,
            fontWeight: 600,
            textTransform: 'capitalize',
          }}>
            {category}
          </div>
        </div>

        {/* Title */}
        <div style={{
          color: 'white',
          fontSize: title.length > 60 ? 44 : 56,
          fontWeight: 800,
          lineHeight: 1.2,
          maxWidth: 900,
        }}>
          {title}
        </div>

        {/* Bottom: blog label + reading time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.08)',
            padding: '10px 20px',
            borderRadius: 10,
          }}>
            <div style={{ color: '#94A3B8', fontSize: 18 }}>
              📖 {readingTime} min read
            </div>
          </div>
          <div style={{ color: '#475569', fontSize: 18 }}>
            teridox.com/blog
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
