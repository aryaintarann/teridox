'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Trash2, Copy, RefreshCw, Check, Search, ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const BUCKET = 'blog-images'

interface MediaFile {
  name: string
  size: number
  created_at: string
  publicUrl: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [preview, setPreview] = useState<MediaFile | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const loadFiles = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.storage.from(BUCKET).list('', {
      sortBy: { column: 'created_at', order: 'desc' },
      limit: 200,
    })
    if (error || !data) { setLoading(false); return }

    const mapped: MediaFile[] = data
      .filter(f => f.name !== '.emptyFolderPlaceholder')
      .map(f => ({
        name: f.name,
        size: f.metadata?.size ?? 0,
        created_at: f.created_at ?? '',
        publicUrl: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      }))
    setFiles(mapped)
    setLoading(false)
  }, [])

  useEffect(() => { loadFiles() }, [loadFiles])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return
    setUploading(true)
    for (const file of Array.from(fileList)) {
      const ext = file.name.split('.').pop()
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      await supabase.storage.from(BUCKET).upload(uniqueName, file, { contentType: file.type })
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    loadFiles()
  }

  async function handleDelete(file: MediaFile) {
    if (!confirm(`Hapus "${file.name}"?`)) return
    setDeleting(file.name)
    await supabase.storage.from(BUCKET).remove([file.name])
    setDeleting(null)
    if (preview?.name === file.name) setPreview(null)
    loadFiles()
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Media</h1>
          <p className="text-muted-foreground mt-1 text-sm">{files.length} file di bucket <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{BUCKET}</code></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadFiles} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading
              ? <><RefreshCw className="h-4 w-4 animate-spin mr-2" /> Mengupload...</>
              : <><Upload className="h-4 w-4 mr-2" /> Upload Gambar</>
            }
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama file..."
          className="pl-9"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-sm">{search ? 'Tidak ada file yang cocok.' : 'Belum ada gambar. Upload gambar pertama!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(file => (
            <div
              key={file.name}
              onClick={() => setPreview(file)}
              className="group relative aspect-square rounded-xl overflow-hidden border border-border cursor-pointer hover:border-primary transition-colors bg-muted"
            >
              <img
                src={file.publicUrl}
                alt={file.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <button
                  onClick={e => { e.stopPropagation(); copyUrl(file.publicUrl) }}
                  className="flex items-center gap-1.5 text-xs text-white bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 transition-colors"
                >
                  {copied === file.publicUrl
                    ? <><Check className="h-3 w-3" /> Tersalin!</>
                    : <><Copy className="h-3 w-3" /> Salin URL</>
                  }
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(file) }}
                  disabled={deleting === file.name}
                  className="flex items-center gap-1.5 text-xs text-white bg-red-500/70 hover:bg-red-500 rounded-lg px-3 py-1.5 transition-colors"
                >
                  {deleting === file.name
                    ? <RefreshCw className="h-3 w-3 animate-spin" />
                    : <><Trash2 className="h-3 w-3" /> Hapus</>
                  }
                </button>
              </div>
              {/* Filename badge */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-white truncate">{formatSize(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-card rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <p className="text-sm font-medium truncate max-w-xs">{preview.name}</p>
              <button onClick={() => setPreview(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <img src={preview.publicUrl} alt={preview.name} className="w-full max-h-[60vh] object-contain bg-muted/30" />
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatSize(preview.size)}</span>
                <span>·</span>
                <span>{preview.created_at ? new Date(preview.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Input value={preview.publicUrl} readOnly className="text-xs font-mono" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyUrl(preview.publicUrl)}
                  className="shrink-0 gap-1.5"
                >
                  {copied === preview.publicUrl ? <><Check className="h-4 w-4" /> Tersalin</> : <><Copy className="h-4 w-4" /> Salin</>}
                </Button>
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(preview)}
                  disabled={deleting === preview.name}
                  className="gap-1.5"
                >
                  <Trash2 className="h-4 w-4" /> Hapus File
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
