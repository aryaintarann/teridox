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

  const { data: service } = await supabase
    .from('services')
    .select('title,title_en,description,description_en,accent_color')
    .eq('slug', slug)
    .single()

  const title = (locale === 'en' && service?.title_en ? service.title_en : service?.title) ?? 'Layanan'
  const desc = (locale === 'en' && service?.description_en ? service.description_en : service?.description) ?? ''
  const accent = service?.accent_color ?? '#00C7B7'
  const shortDesc = desc.length > 120 ? desc.slice(0, 117) + '...' : desc

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
        {/* Top: brand */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#00C7B7', fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
            TERIDOX
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            color: '#94A3B8',
            padding: '8px 20px',
            borderRadius: 100,
            fontSize: 16,
          }}>
            {locale === 'en' ? 'Service' : 'Layanan'}
          </div>
        </div>

        {/* Accent bar + title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ width: 56, height: 6, borderRadius: 3, background: accent }} />
          <div style={{
            color: 'white',
            fontSize: title.length > 40 ? 52 : 64,
            fontWeight: 800,
            lineHeight: 1.15,
          }}>
            {title}
          </div>
          {shortDesc && (
            <div style={{ color: '#94A3B8', fontSize: 24, lineHeight: 1.5, maxWidth: 860 }}>
              {shortDesc}
            </div>
          )}
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
          <div style={{ color: '#475569', fontSize: 18 }}>teridox.com/services</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
