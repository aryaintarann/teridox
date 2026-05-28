import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

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

  const { data: item } = await supabase
    .from('portfolio_items')
    .select('title,title_en,description,description_en,category,technologies')
    .eq('slug', slug)
    .single()

  const title = (locale === 'en' && item?.title_en ? item.title_en : item?.title) ?? 'Project'
  const desc = (locale === 'en' && item?.description_en ? item.description_en : item?.description) ?? ''
  const category = item?.category ?? ''
  const techs: string[] = (item?.technologies ?? []).slice(0, 4)
  const shortDesc = desc.length > 100 ? desc.slice(0, 97) + '...' : desc

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
        {/* Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#00C7B7', fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
            TERIDOX
          </div>
          {category && (
            <div style={{
              background: 'rgba(0,199,183,0.15)',
              border: '1px solid rgba(0,199,183,0.3)',
              color: '#00C7B7',
              padding: '8px 20px',
              borderRadius: 100,
              fontSize: 16,
              textTransform: 'uppercase',
              fontWeight: 600,
              letterSpacing: 1,
            }}>
              {category}
            </div>
          )}
        </div>

        {/* Title + desc */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            color: 'white',
            fontSize: title.length > 50 ? 48 : 60,
            fontWeight: 800,
            lineHeight: 1.15,
          }}>
            {title}
          </div>
          {shortDesc && (
            <div style={{ color: '#94A3B8', fontSize: 22, lineHeight: 1.5, maxWidth: 800 }}>
              {shortDesc}
            </div>
          )}
        </div>

        {/* Bottom: tech tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {techs.map(t => (
            <div
              key={t}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#CBD5E1',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {t}
            </div>
          ))}
          <div style={{ marginLeft: 'auto', color: '#475569', fontSize: 16 }}>
            teridox.com/portfolio
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
