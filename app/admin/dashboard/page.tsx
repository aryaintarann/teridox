import { FileText, Mail, FolderOpen, MessageSquare, TrendingUp, Users } from 'lucide-react'

const stats = [
  { label: 'Total Artikel', value: '24', icon: FileText, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  { label: 'Pesan Masuk', value: '12', icon: Mail, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30', badge: '3 baru' },
  { label: 'Portfolio', value: '18', icon: FolderOpen, color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30' },
  { label: 'Sesi Chat', value: '89', icon: MessageSquare, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30', suffix: '7 hari' },
]

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Selamat datang kembali di Teridox Admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map(({ label, value, icon: Icon, color, badge, suffix }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
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
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
            {suffix && <div className="text-xs text-muted-foreground mt-0.5">{suffix}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Artikel Terbaru
          </h2>
          <div className="space-y-3">
            {['Cara Memilih Tech Stack SaaS', 'Flutter vs React Native 2025', 'Next.js 15 Fitur Terbaru'].map((title) => (
              <div key={title} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{title}</span>
                <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 px-2.5 py-1 rounded-full">Published</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Pesan Terbaru
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Budi Santoso', subject: 'Request Web Development', time: '2 jam lalu' },
              { name: 'Rina Dewi', subject: 'Tanya Mobile App', time: '5 jam lalu' },
              { name: 'Ahmad Fauzi', subject: 'Konsultasi SaaS Platform', time: '1 hari lalu' },
            ].map((msg) => (
              <div key={msg.name} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                  {msg.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{msg.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{msg.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
