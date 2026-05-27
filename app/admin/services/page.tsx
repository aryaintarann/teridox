'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Service } from '@/lib/types/admin'
import { Plus, Pencil, Trash2, RefreshCw, X, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

// ── Icons yang tersedia ──────────────────────────────────────────────────────
const ICONS = ['Globe', 'Smartphone', 'Package', 'BrainCircuit', 'Code', 'Database',
  'Cloud', 'Shield', 'Zap', 'Users', 'Settings', 'Layers', 'Server', 'BarChart2', 'Headphones', 'Layout']
const ACCENT_COLORS = ['#00C7B7', '#6366F1', '#F59E0B', '#8B5CF6', '#EF4444', '#10B981', '#F97316', '#3B82F6']

// ── Form intermediate types ──────────────────────────────────────────────────
type ProcessRow = { titleId: string; descId: string; titleEn: string; descEn: string }
type FaqRow     = { qId: string; aId: string; qEn: string; aEn: string }

type FormState = {
  slug: string; icon: string; accent_color: string
  title: string; title_en: string; description: string; description_en: string
  featuresId: string; featuresEn: string
  process: ProcessRow[]; faq: FaqRow[]
  display_order: number; active: boolean
}

const EMPTY: FormState = {
  slug: '', icon: 'Globe', accent_color: '#00C7B7',
  title: '', title_en: '', description: '', description_en: '',
  featuresId: '', featuresEn: '',
  process: [], faq: [],
  display_order: 0, active: true,
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function serviceToForm(s: Service): FormState {
  return {
    slug: s.slug, icon: s.icon, accent_color: s.accent_color,
    title: s.title, title_en: s.title_en, description: s.description, description_en: s.description_en,
    featuresId: (s.features ?? []).join('\n'),
    featuresEn: (s.features_en ?? []).join('\n'),
    process: (s.process ?? []).map((p, i) => ({
      titleId: p.title, descId: p.desc,
      titleEn: s.process_en?.[i]?.title ?? '',
      descEn:  s.process_en?.[i]?.desc  ?? '',
    })),
    faq: (s.faq ?? []).map((f, i) => ({
      qId: f.q, aId: f.a,
      qEn: s.faq_en?.[i]?.q ?? '',
      aEn: s.faq_en?.[i]?.a ?? '',
    })),
    display_order: s.display_order, active: s.active,
  }
}

function formToPayload(f: FormState) {
  const features    = f.featuresId.split('\n').map(s => s.trim()).filter(Boolean)
  const features_en = f.featuresEn.split('\n').map(s => s.trim()).filter(Boolean)
  const process     = f.process.map((p, i) => ({ step: i + 1, title: p.titleId, desc: p.descId }))
  const process_en  = f.process.map((p, i) => ({ step: i + 1, title: p.titleEn, desc: p.descEn }))
  const faq         = f.faq.map(q => ({ q: q.qId, a: q.aId }))
  const faq_en      = f.faq.map(q => ({ q: q.qEn, a: q.aEn }))
  return { slug: f.slug, icon: f.icon, accent_color: f.accent_color,
    title: f.title, title_en: f.title_en, description: f.description, description_en: f.description_en,
    features, features_en, process, process_en, faq, faq_en,
    display_order: f.display_order, active: f.active }
}

// ── Component helpers ────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{children}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)
  const [open, setOpen]         = useState(false)
  const [editing, setEditing]   = useState<Service | null>(null)
  const [form, setForm]         = useState<FormState>({ ...EMPTY })
  const [saving, setSaving]     = useState(false)
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true })
    setServices(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openNew() {
    setEditing(null)
    setForm({ ...EMPTY, display_order: services.length })
    setOpen(true)
  }

  function openEdit(s: Service) {
    setEditing(s)
    setForm(serviceToForm(s))
    setOpen(true)
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'title' && !editing) next.slug = slugify(value as string)
      return next
    })
  }

  // process helpers
  function addStep() {
    setForm(p => ({ ...p, process: [...p.process, { titleId: '', descId: '', titleEn: '', descEn: '' }] }))
  }
  function removeStep(i: number) {
    setForm(p => ({ ...p, process: p.process.filter((_, idx) => idx !== i) }))
  }
  function setStep(i: number, field: keyof ProcessRow, val: string) {
    setForm(p => { const rows = [...p.process]; rows[i] = { ...rows[i], [field]: val }; return { ...p, process: rows } })
  }

  // faq helpers
  function addFaq() {
    setForm(p => ({ ...p, faq: [...p.faq, { qId: '', aId: '', qEn: '', aEn: '' }] }))
  }
  function removeFaq(i: number) {
    setForm(p => ({ ...p, faq: p.faq.filter((_, idx) => idx !== i) }))
  }
  function setFaqRow(i: number, field: keyof FaqRow, val: string) {
    setForm(p => { const rows = [...p.faq]; rows[i] = { ...rows[i], [field]: val }; return { ...p, faq: rows } })
  }

  async function save() {
    if (!form.title || !form.slug) return
    setSaving(true)
    const payload = formToPayload(form)
    if (editing) {
      await supabase.from('services').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('services').insert(payload)
    }
    setSaving(false)
    setOpen(false)
    load()
  }

  async function toggleActive(s: Service) {
    await supabase.from('services').update({ active: !s.active }).eq('id', s.id)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Hapus layanan ini?')) return
    await supabase.from('services').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-4 sm:p-8 pt-14 lg:pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Layanan</h1>
          <p className="text-muted-foreground mt-1 text-sm">{services.length} layanan</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-2" /> Layanan Baru
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Memuat...</div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Belum ada layanan. Buat layanan pertama!</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Layanan</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Icon</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Urutan</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.map(s => (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: s.accent_color }}>
                        {s.title.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{s.title}</p>
                        <p className="text-xs text-muted-foreground">/services/{s.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">{s.icon}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={s.active ? 'bg-green-100 text-green-700 dark:bg-green-900/20' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20'}>
                      {s.active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <GripVertical className="h-3.5 w-3.5" /> {s.display_order}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggleActive(s)} title={s.active ? 'Nonaktifkan' : 'Aktifkan'}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <Switch checked={s.active} className="pointer-events-none h-4 w-7" />
                      </button>
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => remove(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Sheet form */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="!w-full !max-w-3xl p-0 flex flex-col">
          <SheetHeader className="px-6 pt-5 pb-4 border-b border-border shrink-0">
            <SheetTitle className="text-lg">{editing ? 'Edit Layanan' : 'Layanan Baru'}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* ── Info Dasar ── */}
            <SectionLabel>Info Dasar</SectionLabel>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Judul (ID) *</Label>
                <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Web Development" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Judul (EN)</Label>
                <Input value={form.title_en} onChange={e => set('title_en', e.target.value)} placeholder="Web Development" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Slug *</Label>
                <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="web-development" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Icon</Label>
                <select value={form.icon} onChange={e => set('icon', e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Urutan</Label>
                <Input type="number" min={0} value={form.display_order}
                  onChange={e => set('display_order', parseInt(e.target.value) || 0)} />
              </div>
            </div>

            {/* Accent color chips */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Warna Aksen</Label>
              <div className="flex items-center gap-2 flex-wrap">
                {ACCENT_COLORS.map(c => (
                  <button key={c} type="button" onClick={() => set('accent_color', c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${form.accent_color === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                    style={{ background: c }} />
                ))}
                <input type="color" value={form.accent_color} onChange={e => set('accent_color', e.target.value)}
                  className="w-7 h-7 rounded-full border border-border cursor-pointer" title="Warna kustom" />
              </div>
            </div>

            {/* ── Deskripsi ── */}
            <SectionLabel>Deskripsi</SectionLabel>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Deskripsi (ID)</Label>
              <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                placeholder="Deskripsi layanan dalam Bahasa Indonesia..." className="resize-y" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Deskripsi (EN)</Label>
              <Textarea value={form.description_en} onChange={e => set('description_en', e.target.value)} rows={3}
                placeholder="Service description in English..." className="resize-y" />
            </div>

            {/* ── Fitur ── */}
            <SectionLabel>Fitur (satu per baris)</SectionLabel>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Fitur (ID)</Label>
                <Textarea value={form.featuresId} onChange={e => set('featuresId', e.target.value)} rows={6}
                  placeholder={'Landing Page & Company Profile\nE-Commerce Platform\nCustom Web Application'} className="text-sm font-mono resize-y" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Fitur (EN)</Label>
                <Textarea value={form.featuresEn} onChange={e => set('featuresEn', e.target.value)} rows={6}
                  placeholder={'Landing Page & Company Profile\nE-Commerce Platform\nCustom Web Application'} className="text-sm font-mono resize-y" />
              </div>
            </div>

            {/* ── Proses Kerja ── */}
            <SectionLabel>Proses Kerja</SectionLabel>

            <div className="space-y-3">
              {form.process.map((step, i) => (
                <div key={i} className="border border-border rounded-xl p-4 space-y-3 bg-muted/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">Step {i + 1}</span>
                    <button type="button" onClick={() => removeStep(i)}
                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <X className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Judul ID</Label>
                      <Input value={step.titleId} onChange={e => setStep(i, 'titleId', e.target.value)} placeholder="Discovery & Planning" className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Judul EN</Label>
                      <Input value={step.titleEn} onChange={e => setStep(i, 'titleEn', e.target.value)} placeholder="Discovery & Planning" className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Deskripsi ID</Label>
                      <Textarea value={step.descId} onChange={e => setStep(i, 'descId', e.target.value)} rows={2} placeholder="Deskripsi step..." className="text-sm resize-none" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Deskripsi EN</Label>
                      <Textarea value={step.descEn} onChange={e => setStep(i, 'descEn', e.target.value)} rows={2} placeholder="Step description..." className="text-sm resize-none" />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addStep} className="w-full">
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Tambah Step
              </Button>
            </div>

            {/* ── FAQ ── */}
            <SectionLabel>FAQ</SectionLabel>

            <div className="space-y-3">
              {form.faq.map((faqItem, i) => (
                <div key={i} className="border border-border rounded-xl p-4 space-y-3 bg-muted/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">FAQ {i + 1}</span>
                    <button type="button" onClick={() => removeFaq(i)}
                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <X className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Pertanyaan ID</Label>
                      <Input value={faqItem.qId} onChange={e => setFaqRow(i, 'qId', e.target.value)} placeholder="Pertanyaan..." className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Pertanyaan EN</Label>
                      <Input value={faqItem.qEn} onChange={e => setFaqRow(i, 'qEn', e.target.value)} placeholder="Question..." className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Jawaban ID</Label>
                      <Textarea value={faqItem.aId} onChange={e => setFaqRow(i, 'aId', e.target.value)} rows={2} placeholder="Jawaban..." className="text-sm resize-none" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Jawaban EN</Label>
                      <Textarea value={faqItem.aEn} onChange={e => setFaqRow(i, 'aEn', e.target.value)} rows={2} placeholder="Answer..." className="text-sm resize-none" />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFaq} className="w-full">
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Tambah FAQ
              </Button>
            </div>

          </div>

          {/* Footer */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={v => set('active', v)} />
              <Label className="text-sm cursor-pointer">{form.active ? 'Aktif' : 'Nonaktif'}</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button onClick={save} disabled={saving || !form.title || !form.slug}>
                {saving ? 'Menyimpan…' : 'Simpan'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
