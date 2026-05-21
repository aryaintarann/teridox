'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
      style={{ color: onDark ? 'rgba(255,255,255,0.7)' : 'var(--muted-foreground)', fontSize: 15 }}
    >
      <i className={`fa-solid fa-${theme === 'dark' ? 'sun' : 'moon'}`} aria-hidden="true" />
    </button>
  )
}
