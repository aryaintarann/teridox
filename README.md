# Teridox — Company Profile Website

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)

Website company profile modern dan full-stack untuk **Teridox**, software house dari Bali yang spesialis dalam web development, mobile app, dan SaaS. Dibangun dengan Next.js App Router, bilingual (ID/EN), dilengkapi AI chatbot, AI blog generator, dan admin panel lengkap.

🌐 **Live:** [teridox.com](https://teridox.com)

---

## Fitur Utama

### Website Publik
- **Bilingual penuh (ID/EN)** — routing locale `/id/*` dan `/en/*` via next-intl, semua halaman dan konten ditranslasikan
- **AI Chatbot** — streaming chatbot berbasis NVIDIA NIM (LLaMA 3.1 70B) dengan rate limiting 30 req/IP/jam
- **Blog** dengan search, filter kategori, dan reading time
- **Portfolio** dengan filter kategori (web, mobile, SaaS)
- **Halaman Layanan** dengan detail fitur, proses 4-step, dan FAQ per layanan
- **Formulir Kontak** dengan validasi Zod, pengiriman email via Resend, dan penyimpanan ke Supabase
- **Dark / Light mode** dengan cookie persistence
- **Animasi** halus menggunakan Framer Motion

### SEO & Performance
- Metadata dinamis per halaman — title, description, canonical URL, Open Graph, Twitter Card
- JSON-LD structured data — Organization, Article, Service, FAQPage, CreativeWork
- Dynamic OG image generator dengan `next/og`
- Sitemap dinamis yang include semua konten dari database (blog, services, portfolio)
- `robots.txt` dengan allowlist AI crawler (GPTBot, Claude-Web, PerplexityBot)
- `llms.txt` bilingual untuk AI discovery
- Core Web Vitals optimized — `next/image` dengan priority/fill, font non-blocking
- Viewport & theme-color meta, PWA manifest

### Admin Panel (`/admin`)
- **Dashboard** — statistik real-time (artikel, pesan, portfolio, sesi chat)
- **Blog Manager** — CRUD artikel dengan Tiptap rich text editor dan upload gambar
- **AI Blog Generator** — generate artikel lengkap + auto-translate EN↔ID via NVIDIA NIM Nemotron 70B
- **Portfolio Manager** — CRUD portfolio items dengan upload gambar
- **Services Manager** — kelola halaman layanan
- **Testimonials** — moderasi testimoni yang masuk dari publik
- **Messages** — inbox pesan dari contact form
- **Media Library** — upload dan manajemen file ke Supabase Storage
- **Site Settings** — konfigurasi kontak, hero image, social media links, WhatsApp button
- **Chat Logs** — riwayat percakapan AI chatbot
- Auth berbasis Supabase session cookie, diproteksi middleware

---

## Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript 6 |
| Styling | Tailwind CSS v4, shadcn/ui (custom), Radix UI |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + cookie session |
| Storage | Supabase Storage |
| AI / LLM | NVIDIA NIM — LLaMA 3.1 70B (chatbot), Nemotron 70B (blog gen), LLaMA 3.1 8B (translate) |
| Email | Resend |
| i18n | next-intl v4 |
| Animasi | Framer Motion |
| Rich Text | Tiptap v3 |
| Form | React Hook Form + Zod v4 |
| Icons | Font Awesome 6 |
| Font | Syne (heading) + DM Sans (body) via next/font |
| Analytics | Vercel Analytics |
| Deploy | Vercel |

---

## Struktur Proyek

```
teridox/
├── app/
│   ├── [locale]/               # Semua halaman publik (id/* dan en/*)
│   │   ├── page.tsx            # Homepage
│   │   ├── about/
│   │   ├── services/[slug]/
│   │   ├── portfolio/[slug]/
│   │   ├── blog/[slug]/
│   │   ├── contact/
│   │   ├── faq/
│   │   ├── testimonials/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── not-found.tsx       # Custom 404
│   │   └── error.tsx           # Custom 500
│   ├── admin/                  # Admin panel (tanpa locale prefix)
│   │   ├── dashboard/
│   │   ├── blog/
│   │   ├── portfolio/
│   │   ├── services/
│   │   ├── testimonials/
│   │   ├── messages/
│   │   ├── media/
│   │   ├── settings/
│   │   └── chat-logs/
│   ├── api/
│   │   ├── chat/               # Streaming AI chatbot (SSE + rate limiting)
│   │   ├── contact/            # Contact form → Supabase + Resend
│   │   ├── blog-generate/      # AI blog generation + auto-translate
│   │   ├── testimonials/       # Submit testimoni publik
│   │   └── admin/upload/       # File upload ke Supabase Storage
│   ├── opengraph-image.tsx     # Dynamic OG image
│   ├── sitemap.ts              # Dynamic sitemap
│   └── layout.tsx
├── components/
│   ├── sections/               # Hero, Stats, ServicesPreview, dll
│   ├── common/                 # Navbar, Footer, ChatWidget
│   └── ui/                     # shadcn/ui components (custom)
├── messages/
│   ├── id.json                 # Semua string Bahasa Indonesia
│   └── en.json                 # Semua string English
├── lib/
│   ├── supabase/               # client.ts + server.ts + createAdminClient
│   ├── nvidia.ts               # NVIDIA NIM client + model constants
│   ├── i18n/                   # next-intl routing config + navigation helpers
│   └── context/                # SiteSettingsContext
└── public/
    ├── manifest.json
    ├── robots.txt
    ├── llms.txt
    └── llms-id.txt
```

---

## Instalasi & Development

### Prerequisites
- Node.js 18+
- Akun [Supabase](https://supabase.com)
- Akun [NVIDIA NIM](https://build.nvidia.com)
- Akun [Resend](https://resend.com)

### 1. Clone & Install

```bash
git clone https://github.com/aryaintarann/teridox.git
cd teridox
npm install
```

### 2. Environment Variables

Buat file `.env.local` di root proyek:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NVIDIA NIM
NVIDIA_API_KEY=nvapi-...

# Resend (Email)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=your@email.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Jalankan Development Server

```bash
npm run dev
# → http://localhost:3000
```

### 4. Perintah Lainnya

```bash
npm run build      # Production build
npm run start      # Jalankan production server
npm run lint       # ESLint
npx tsc --noEmit   # Type check
```

---

## Konfigurasi Supabase

Database membutuhkan tabel berikut:

| Tabel | Kegunaan |
|-------|----------|
| `blog_posts` | Artikel blog (bilingual) |
| `portfolio_items` | Proyek portfolio |
| `services` | Halaman layanan |
| `testimonials` | Testimoni klien |
| `contact_messages` | Pesan dari contact form |
| `chat_sessions` | Log sesi chatbot |
| `site_settings` | Konfigurasi website (kontak, hero image, social links) |

Storage bucket yang dibutuhkan: `media` (untuk upload gambar blog dan portfolio).

---

## Highlights Teknis

**Streaming AI Chatbot** — `/api/chat/route.ts` menggunakan Server-Sent Events (SSE) untuk streaming respons LLM secara real-time. Dilengkapi in-memory rate limiter per IP (30 request/jam) tanpa dependency eksternal.

**AI Blog Generator** — Admin dapat generate artikel lengkap (judul, konten, kategori, tags) hanya dengan satu prompt menggunakan Nemotron 70B. Artikel otomatis ditranslasikan ke English menggunakan LLaMA 3.1 8B dalam satu pipeline.

**Bilingual Architecture** — Semua halaman publik tersedia di `/id/*` dan `/en/*`. Navigation helper dari `@/lib/i18n/navigation` memastikan locale selalu ter-preserve saat navigasi. Server component menggunakan `getTranslations()`, client component menggunakan `useTranslations()`.

**Server Component + Client Split** — Halaman yang memerlukan metadata SEO dipisah menjadi server component wrapper (`page.tsx`) yang export `generateMetadata`, dan client component (`*Content.tsx`) yang menangani interaktivitas — tanpa mengorbankan SSR metadata.

**Security** — Upload file divalidasi dengan magic bytes check (bukan hanya MIME type). Service role key hanya digunakan server-side via `createAdminClient()`. Admin route diproteksi middleware berbasis Supabase session cookie.

---

## License

Proyek ini bersifat privat dan dibuat untuk kebutuhan bisnis Teridox.

---

<p align="center">
  Dibuat di Bali, Indonesia &nbsp;·&nbsp; <a href="https://teridox.com">teridox.com</a>
</p>
