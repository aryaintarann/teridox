'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PortfolioItem } from '@/lib/types/admin'
import { Plus, Pencil, Trash2, Star, StarOff, RefreshCw, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const EMPTY: Omit<PortfolioItem, 'id' | 'created_at'> = {
  title: '', slug: '', description: '', challenge: '', solution: '',
  outcome: '', technologies: [], image_url: '', project_url: '', category: 'web', featured: false,
}

const CATEGORIES = ['web', 'mobile', 'software']

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('portfolio_items').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openNew() {
    setEditing(null); setForm({ ...EMPTY }); setTechInput(''); setOpen(true)
  }

  function openEdit(item: PortfolioItem) {
    setEditing(item)
    setForm({ title: item.title, slug: item.slug, description: item.description, challenge: item.challenge,
      solution: item.solution, outcome: item.outcome, technologies: item.technologies ?? [],
      image_url: item.image_url, project_url: item.project_url, category: item.category, featured: item.featured })
    setTechInput((item.technologies ?? []).join(', '))
    setOpen(true)
  }

  function set(field: string, value: any) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !editing) next.slug = slugify(value)
      return next
    })
  }

  async function uploadImage(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const json = await res.json()
    if (json.publicUrl) set('image_url', json.publicUrl)
    setUploading(false)
  }

  async function save() {
    setSaving(true)
    const payload = { ...form, technologies: techInput.split(',').map(t => t.trim()).filter(Boolean) }
    if (editing) {
      await supabase.from('portfolio_items').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('portfolio_items').insert(payload)
    }
    setSaving(false); setOpen(false); fetchItems()
  }

  async function toggleFeatured(item: PortfolioItem) {
    await supabase.from('portfolio_items').update({ featured: !item.featured }).eq('id', item.id)
    fetchItems()
  }

  async function remove(id: string) {
    if (!confirm('Hapus item portfolio ini?')) return
    await supabase.from('portfolio_items').delete().eq('id', id)
    fetchItems()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground mt-1 text-sm">{items.length} proyek</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchItems} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Proyek Baru</Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Memuat...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Belum ada proyek. Tambahkan proyek pertama!</div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Proyek</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Kategori</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Teknologi</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Featured</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs uppercase">{item.category}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(item.technologies ?? []).slice(0, 3).map(t => (
                        <span key={t} className="text-xs bg-muted px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                      {(item.technologies ?? []).length > 3 && (
                        <span className="text-xs text-muted-foreground">+{item.technologies.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(item)}>
                      {item.featured
                        ? <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        : <StarOff className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="!w-full !max-w-2xl p-0 flex flex-col">
          <SheetHeader className="px-6 pt-5 pb-4 border-b border-border shrink-0">
            <SheetTitle className="text-lg">{editing ? 'Edit Proyek' : 'Proyek Baru'}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Judul *</Label>
                <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Nama proyek" />
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Slug *</Label>
                <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="url-proyek" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Kategori</Label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c} className="uppercase">{c}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">URL Proyek</Label>
                <Input value={form.project_url} onChange={e => set('project_url', e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Gambar Proyek</Label>
              {form.image_url ? (
                <div className="relative mt-1">
                  <img src={form.image_url} alt="preview" className="h-36 w-full object-cover rounded-lg border border-border" />
                  <button
                    type="button"
                    onClick={() => set('image_url', '')}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center gap-2 h-36 w-full rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                  {uploading ? (
                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Klik untuk upload gambar</span>
                      <span className="text-xs text-muted-foreground/60">JPG, PNG, WebP</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f) }}
                  />
                </label>
              )}
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Deskripsi</Label>
              <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Deskripsi singkat proyek" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Tantangan</Label>
              <Textarea value={form.challenge} onChange={e => set('challenge', e.target.value)} rows={2} placeholder="Tantangan yang dihadapi" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Solusi</Label>
              <Textarea value={form.solution} onChange={e => set('solution', e.target.value)} rows={2} placeholder="Solusi yang diterapkan" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Hasil</Label>
              <Textarea value={form.outcome} onChange={e => set('outcome', e.target.value)} rows={2} placeholder="Hasil yang dicapai" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Teknologi (pisahkan dengan koma)</Label>
              <Input value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="Next.js, React Native, Supabase" />
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <Switch checked={form.featured} onCheckedChange={v => set('featured', v)} />
              <Label className="text-sm">Tampilkan sebagai Featured</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button onClick={save} disabled={saving || uploading || !form.title || !form.slug}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
