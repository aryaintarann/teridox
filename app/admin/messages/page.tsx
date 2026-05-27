'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ContactMessage } from '@/lib/types/admin'
import { Mail, MailOpen, Trash2, RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const supabase = createClient()

  useEffect(() => { fetch() }, [])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data ?? [])
    setLoading(false)
  }

  async function markRead(msg: ContactMessage) {
    await supabase.from('contact_messages').update({ read: true }).eq('id', msg.id)
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
    setSelected({ ...msg, read: true })
  }

  async function remove(id: string) {
    if (!confirm('Hapus pesan ini?')) return
    await supabase.from('contact_messages').delete().eq('id', id)
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const filtered = messages.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.service?.toLowerCase().includes(search.toLowerCase())
  )
  const unread = messages.filter(m => !m.read).length

  return (
    <div className="p-4 sm:p-8 pt-14 lg:pt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Pesan Masuk
            {unread > 0 && <Badge className="bg-red-500 text-white">{unread} baru</Badge>}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{messages.length} total pesan</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetch} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* List */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pesan..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">Memuat...</div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">Tidak ada pesan</div>
            ) : filtered.map(msg => (
              <button
                key={msg.id}
                onClick={() => { setSelected(msg); if (!msg.read) markRead(msg) }}
                className={`w-full text-left p-4 border-b border-border transition-colors hover:bg-muted/50 ${selected?.id === msg.id ? 'bg-muted' : ''}`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {msg.read
                      ? <MailOpen className="h-4 w-4 text-muted-foreground" />
                      : <Mail className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${!msg.read ? 'font-semibold' : ''}`}>{msg.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.service || msg.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {msg.created_at ? new Date(msg.created_at).toLocaleDateString('id-ID') : '—'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 overflow-y-auto">
          {!selected ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Pilih pesan untuk membacanya</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground">{selected.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => remove(selected.id)}
                  className="text-red-500 hover:text-red-600 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Email', value: selected.email },
                  { label: 'Telepon', value: selected.phone || '—' },
                  { label: 'Layanan', value: selected.service || '—' },
                  { label: 'Bahasa', value: selected.locale?.toUpperCase() || '—' },
                  { label: 'Diterima', value: selected.created_at ? new Date(selected.created_at).toLocaleString('id-ID') : '—' },
                  { label: 'Status', value: selected.read ? 'Sudah dibaca' : 'Belum dibaca' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/50 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Pesan</p>
                <div className="bg-muted/50 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <a
                  href={`mailto:${selected.email}`}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" /> Balas via Email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
