import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'

const serviceLinks = [
  { label: 'Web Development',  href: '/services/web-development' },
  { label: 'Mobile App',       href: '/services/mobile-development' },
  { label: 'UI/UX Design',     href: '/services/ui-ux-design' },
  { label: 'Digital Marketing',href: '/services/digital-marketing' },
  { label: 'Konsultasi IT',    href: '/services/consulting' },
  { label: 'AI Integration',   href: '/services/ai-integration' },
]

const companyLinks = [
  { labelKey: 'home',      href: '/' },
  { labelKey: 'about',     href: '/about' },
  { labelKey: 'services',  href: '/services' },
  { labelKey: 'portfolio', href: '/portfolio' },
  { labelKey: 'blog',      href: '/blog' },
  { labelKey: 'contact',   href: '/contact' },
  { labelKey: 'faq',       href: '/faq' },
]

const contactItems = [
  { icon: 'location-dot', text: 'Bali, Indonesia' },
  { icon: 'envelope',     text: 'hello@teridox.com' },
  { icon: 'phone',        text: '+62 812-3456-7890' },
  { icon: 'clock',        text: 'Sen–Jum, 09.00–18.00 WITA' },
]

const socialLinks = [
  { icon: 'instagram', brand: true,  href: 'https://instagram.com/teridox' },
  { icon: 'linkedin-in', brand: true, href: 'https://linkedin.com/company/teridox' },
  { icon: 'x-twitter',  brand: true, href: 'https://x.com/teridox' },
  { icon: 'youtube',    brand: true, href: 'https://youtube.com/@teridox' },
]

export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')

  return (
    <footer style={{ background: '#0F1B2D', color: '#94A3B8', fontFamily: 'var(--font-dmsans)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 40px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40,
            paddingBottom: 48,
            borderBottom: '1px solid #1E293B',
          }}
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#00C7B7' }}
              >
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 16, color: 'white' }}>T</span>
              </div>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 18, color: 'white' }}>Teridox</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, marginBottom: 24 }}>
              {t('description')}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {socialLinks.map(({ icon, brand, href }) => (
                <FooterSocial key={icon} icon={icon} brand={brand} href={href} />
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#00C7B7', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 20 }}>
              {t('company')}
            </div>
            {companyLinks.map(({ labelKey, href }) => (
              <Link
                key={href}
                href={href}
                className="block mb-2.5 text-sm transition-colors hover:text-white"
                style={{ color: '#94A3B8' }}
              >
                {labelKey === 'faq' ? 'FAQ' : nav(labelKey as any)}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#00C7B7', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 20 }}>
              {t('services')}
            </div>
            {serviceLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="block mb-2.5 text-sm transition-colors hover:text-white"
                style={{ color: '#94A3B8' }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#00C7B7', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 20 }}>
              {t('resources')}
            </div>
            {contactItems.map(({ icon, text }) => (
              <div key={icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                <i
                  className={`fa-solid fa-${icon}`}
                  style={{ color: '#00C7B7', marginTop: 3, width: 16, flexShrink: 0, fontSize: 13 }}
                  aria-hidden="true"
                />
                <span style={{ fontSize: 14 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13 }}>{t('copyright')}</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/privacy" className="text-sm transition-colors hover:text-white" style={{ color: '#94A3B8' }}>
              {t('links.privacy')}
            </Link>
            <Link href="/terms" className="text-sm transition-colors hover:text-white" style={{ color: '#94A3B8' }}>
              {t('links.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterSocial({ icon, brand, href }: { icon: string; brand: boolean; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={icon}
      className="flex items-center justify-center rounded-full transition-all hover:bg-[#00C7B7] hover:border-[#00C7B7] group"
      style={{
        width: 36,
        height: 36,
        border: '1px solid #1E293B',
        color: '#94A3B8',
      }}
    >
      <i
        className={`${brand ? 'fa-brands' : 'fa-solid'} fa-${icon} group-hover:text-white transition-colors`}
        style={{ fontSize: 14 }}
        aria-hidden="true"
      />
    </a>
  )
}
