'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget() {
  const t = useTranslations('chatbot')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('greeting') },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [quickShown, setQuickShown] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const sessionId = useRef<string>(crypto.randomUUID())

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setQuickShown(false)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })

      if (!res.ok) throw new Error('Failed')
      if (!res.body) throw new Error('No stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages((m) => [...m, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const json = JSON.parse(data)
            const delta = json.choices?.[0]?.delta?.content || ''
            assistantContent += delta
            setMessages((m) => {
              const updated = [...m]
              updated[updated.length - 1] = { role: 'assistant', content: assistantContent }
              return updated
            })
          } catch {}
        }
      }

      if (assistantContent) {
        const fullMessages = [...messages, userMsg, { role: 'assistant' as const, content: assistantContent }]
        fetch('/api/chat/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionId.current, messages: fullMessages }),
        }).catch(() => {})
      }
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: t('fallback') }])
    } finally {
      setLoading(false)
    }
  }

  const quickReplies = t.raw('quickReplies') as string[]

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9998, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
      {/* Chat panel */}
      {open && (
        <div
          className="fade-up"
          style={{
            width: 360,
            height: 520,
            background: 'var(--card)',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        >
          {/* Header */}
          <div style={{ background: '#0F1B2D', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#00C7B7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fa-solid fa-headset" style={{ color: 'white', fontSize: 18 }} aria-hidden="true" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-dmsans)' }}>{t('title')}</div>
              <div style={{ color: '#94A3B8', fontSize: 11 }}>{t('subtitle')}</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ color: '#94A3B8', cursor: 'pointer', fontSize: 18, background: 'none', border: 'none', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Close chat"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={bottomRef as any}
            className="thin-scroll"
            style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' ? '#00C7B7' : 'var(--muted)',
                    color: msg.role === 'user' ? 'white' : 'var(--foreground)',
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                    fontFamily: 'var(--font-dmsans)',
                  }}
                >
                  {msg.content || (msg.role === 'assistant' && loading && i === messages.length - 1 ? (
                    <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {[0, 1, 2].map((j) => (
                        <span
                          key={j}
                          className={`animate-dot-bounce-${j}`}
                          style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8', display: 'inline-block' }}
                        />
                      ))}
                    </span>
                  ) : msg.content)}
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.content === '' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 14px', background: 'var(--muted)', borderRadius: '18px 18px 18px 4px', width: 'fit-content' }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`animate-dot-bounce-${i}`}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8', display: 'block' }}
                  />
                ))}
              </div>
            )}

            {quickShown && messages.length === 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="transition-all hover:bg-primary hover:text-white hover:border-primary"
                    style={{
                      padding: '6px 12px',
                      border: '1px solid var(--border)',
                      borderRadius: 9999,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: '#00C7B7',
                      fontWeight: 500,
                      background: 'transparent',
                      fontFamily: 'var(--font-dmsans)',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder={t('placeholder')}
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: 9999,
                  border: '1px solid var(--border)',
                  background: 'var(--muted)',
                  color: 'var(--foreground)',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'var(--font-dmsans)',
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: input.trim() && !loading ? '#00C7B7' : '#94A3B8',
                  border: 'none',
                  color: 'white',
                  cursor: input.trim() && !loading ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.2s',
                }}
                aria-label="Send"
              >
                <i className="fa-solid fa-paper-plane" style={{ fontSize: 14 }} aria-hidden="true" />
              </button>
            </div>
            <div style={{ fontSize: 10, color: '#94A3B8', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <i className="fa-solid fa-lock" style={{ fontSize: 10 }} aria-hidden="true" />
              {t('disclaimer')}
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#00C7B7',
            boxShadow: 'var(--shadow-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1,
            border: 'none',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label={open ? 'Close chat' : 'Open chat'}
        >
          <i className={`fa-solid fa-${open ? 'xmark' : 'comment-dots'}`} style={{ color: 'white', fontSize: 22 }} aria-hidden="true" />
        </button>
        {!open && (
          <div
            className="animate-pulse-ring"
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #00C7B7', pointerEvents: 'none' }}
          />
        )}
      </div>
    </div>
  )
}
