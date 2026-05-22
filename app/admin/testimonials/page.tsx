'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Testimonial } from '@/lib/types/admin'
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const EMPTY: Omit<Testimonial, 'id' | 'created_at'> = {
  name: '', role: '', company: '', content: '', rating: 5, avatar_url: '', published: true,
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openNew() { setEditing(null); setForm({ ...EMPTY }); setOpen(true) }
  function openEdit(item: Testimonial) {
    setEditing(item)
    setForm({ name: item.name, role: item.role, company: item.company, content: item.content,
      rating: item.rating, avatar_url: item.avatar_url, published: item.published })
    setOpen(true)
  }
  function set(field: string, value: any) { setForm(prev => ({ ...prev, [field]: value })) }

  async function save() {
    setSaving(true)
    if (editing) {
      await supabase.from('testimonials').update(form).eq('id', editing.id)
    } else {
      await supabase.from('testimonials').insert(form)
    }
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
          <Button variant="outline" size="sm" onClick={fetchItems} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Tambah</Button>
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
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{[item.role, item.company].filter(Boolean).join(' · ')}</p>
              </div>
              <Badge className={item.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                {item.published ? 'Aktif' : 'Disembunyikan'}
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
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>{editing ? 'Edit Testimoni' : 'Tambah Testimoni'}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs mb-1">Nama *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama klien" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-1">Jabatan</Label>
                <Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="CEO, Manager, dll" />
              </div>
              <div>
                <Label className="text-xs mb-1">Perusahaan</Label>
                <Input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Nama perusahaan" />
              </div>
            </div>
            <div>
              <Label className="text-xs mb-1">Testimoni *</Label>
              <Textarea value={form.content} onChange={e => set('content', e.target.value)} rows={4} placeholder="Isi testimoni..." />
            </div>
            <div>
              <Label className="text-xs mb-2">Rating</Label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => set('rating', s)}>
                    <Star className={`h-6 w-6 ${s <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs mb-1">URL Foto</Label>
              <Input value={form.avatar_url} onChange={e => set('avatar_url', e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Switch checked={form.published} onCheckedChange={v => set('published', v)} />
                <Label className="text-sm">{form.published ? 'Ditampilkan' : 'Disembunyikan'}</Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                <Button onClick={save} disabled={saving || !form.name || !form.content}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
