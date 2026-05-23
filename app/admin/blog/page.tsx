'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BlogPost } from '@/lib/types/admin'
import { Plus, Pencil, Trash2, Eye, EyeOff, Wand2, RefreshCw, Tag, Upload, Sparkles, X, ImageIcon, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const EMPTY: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = {
  title: '', title_en: '', slug: '', content: '', content_en: '',
  cover_image_url: '',
  meta_title: '', meta_description: '', tags: [],
  faq: [], faq_en: [],
  reading_time_min: 5, published: false, category: 'teknologi',
}

type FaqRow = { q: string; qEn: string; a: string; aEn: string }

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
  const [uploading, setUploading] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [showImagePrompt, setShowImagePrompt] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  const [faqRows, setFaqRows] = useState<FaqRow[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
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
    setShowImagePrompt(false)
    setImagePrompt('')
    setFaqRows([])
    setOpen(true)
  }

  function openEdit(post: BlogPost) {
    setEditing(post)
    setForm({
      title: post.title, title_en: post.title_en, slug: post.slug,
      content: post.content, content_en: post.content_en,
      cover_image_url: post.cover_image_url ?? '',
      meta_title: post.meta_title, meta_description: post.meta_description,
      tags: post.tags ?? [], faq: post.faq ?? [], faq_en: post.faq_en ?? [],
      reading_time_min: post.reading_time_min,
      published: post.published, category: post.category,
    })
    setTagsInput((post.tags ?? []).join(', '))
    setShowImagePrompt(false)
    setImagePrompt('')
    // Zip ID + EN FAQ into rows
    const idFaq = post.faq ?? []
    const enFaq = post.faq_en ?? []
    const max = Math.max(idFaq.length, enFaq.length)
    setFaqRows(Array.from({ length: max }, (_, i) => ({
      q: idFaq[i]?.q ?? '', qEn: enFaq[i]?.q ?? '',
      a: idFaq[i]?.a ?? '', aEn: enFaq[i]?.a ?? '',
    })))
    setOpen(true)
  }

  function set(field: string, value: unknown) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !editing) next.slug = slugify(value as string)
      return next
    })
  }

  async function generate() {
    if (!aiTopic.trim()) return
    setGenerating(true)
    try {
      const res = await fetch('/api/blog-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic, language: 'id', length: 'medium', tone: 'informative' }),
      })
      const data = await res.json()
      const id = data.original
      const en = data.translated
      if (id?.title) {
        setForm(prev => ({
          ...prev,
          title: id.title ?? prev.title,
          title_en: en?.title ?? prev.title_en,
          slug: slugify(id.title ?? prev.title),
          content: id.content ?? prev.content,
          content_en: en?.content ?? prev.content_en,
          meta_title: id.metaTitle ?? prev.meta_title,
          meta_description: id.metaDescription ?? prev.meta_description,
          tags: id.tags ?? prev.tags,
          reading_time_min: id.readingTimeMin ?? prev.reading_time_min,
        }))
        setTagsInput((id.tags ?? []).join(', '))
      }
    } catch {}
    setGenerating(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/blog/upload-image', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) set('cover_image_url', data.url)
      else alert(data.error ?? 'Upload gagal')
    } catch {
      alert('Upload gagal')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function generateImage() {
    setGeneratingImage(true)
    try {
      const res = await fetch('/api/blog/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, articleTitle: form.title }),
      })
      const data = await res.json()
      if (data.url) {
        set('cover_image_url', data.url)
        setShowImagePrompt(false)
      } else {
        alert(data.error ?? 'Generate gambar gagal')
      }
    } catch {
      alert('Generate gambar gagal')
    }
    setGeneratingImage(false)
  }

  async function save() {
    setSaving(true)
    const payload = {
      ...form,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      faq:    faqRows.filter(r => r.q && r.a).map(r => ({ q: r.q, a: r.a })),
      faq_en: faqRows.filter(r => r.qEn && r.aEn).map(r => ({ q: r.qEn, a: r.aEn })),
    }
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
                    <div className="flex items-center gap-3">
                      {post.cover_image_url ? (
                        <img src={post.cover_image_url} alt={post.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{post.title}</p>
                        <p className="text-xs text-muted-foreground">{post.slug}</p>
                      </div>
                    </div>
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
        <SheetContent side="right" className="!w-full !max-w-2xl p-0 flex flex-col">
          <SheetHeader className="px-6 pt-5 pb-4 border-b border-border shrink-0">
            <SheetTitle className="text-lg">{editing ? 'Edit Artikel' : 'Artikel Baru'}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* AI Content Generation */}
            {!editing && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-primary" /> Generate Konten dengan AI
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Topik artikel (mis: tips memilih software ERP)"
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && generate()}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={generate} disabled={generating || !aiTopic.trim()} className="shrink-0">
                    {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Generate'}
                  </Button>
                </div>
                {generating && (
                  <p className="text-xs text-muted-foreground mt-2 animate-pulse">Sedang membuat artikel, harap tunggu…</p>
                )}
              </div>
            )}

            {/* Cover Image */}
            <div className="space-y-3">
              <Label className="text-xs font-medium flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> Cover Image
              </Label>

              {form.cover_image_url ? (
                <div className="relative rounded-xl overflow-hidden border border-border">
                  <img
                    src={form.cover_image_url}
                    alt="Cover artikel"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => set('cover_image_url', '')}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-xl h-40 flex flex-col items-center justify-center gap-2 bg-muted/20">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Belum ada cover image</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || generatingImage}
                  className="flex-1"
                >
                  {uploading
                    ? <><RefreshCw className="h-4 w-4 animate-spin mr-1.5" /> Mengupload...</>
                    : <><Upload className="h-4 w-4 mr-1.5" /> Upload Foto</>
                  }
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImagePrompt(v => !v)}
                  disabled={uploading || generatingImage}
                  className="flex-1"
                >
                  <Sparkles className="h-4 w-4 mr-1.5" /> Generate AI
                </Button>
              </div>

              {showImagePrompt && (
                <div className="p-3 bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/40 rounded-xl space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Biarkan kosong untuk auto-generate dari judul artikel
                  </p>
                  <Input
                    placeholder={`Prompt gambar (mis: "teknologi AI, biru, minimalis, modern")`}
                    value={imagePrompt}
                    onChange={e => setImagePrompt(e.target.value)}
                    className="text-sm"
                    onKeyDown={e => e.key === 'Enter' && generateImage()}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={generateImage}
                    disabled={generatingImage}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    {generatingImage
                      ? <><RefreshCw className="h-4 w-4 animate-spin mr-2" /> Generating gambar…</>
                      : <><Sparkles className="h-4 w-4 mr-2" /> Generate Gambar dengan AI</>
                    }
                  </Button>
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Atau masukkan URL gambar</Label>
                <Input
                  value={form.cover_image_url}
                  onChange={e => set('cover_image_url', e.target.value)}
                  placeholder="https://..."
                  className="text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Judul (ID) *</Label>
                <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Judul artikel" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Judul (EN)</Label>
                <Input value={form.title_en} onChange={e => set('title_en', e.target.value)} placeholder="Article title" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Slug *</Label>
                <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="url-artikel" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Kategori</Label>
                <select
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Konten (ID)</Label>
              <Textarea value={form.content} onChange={e => set('content', e.target.value)} rows={10} placeholder="Tulis konten artikel dalam Bahasa Indonesia (markdown didukung)..." className="text-sm font-mono resize-y" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Konten (EN)</Label>
              <Textarea value={form.content_en} onChange={e => set('content_en', e.target.value)} rows={10} placeholder="Write article content in English (markdown supported)..." className="text-sm font-mono resize-y" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Meta Title <span className="text-muted-foreground font-normal">(maks. 60 karakter)</span></Label>
                <Input
                  value={form.meta_title}
                  onChange={e => set('meta_title', e.target.value)}
                  placeholder="SEO title"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground text-right">{form.meta_title.length}/60</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Waktu Baca (menit)</Label>
                <Input type="number" value={form.reading_time_min} onChange={e => set('reading_time_min', parseInt(e.target.value))} min={1} max={60} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Meta Description <span className="text-muted-foreground font-normal">(maks. 160 karakter)</span></Label>
              <Textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)} rows={2} placeholder="Deskripsi SEO" className="resize-none" maxLength={160} />
              <p className="text-xs text-muted-foreground text-right">{form.meta_description.length}/160</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1"><Tag className="h-3 w-3" /> Tags (pisahkan dengan koma)</Label>
              <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="next.js, react, tutorial" />
            </div>

            {/* FAQ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" /> FAQ
                </Label>
                <Button
                  type="button" variant="outline" size="sm"
                  onClick={() => setFaqRows(r => [...r, { q: '', qEn: '', a: '', aEn: '' }])}
                  className="h-7 text-xs px-2"
                >
                  <Plus className="h-3 w-3 mr-1" /> Tambah
                </Button>
              </div>
              {faqRows.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-3 border border-dashed border-border rounded-lg">
                  Belum ada FAQ. Klik Tambah untuk menambahkan.
                </p>
              )}
              {faqRows.map((row, i) => (
                <div key={i} className="p-4 border border-border rounded-xl space-y-3 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">FAQ #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => setFaqRows(r => r.filter((_, j) => j !== i))}
                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Pertanyaan (ID)</Label>
                      <Input
                        value={row.q}
                        onChange={e => setFaqRows(r => r.map((x, j) => j === i ? { ...x, q: e.target.value } : x))}
                        placeholder="Pertanyaan dalam Bahasa Indonesia"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Question (EN)</Label>
                      <Input
                        value={row.qEn}
                        onChange={e => setFaqRows(r => r.map((x, j) => j === i ? { ...x, qEn: e.target.value } : x))}
                        placeholder="Question in English"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Jawaban (ID)</Label>
                      <Textarea
                        value={row.a}
                        onChange={e => setFaqRows(r => r.map((x, j) => j === i ? { ...x, a: e.target.value } : x))}
                        placeholder="Jawaban dalam Bahasa Indonesia"
                        rows={2}
                        className="text-sm resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Answer (EN)</Label>
                      <Textarea
                        value={row.aEn}
                        onChange={e => setFaqRows(r => r.map((x, j) => j === i ? { ...x, aEn: e.target.value } : x))}
                        placeholder="Answer in English"
                        rows={2}
                        className="text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <Switch checked={form.published} onCheckedChange={v => set('published', v)} />
              <Label className="text-sm cursor-pointer">{form.published ? 'Published' : 'Draft'}</Label>
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
