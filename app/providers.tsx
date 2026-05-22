'use client'

import { useState, useEffect, ReactNode } from 'react'
import { ThemeCtx, Theme } from '@/lib/theme-context'

function getResolved(t: Theme): 'light' | 'dark' {
  if (t !== 'system') return t
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function Providers({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolved] = useState<'light' | 'dark' | undefined>(undefined)

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme | null) ?? 'system'
    const resolved = getResolved(stored)
    setThemeState(stored)
    setResolved(resolved)
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }, [])

  function setTheme(t: Theme) {
    const resolved = getResolved(t)
    setThemeState(t)
    setResolved(resolved)
    document.documentElement.classList.toggle('dark', resolved === 'dark')
    localStorage.setItem('theme', t)
  }

  return (
    <ThemeCtx.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  )
}
