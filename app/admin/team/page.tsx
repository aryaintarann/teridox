'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TeamMember } from '@/lib/types/admin'
import { Plus, Pencil, Trash2, RefreshCw, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const EMPTY: Omit<TeamMember, 'id' | 'created_at'> = {
  name: '', role: '', bio: '', avatar_url: '', linkedin_url: '', display_order: 0, active: true,
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('team_members').select('*').order('display_order')
    setMembers(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  function openNew() { setEditing(null); setForm({ ...EMPTY }); setOpen(true) }
  function openEdit(m: TeamMember) {
    setEditing(m)
    setForm({ name: m.name, role: m.role, bio: m.bio, avatar_url: m.avatar_url,
      linkedin_url: m.linkedin_url, display_order: m.display_order, active: m.active })
    setOpen(true)
  }
  function set(field: string, value: any) { setForm(prev => ({ ...prev, [field]: value })) }

  async function save() {
    setSaving(true)
    if (editing) {
      await supabase.from('team_members').update(form).eq('id', editing.id)
    } else {
      await supabase.from('team_members').insert(form)
    }
    setSaving(false); setOpen(false); fetchMembers()
  }

  async function toggleActive(m: TeamMember) {
    await supabase.from('team_members').update({ active: !m.active }).eq('id', m.id)
    fetchMembers()
  }

  async function remove(id: string) {
    if (!confirm('Hapus anggota tim ini?')) return
    await supabase.from('team_members').delete().eq('id', id)
    fetchMembers()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tim</h1>
          <p className="text-muted-foreground mt-1 text-sm">{members.length} anggota</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchMembers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Tambah</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-4 p-8 text-center text-muted-foreground text-sm">Memuat...</div>
        ) : members.length === 0 ? (
          <div className="col-span-4 p-8 text-center text-muted-foreground text-sm">Belum ada anggota tim.</div>
        ) : members.map(m => (
          <div key={m.id} className="bg-card border border-border rounded-2xl p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 overflow-hidden">
              {m.avatar_url
                ? <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-primary">{m.name.charAt(0)}</span>}
            </div>
            <p className="font-semibold text-sm">{m.name}</p>
            <p className="text-xs text-muted-foreground mb-2">{m.role}</p>
            <Badge className={m.active ? 'bg-green-100 text-green-700 mb-3' : 'bg-gray-100 text-gray-500 mb-3'}>
              {m.active ? 'Aktif' : 'Nonaktif'}
            </Badge>
            {m.linkedin_url && (
              <div className="mb-3">
                <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <Linkedin className="h-3 w-3" /> LinkedIn
                </a>
              </div>
            )}
            <div className="flex items-center justify-center gap-1 pt-3 border-t border-border">
              <button onClick={() => toggleActive(m)} title={m.active ? 'Nonaktifkan' : 'Aktifkan'}
                className="px-2 py-1 text-xs rounded hover:bg-muted transition-colors text-muted-foreground">
                {m.active ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
              <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button onClick={() => remove(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>{editing ? 'Edit Anggota' : 'Anggota Baru'}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs mb-1">Nama *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama lengkap" />
            </div>
            <div>
              <Label className="text-xs mb-1">Jabatan *</Label>
              <Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="Full Stack Developer, Designer, dll" />
            </div>
            <div>
              <Label className="text-xs mb-1">Bio</Label>
              <Textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} placeholder="Deskripsi singkat" />
            </div>
            <div>
              <Label className="text-xs mb-1">URL Foto</Label>
              <Input value={form.avatar_url} onChange={e => set('avatar_url', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <Label className="text-xs mb-1">URL LinkedIn</Label>
              <Input value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <Label className="text-xs mb-1">Urutan Tampil</Label>
              <Input type="number" value={form.display_order} onChange={e => set('display_order', parseInt(e.target.value) || 0)} min={0} />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Switch checked={form.active} onCheckedChange={v => set('active', v)} />
                <Label className="text-sm">{form.active ? 'Aktif' : 'Nonaktif'}</Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                <Button onClick={save} disabled={saving || !form.name || !form.role}>
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
