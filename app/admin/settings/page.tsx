'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SiteSetting } from '@/lib/types/admin'
import { Save, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SETTING_LABELS: Record<string, string> = {
  company_name:       'Nama Perusahaan',
  company_email:      'Email',
  company_phone:      'Nomor Telepon',
  company_address:    'Alamat',
  company_hours:      'Jam Operasional',
  whatsapp_number:    'Nomor WhatsApp (tanpa + dan spasi, contoh: 6281234567890)',
  footer_description: 'Deskripsi Footer',
  instagram_url:      'URL Instagram',
  linkedin_url:       'URL LinkedIn',
  twitter_url:        'URL X / Twitter',
  youtube_url:        'URL YouTube',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('site_settings').select('*')
      const map: Record<string, string> = {}
      ;(data ?? []).forEach((s: SiteSetting) => { map[s.key] = s.value })
      setSettings(map)
      setLoading(false)
    }
    fetch()
  }, [])

  async function save() {
    setSaving(true)
    const upserts = Object.entries(settings).map(([key, value]) => ({
      key, value, updated_at: new Date().toISOString(),
    }))
    await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin" /> Memuat pengaturan...
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pengaturan</h1>
          <p className="text-muted-foreground mt-1 text-sm">Informasi dan konfigurasi website</p>
        </div>
        <Button onClick={save} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saved ? 'Tersimpan!' : saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Info */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold">Informasi Perusahaan</h2>
          {(['company_name', 'company_email', 'company_phone', 'company_address', 'company_hours', 'whatsapp_number'] as const).map(key => (
            <div key={key}>
              <Label className="text-xs mb-1">{SETTING_LABELS[key]}</Label>
              <Input
                value={settings[key] ?? ''}
                onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={SETTING_LABELS[key]}
              />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Footer Content */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold">Konten Footer</h2>
            <div>
              <Label className="text-xs mb-1">{SETTING_LABELS.footer_description}</Label>
              <textarea
                value={settings.footer_description ?? ''}
                onChange={e => setSettings(prev => ({ ...prev, footer_description: e.target.value }))}
                placeholder="Deskripsi singkat perusahaan yang muncul di footer..."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold">Media Sosial</h2>
            {(['instagram_url', 'linkedin_url', 'twitter_url', 'youtube_url'] as const).map(key => (
              <div key={key}>
                <Label className="text-xs mb-1">{SETTING_LABELS[key]}</Label>
                <Input
                  value={settings[key] ?? ''}
                  onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
