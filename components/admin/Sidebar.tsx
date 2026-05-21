'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Briefcase, FolderOpen,
  Star, Mail, Users, Image, MessageSquare, Settings, LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { key: 'dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { key: 'blog', href: '/admin/blog', icon: FileText },
  { key: 'services', href: '/admin/services', icon: Briefcase },
  { key: 'portfolio', href: '/admin/portfolio', icon: FolderOpen },
  { key: 'testimonials', href: '/admin/testimonials', icon: Star },
  { key: 'messages', href: '/admin/messages', icon: Mail },
  { key: 'team', href: '/admin/team', icon: Users },
  { key: 'media', href: '/admin/media', icon: Image },
  { key: 'chatLogs', href: '/admin/chat-logs', icon: MessageSquare },
  { key: 'settings', href: '/admin/settings', icon: Settings },
] as const

export default function Sidebar() {
  const t = useTranslations('admin.sidebar')
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="px-6 py-5 border-b border-sidebar-border">
        <span className="font-bold text-lg text-primary">Teridox Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ key, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            )}
          >
            <Icon className="h-4 w-4" />
            {t(key as any)}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          {t('logout')}
        </button>
      </div>
    </aside>
  )
}
