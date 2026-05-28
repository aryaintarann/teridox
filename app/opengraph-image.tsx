import { ImageResponse } from 'next/og'

export const alt = 'Teridox — Full-Service Digital Agency Bali'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F2942 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: '#00C7B7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ color: 'white', fontSize: 24, fontWeight: 800 }}>T</div>
          </div>
          <div style={{ color: '#00C7B7', fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>
            TERIDOX
          </div>
        </div>

        {/* Headline */}
        <div style={{
          color: 'white',
          fontSize: 64,
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.15,
          marginBottom: 24,
        }}>
          Full-Service Digital Agency
        </div>

        {/* Subtext */}
        <div style={{ color: '#94A3B8', fontSize: 28, textAlign: 'center', marginBottom: 48 }}>
          Bali, Indonesia · Web · Mobile · AI
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Web Development', 'Mobile App', 'AI Integration', 'UI/UX Design'].map(tag => (
            <div
              key={tag}
              style={{
                background: 'rgba(0, 199, 183, 0.15)',
                border: '1px solid rgba(0, 199, 183, 0.4)',
                color: '#00C7B7',
                padding: '10px 24px',
                borderRadius: 100,
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
