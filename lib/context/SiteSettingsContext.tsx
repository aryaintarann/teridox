'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Settings = Record<string, string>

const SiteSettingsContext = createContext<Settings>({})

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})

  useEffect(() => {
    createClient()
      .from('site_settings')
      .select('key,value')
      .then(({ data }) => {
        const map: Settings = {}
        ;(data ?? []).forEach(({ key, value }: { key: string; value: string }) => {
          map[key] = value
        })
        setSettings(map)
      })
  }, [])

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
