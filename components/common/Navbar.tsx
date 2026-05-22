'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/lib/theme-context'
import Image from 'next/image'
import { Link, usePathname } from '@/lib/i18n/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
const navItems = [
  { key: 'home',      href: '/' },
  { key: 'about',     href: '/about' },
  { key: 'services',  href: '/services' },
  { key: 'portfolio', href: '/portfolio' },
  { key: 'blog',      href: '/blog' },
  { key: 'contact',   href: '/contact' },
] as const

export default function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Before mount, render neutral (matches SSR). After mount, use actual theme.
  const isDark = mounted && resolvedTheme === 'dark'
  const onDark = isDark

  const navBg = scrolled
    ? isDark ? 'rgba(6,13,26,0.95)' : 'rgba(255,255,255,0.97)'
    : isDark ? 'transparent' : 'rgba(248,250,252,0.92)'
  const navBlur = scrolled ? 'blur(16px)' : !isDark ? 'blur(8px)' : 'none'
  const navBorder = isDark ? '1px solid transparent' : '1px solid var(--border)'

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        height: 72,
        display: 'flex',
        alignItems: 'center',
        background: navBg,
        backdropFilter: navBlur,
        borderBottom: navBorder,
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo/4.svg"
            alt="Teridox"
            width={0}
            height={0}
            style={{ height: '52px', width: 'auto' }}
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(({ key, href }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <NavLink key={key} href={href} isActive={isActive} onDark={onDark}>
                {t(key)}
              </NavLink>
            )
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle onDark={onDark} />
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center rounded-full text-white transition-all hover:opacity-90 hover:scale-[1.03]"
            style={{
              background: '#00C7B7',
              padding: '9px 20px',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'var(--font-dmsans)',
            }}
          >
            {t('cta')}
          </Link>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10">
              <i
                className={`fa-solid fa-${open ? 'xmark' : 'bars'}`}
                style={{ color: onDark ? 'white' : 'var(--foreground)', fontSize: 18 }}
                aria-hidden="true"
              />
            </SheetTrigger>
            <SheetContent side="right" className="w-72" style={{ background: 'var(--card)', borderLeft: '1px solid var(--border)' }}>
              <div className="flex flex-col gap-6 pt-8 px-4">
                <div className="flex items-center">
                  <Image
                    src="/logo/4.svg"
                    alt="Teridox"
                    width={0}
                    height={0}
                    style={{ height: '46px', width: 'auto' }}
                  />
                </div>
                <nav className="flex flex-col gap-1">
                  {navItems.map(({ key, href }) => {
                    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
                    return (
                      <Link
                        key={key}
                        href={href}
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                        style={{
                          color: isActive ? '#00C7B7' : 'var(--muted-foreground)',
                          background: isActive ? 'var(--accent-dim)' : 'transparent',
                          fontFamily: 'var(--font-dmsans)',
                        }}
                      >
                        {t(key)}
                      </Link>
                    )
                  })}
                </nav>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="w-full text-center rounded-full text-white transition-opacity hover:opacity-90"
                  style={{
                    background: '#00C7B7',
                    padding: '11px 20px',
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: 'var(--font-dmsans)',
                  }}
                >
                  {t('cta')}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function NavLink({
  href,
  isActive,
  onDark,
  children,
}: {
  href: string
  isActive: boolean
  onDark: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="relative pb-1 text-sm font-medium transition-colors group"
      style={{
        color: isActive ? '#00C7B7' : onDark ? 'rgba(255,255,255,0.8)' : 'var(--muted-foreground)',
        fontFamily: 'var(--font-dmsans)',
      }}
    >
      {children}
      <span
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-200"
        style={{
          width: isActive ? '100%' : '0%',
          background: '#00C7B7',
        }}
      />
    </Link>
  )
}
