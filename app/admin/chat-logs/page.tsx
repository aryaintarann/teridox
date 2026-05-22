'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RefreshCw, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ChatSession {
  id: string
  ip: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  created_at: string
}

export default function ChatLogsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const { data } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      setSessions(data ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Chat Logs</h1>
          <p className="text-muted-foreground mt-1 text-sm">{sessions.length} sesi percakapan</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">Memuat...</div>
      ) : sessions.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground text-sm">Belum ada log percakapan.</p>
          <p className="text-xs text-muted-foreground mt-1">Log akan muncul setelah tabel chat_sessions dibuat di Supabase.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => {
            const msgs = Array.isArray(session.messages) ? session.messages : []
            const isOpen = expanded === session.id
            return (
              <div key={session.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : session.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div className="text-left">
                      <p className="text-sm font-medium">IP: {session.ip || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">{msgs.length} pesan</Badge>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>

                {isOpen && (
                  <div className="border-t border-border p-4 space-y-3 max-h-80 overflow-y-auto bg-muted/10">
                    {msgs.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
