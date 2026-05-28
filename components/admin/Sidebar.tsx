"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  FolderOpen,
  Star,
  Mail,
  Image,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const navItems = [
  { key: "dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { key: "blog", href: "/admin/blog", icon: FileText },
  { key: "services", href: "/admin/services", icon: Briefcase },
  { key: "portfolio", href: "/admin/portfolio", icon: FolderOpen },
  { key: "testimonials", href: "/admin/testimonials", icon: Star },
  { key: "messages", href: "/admin/messages", icon: Mail },
  { key: "media", href: "/admin/media", icon: Image },
  { key: "chatLogs", href: "/admin/chat-logs", icon: MessageSquare },
  { key: "settings", href: "/admin/settings", icon: Settings },
] as const;

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("admin.sidebar");
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <>
      <div className="px-6 py-5 border-b border-sidebar-border shrink-0">
        <span className="font-bold text-lg text-primary">Teridox Admin</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ key, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              pathname === href
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
            )}
          >
            <Icon className="h-4 w-4" />
            {t(key)}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-sidebar-border shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>
    </>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger — float top-left */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-xl bg-background border border-border shadow-sm hover:bg-muted transition-colors"
        aria-label="Buka menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 flex flex-col bg-sidebar border-sidebar-border">
          <div className="flex items-center justify-between px-6 py-5 border-b border-sidebar-border">
            <span className="font-bold text-lg text-primary">Teridox Admin</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <NavContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-sidebar border-r border-sidebar-border flex-col">
        <NavContent />
      </aside>
    </>
  );
}
