'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Testimonial } from '@/lib/types/admin'
import { Pencil, Trash2, Eye, EyeOff, RefreshCw, Star, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState({ name: '', role: '', company: '', content: '', rating: 5, avatar_url: '', published: true })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openEdit(item: Testimonial) {
    setEditing(item)
    setForm({ name: item.name, role: item.role, company: item.company, content: item.content,
      rating: item.rating, avatar_url: item.avatar_url, published: item.published })
    setOpen(true)
  }

  function set(field: string, value: unknown) { setForm(prev => ({ ...prev, [field]: value })) }

  async function save() {
    if (!editing) return
    setSaving(true)
    await supabase.from('testimonials').update(form).eq('id', editing.id)
    setSaving(false); setOpen(false); fetchItems()
  }

  async function togglePublish(item: Testimonial) {
    await supabase.from('testimonials').update({ published: !item.published }).eq('id', item.id)
    fetchItems()
  }

  async function remove(id: string) {
    if (!confirm('Hapus testimoni ini?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    fetchItems()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Testimoni</h1>
          <p className="text-muted-foreground mt-1 text-sm">{items.length} testimoni</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/id/testimonials"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Halaman Submit Testimoni
          </a>
          <Button variant="outline" size="sm" onClick={fetchItems} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 p-8 text-center text-muted-foreground text-sm">Memuat...</div>
        ) : items.length === 0 ? (
          <div className="col-span-3 p-8 text-center text-muted-foreground text-sm">Belum ada testimoni.</div>
        ) : items.map(item => (
          <div key={item.id} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {item.avatar_url ? (
                  <img src={item.avatar_url} alt={item.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{[item.role, item.company].filter(Boolean).join(' · ')}</p>
                </div>
              </div>
              <Badge className={`ml-2 shrink-0 ${item.published ? 'bg-green-100 text-green-700 dark:bg-green-900/20' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20'}`}>
                {item.published ? 'Aktif' : 'Pending'}
              </Badge>
            </div>
            <div className="flex mb-3">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`h-3.5 w-3.5 ${s <= item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">"{item.content}"</p>
            <div className="flex items-center justify-end gap-1 pt-3 border-t border-border">
              <button onClick={() => togglePublish(item)} title={item.published ? 'Sembunyikan' : 'Tampilkan'} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                {item.published ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              </button>
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </button>
              <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="!w-full !max-w-lg p-0 flex flex-col">
          <SheetHeader className="px-6 pt-5 pb-4 border-b border-border shrink-0">
            <SheetTitle className="text-lg">Edit Testimoni</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Nama *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama klien" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Jabatan</Label>
                <Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="CEO, Manager, dll" />
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Perusahaan</Label>
                <Input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Nama perusahaan" />
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Testimoni *</Label>
              <Textarea value={form.content} onChange={e => set('content', e.target.value)} rows={5} placeholder="Isi testimoni..." className="resize-none" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-2 block">Rating</Label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => set('rating', s)} className="p-0.5">
                    <Star className={`h-6 w-6 transition-colors ${s <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground hover:text-yellow-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">URL Foto</Label>
              <Input value={form.avatar_url} onChange={e => set('avatar_url', e.target.value)} placeholder="https://..." />
              {form.avatar_url && (
                <img src={form.avatar_url} alt="preview" className="mt-2 w-12 h-12 rounded-full object-cover border border-border" />
              )}
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <Switch checked={form.published} onCheckedChange={v => set('published', v)} />
              <Label className="text-sm cursor-pointer">{form.published ? 'Ditampilkan' : 'Disembunyikan'}</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button onClick={save} disabled={saving || !form.name || !form.content}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
