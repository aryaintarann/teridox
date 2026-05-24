'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SiteSetting } from '@/lib/types/admin'
import { Save, RefreshCw, Upload, X, Check } from 'lucide-react'
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
  tiktok_url:         'URL TikTok',
  twitter_url:        'URL X / Twitter',
  threads_url:        'URL Threads',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [heroUploaded, setHeroUploaded] = useState(false)
  const heroInputRef = useRef<HTMLInputElement>(null)
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

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingHero(true)

    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
    const json = await res.json()

    if (res.ok && json.publicUrl) {
      const newUrl = json.publicUrl
      setSettings(prev => ({ ...prev, hero_image_url: newUrl }))
      // Save immediately to DB
      await supabase.from('site_settings').upsert(
        { key: 'hero_image_url', value: newUrl, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
      setHeroUploaded(true)
      setTimeout(() => setHeroUploaded(false), 3000)
    }

    setUploadingHero(false)
    if (heroInputRef.current) heroInputRef.current.value = ''
  }

  async function clearHero() {
    setSettings(prev => ({ ...prev, hero_image_url: '' }))
    await supabase.from('site_settings').upsert(
      { key: 'hero_image_url', value: '', updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )
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
          {/* Hero Image */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold">Foto Header</h2>
            <p className="text-xs text-muted-foreground -mt-2">
              Ukuran ideal: minimal <strong>960×1080px</strong> (rasio 8:9), format JPG/WebP.
              Kosongkan untuk pakai ilustrasi default.
            </p>

            {/* Preview */}
            {settings.hero_image_url ? (
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img
                  src={settings.hero_image_url}
                  alt="Foto Header"
                  className="w-full object-cover"
                  style={{ maxHeight: 180 }}
                />
                <button
                  onClick={clearHero}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                  title="Hapus foto header"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center py-10 text-muted-foreground text-sm gap-2">
                <Upload className="h-8 w-8 opacity-40" />
                <span>Belum ada foto header</span>
              </div>
            )}

            {/* Upload button */}
            <input
              ref={heroInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleHeroUpload}
            />
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-2"
              disabled={uploadingHero}
              onClick={() => heroInputRef.current?.click()}
            >
              {heroUploaded
                ? <><Check className="h-4 w-4 text-green-500" /> Foto berhasil dipasang!</>
                : uploadingHero
                  ? <><RefreshCw className="h-4 w-4 animate-spin" /> Mengupload...</>
                  : <><Upload className="h-4 w-4" /> {settings.hero_image_url ? 'Ganti Foto Header' : 'Upload Foto Header'}</>
              }
            </Button>
          </div>

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
            {(['instagram_url', 'tiktok_url', 'twitter_url', 'threads_url'] as const).map(key => (
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
