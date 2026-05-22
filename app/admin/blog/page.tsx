'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BlogPost } from '@/lib/types/admin'
import { Plus, Pencil, Trash2, Eye, EyeOff, Wand2, RefreshCw, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const EMPTY: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = {
  title: '', title_en: '', slug: '', content: '', content_en: '',
  meta_title: '', meta_description: '', tags: [], reading_time_min: 5,
  published: false, category: 'teknologi',
}

const CATEGORIES = ['teknologi', 'bisnis', 'tutorial', 'berita', 'lainnya']

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [tagsInput, setTagsInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const supabase = createClient()

  const loadPosts = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setPosts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadPosts() }, [loadPosts])

  function openNew() {
    setEditing(null)
    setForm({ ...EMPTY })
    setTagsInput('')
    setAiTopic('')
    setOpen(true)
  }

  function openEdit(post: BlogPost) {
    setEditing(post)
    setForm({
      title: post.title, title_en: post.title_en, slug: post.slug,
      content: post.content, content_en: post.content_en,
      meta_title: post.meta_title, meta_description: post.meta_description,
      tags: post.tags ?? [], reading_time_min: post.reading_time_min,
      published: post.published, category: post.category,
    })
    setTagsInput((post.tags ?? []).join(', '))
    setOpen(true)
  }

  function set(field: string, value: any) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !editing) next.slug = slugify(value)
      return next
    })
  }

  async function generate() {
    if (!aiTopic.trim()) return
    setGenerating(true)
    try {
      const res = await fetch(`/api/blog-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic, language: 'id', length: 'medium', tone: 'informative' }),
      })
      const data = await res.json()
      if (data.title) {
        setForm(prev => ({
          ...prev,
          title: data.title ?? prev.title,
          title_en: data.titleEn ?? prev.title_en,
          slug: slugify(data.title ?? prev.title),
          content: data.content ?? prev.content,
          content_en: data.contentEn ?? prev.content_en,
          meta_title: data.metaTitle ?? prev.meta_title,
          meta_description: data.metaDescription ?? prev.meta_description,
          tags: data.tags ?? prev.tags,
          reading_time_min: data.readingTimeMin ?? prev.reading_time_min,
        }))
        setTagsInput((data.tags ?? []).join(', '))
      }
    } catch {}
    setGenerating(false)
  }

  async function save() {
    setSaving(true)
    const payload = { ...form, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) }
    if (editing) {
      await supabase.from('blog_posts').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('blog_posts').insert(payload)
    }
    setSaving(false)
    setOpen(false)
    loadPosts()
  }

  async function togglePublish(post: BlogPost) {
    await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id)
    loadPosts()
  }

  async function remove(id: string) {
    if (!confirm('Hapus artikel ini?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    loadPosts()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-muted-foreground mt-1 text-sm">{posts.length} artikel</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadPosts} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-2" /> Artikel Baru
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Memuat...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Belum ada artikel. Buat artikel pertama!</div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Judul</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Kategori</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Dibuat</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs capitalize">{post.category}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={post.published ? 'bg-green-100 text-green-700 dark:bg-green-900/20' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => togglePublish(post)} title={post.published ? 'Jadikan Draft' : 'Publish'} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        {post.published ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </button>
                      <button onClick={() => openEdit(post)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => remove(post.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>{editing ? 'Edit Artikel' : 'Artikel Baru'}</SheetTitle>
          </SheetHeader>

          {/* AI Generation */}
          {!editing && (
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" /> Generate dengan AI
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Topik artikel (mis: tips memilih software ERP)"
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  className="text-sm"
                />
                <Button size="sm" onClick={generate} disabled={generating || !aiTopic.trim()}>
                  {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Generate'}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-1">Judul (ID) *</Label>
                <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Judul artikel" />
              </div>
              <div>
                <Label className="text-xs mb-1">Judul (EN)</Label>
                <Input value={form.title_en} onChange={e => set('title_en', e.target.value)} placeholder="Article title" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-1">Slug *</Label>
                <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="url-artikel" />
              </div>
              <div>
                <Label className="text-xs mb-1">Kategori</Label>
                <select
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs mb-1">Konten (ID)</Label>
              <Textarea value={form.content} onChange={e => set('content', e.target.value)} rows={8} placeholder="Tulis konten artikel dalam Bahasa Indonesia..." className="text-sm font-mono" />
            </div>

            <div>
              <Label className="text-xs mb-1">Konten (EN)</Label>
              <Textarea value={form.content_en} onChange={e => set('content_en', e.target.value)} rows={8} placeholder="Write article content in English..." className="text-sm font-mono" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-1">Meta Title</Label>
                <Input value={form.meta_title} onChange={e => set('meta_title', e.target.value)} placeholder="SEO title" />
              </div>
              <div>
                <Label className="text-xs mb-1">Waktu Baca (menit)</Label>
                <Input type="number" value={form.reading_time_min} onChange={e => set('reading_time_min', parseInt(e.target.value))} min={1} />
              </div>
            </div>

            <div>
              <Label className="text-xs mb-1">Meta Description</Label>
              <Textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)} rows={2} placeholder="Deskripsi SEO" />
            </div>

            <div>
              <Label className="text-xs mb-1 flex items-center gap-1"><Tag className="h-3 w-3" /> Tags (pisahkan dengan koma)</Label>
              <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="next.js, react, tutorial" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Switch checked={form.published} onCheckedChange={v => set('published', v)} />
                <Label className="text-sm">{form.published ? 'Published' : 'Draft'}</Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                <Button onClick={save} disabled={saving || !form.title || !form.slug}>
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
