'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { useSiteSettings } from '@/lib/context/SiteSettingsContext'

const companyLinks = [
  { labelKey: 'home',      href: '/' },
  { labelKey: 'about',     href: '/about' },
  { labelKey: 'services',  href: '/services' },
  { labelKey: 'portfolio', href: '/portfolio' },
  { labelKey: 'blog',      href: '/blog' },
  { labelKey: 'contact',   href: '/contact' },
  { labelKey: 'faq',       href: '/faq' },
]

export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const st = useTranslations('services')
  const contactT = useTranslations('contact')
  const settings = useSiteSettings()

  const email       = settings.company_email       || contactT('info.email')
  const phone       = settings.company_phone       || contactT('info.phone')
  const address     = settings.company_address     || contactT('info.address')
  const hours       = settings.company_hours       || contactT('info.hours')
  const description = settings.footer_description  || t('description')
  const waNumber    = settings.whatsapp_number

  const contactItems = [
    { icon: 'location-dot', text: address, href: null },
    { icon: 'envelope',     text: email,   href: `mailto:${email}` },
    { icon: 'phone',        text: phone,   href: `tel:${phone.replace(/\s/g, '')}` },
    { icon: 'clock',        text: hours,   href: null },
    ...(waNumber ? [{ icon: 'whatsapp', text: `WhatsApp: +${waNumber}`, href: `https://wa.me/${waNumber}` }] : []),
  ]

  const socialLinks = [
    { icon: 'instagram',   brand: true, href: settings.instagram_url || 'https://instagram.com/teridox' },
    { icon: 'linkedin-in', brand: true, href: settings.linkedin_url  || 'https://linkedin.com/company/teridox' },
    { icon: 'x-twitter',   brand: true, href: settings.twitter_url   || 'https://x.com/teridox' },
    { icon: 'youtube',     brand: true, href: settings.youtube_url   || 'https://youtube.com/@teridox' },
  ]
  const serviceLinks = (st.raw('items') as Array<{ slug: string; title: string }>).map(
    ({ slug, title }) => ({ label: title, href: `/services/${slug}` })
  )

  return (
    <footer
      className="bg-slate-50 dark:bg-[#0F1B2D] text-slate-500 dark:text-[#94A3B8]"
      style={{ fontFamily: 'var(--font-dmsans)' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 40px 0' }}>
        <div
          className="border-b border-slate-200 dark:border-[#1E293B]"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40,
            paddingBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo/4.svg"
                alt="Teridox"
                width={0}
                height={0}
                style={{ height: '52px', width: 'auto' }}
              />
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, marginBottom: 24 }}>
              {description}
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
                className="block mb-2.5 text-sm transition-colors text-slate-500 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white"
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
                className="block mb-2.5 text-sm transition-colors text-slate-500 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white"
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
            {contactItems.map(({ icon, text, href }) => (
              <div key={icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                <i
                  className={`${icon === 'whatsapp' ? 'fa-brands' : 'fa-solid'} fa-${icon}`}
                  style={{ color: '#00C7B7', marginTop: 3, width: 16, flexShrink: 0, fontSize: 13 }}
                  aria-hidden="true"
                />
                {href
                  ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ fontSize: 14 }} className="hover:text-slate-900 dark:hover:text-white transition-colors">{text}</a>
                  : <span style={{ fontSize: 14 }}>{text}</span>
                }
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
            <Link
              href="/privacy"
              className="text-sm transition-colors text-slate-500 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white"
            >
              {t('links.privacy')}
            </Link>
            <Link
              href="/terms"
              className="text-sm transition-colors text-slate-500 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white"
            >
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
      className="flex items-center justify-center rounded-full transition-all hover:bg-[#00C7B7] hover:border-[#00C7B7] group border border-slate-200 dark:border-[#1E293B] text-slate-500 dark:text-[#94A3B8]"
      style={{ width: 36, height: 36 }}
    >
      <i
        className={`${brand ? 'fa-brands' : 'fa-solid'} fa-${icon} group-hover:text-white transition-colors`}
        style={{ fontSize: 14 }}
        aria-hidden="true"
      />
    </a>
  )
}
