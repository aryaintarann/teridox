'use client'

import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark' | undefined
  setTheme: (t: Theme) => void
}

export const ThemeCtx = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: undefined,
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeCtx)
}
