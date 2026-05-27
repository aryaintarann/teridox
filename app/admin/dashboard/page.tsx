'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText, Mail, FolderOpen, MessageSquare, TrendingUp, Users, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  blogs: number
  messages: number
  unreadMessages: number
  portfolio: number
  testimonials: number
}

interface RecentPost { id: string; title: string; published: boolean; created_at: string }
interface RecentMsg { id: string; name: string; service: string; created_at: string; read: boolean }

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ blogs: 0, messages: 0, unreadMessages: 0, portfolio: 0, testimonials: 0 })
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [recentMsgs, setRecentMsgs] = useState<RecentMsg[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadDashboard() }, [])

  async function loadDashboard() {
    setLoading(true)
    const [
      { count: blogs },
      { count: messages },
      { count: unread },
      { count: portfolio },
      { count: testimonials },
      { data: posts },
      { data: msgs },
    ] = await Promise.all([
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('read', false),
      supabase.from('portfolio_items').select('*', { count: 'exact', head: true }),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id,title,published,created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('contact_messages').select('id,name,service,created_at,read').order('created_at', { ascending: false }).limit(5),
    ])
    setStats({ blogs: blogs ?? 0, messages: messages ?? 0, unreadMessages: unread ?? 0, portfolio: portfolio ?? 0, testimonials: testimonials ?? 0 })
    setRecentPosts(posts ?? [])
    setRecentMsgs(msgs ?? [])
    setLoading(false)
  }

  const statCards = [
    { label: 'Total Artikel', value: stats.blogs, icon: FileText, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30', href: '/admin/blog' },
    { label: 'Pesan Masuk', value: stats.messages, icon: Mail, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30', badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} baru` : null, href: '/admin/messages' },
    { label: 'Portfolio', value: stats.portfolio, icon: FolderOpen, color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30', href: '/admin/portfolio' },
    { label: 'Testimoni', value: stats.testimonials, icon: MessageSquare, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30', href: '/admin/testimonials' },
  ]

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const m = Math.floor(diff / 60000)
    const h = Math.floor(m / 60)
    const d = Math.floor(h / 24)
    if (d > 0) return `${d} hari lalu`
    if (h > 0) return `${h} jam lalu`
    return `${m} menit lalu`
  }

  return (
    <div className="p-4 sm:p-8 pt-14 lg:pt-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Selamat datang kembali di Teridox Admin</p>
        </div>
        <button onClick={loadDashboard} disabled={loading} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, badge, href }) => (
          <Link key={label} href={href} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/30 transition-colors block">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              {badge && (
                <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 px-2.5 py-1 rounded-full font-medium">
                  {badge}
                </span>
              )}
            </div>
            <div className="text-3xl font-bold mb-1">{loading ? '—' : value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Artikel Terbaru
          </h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat...</p>
          ) : recentPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada artikel.</p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map(post => (
                <div key={post.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ml-3 flex-shrink-0 ${
                    post.published ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/blog" className="inline-block mt-4 text-xs text-primary hover:underline">
            Lihat semua artikel →
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Pesan Terbaru
          </h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat...</p>
          ) : recentMsgs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada pesan masuk.</p>
          ) : (
            <div className="space-y-3">
              {recentMsgs.map(msg => (
                <div key={msg.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                    {msg.name?.charAt(0) ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${!msg.read ? 'font-semibold' : ''}`}>{msg.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.service || 'Tidak ada layanan'}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(msg.created_at)}</span>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/messages" className="inline-block mt-4 text-xs text-primary hover:underline">
            Lihat semua pesan →
          </Link>
        </div>
      </div>
    </div>
  )
}
