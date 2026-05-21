# Product Requirements Document (PRD)
## Company Profile Website — Dynamic, Multilingual, AI-Powered

**Versi:** 1.0.0
**Tanggal:** 20 Mei 2026
**Status:** Draft
**Penulis:** Tim Product

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Latar Belakang & Tujuan](#2-latar-belakang--tujuan)
3. [Pengguna & Stakeholder](#3-pengguna--stakeholder)
4. [Fitur & Persyaratan Fungsional](#4-fitur--persyaratan-fungsional)
5. [Arsitektur Teknis](#5-arsitektur-teknis)
6. [Skema Database](#6-skema-database)
7. [Desain & UX](#7-desain--ux)
8. [SEO, GEO & AI Search](#8-seo-geo--ai-search)
9. [Keamanan & Performa](#9-keamanan--performa)
10. [Roadmap & Fase Pengembangan](#10-roadmap--fase-pengembangan)
11. [Risiko & Mitigasi](#11-risiko--mitigasi)
12. [Kriteria Keberhasilan](#12-kriteria-keberhasilan)
13. [Glosarium](#13-glosarium)

---

## 1. Ringkasan Eksekutif

Website company profile ini dirancang sebagai platform digital yang **dinamis, bilingual, dan berbasis AI** untuk merepresentasikan bisnis secara profesional di internet. Website ini tidak hanya berfungsi sebagai "brosur digital" statis, melainkan sebagai ekosistem konten yang terus berkembang dengan dukungan kecerdasan buatan.

### Tujuan Utama
- Membangun **kehadiran digital yang kuat** di mesin pencari (Google, Bing) dan AI Search (ChatGPT, Perplexity, Claude, Gemini)
- Menyediakan **pengalaman pengguna yang personal** melalui chatbot AI berbasis bisnis
- Memungkinkan **pengelolaan konten mandiri** melalui admin panel tanpa keahlian teknis
- Menjangkau **pasar lokal (Indonesia) dan global (English)** secara bersamaan

### Nilai Bisnis
| Aspek | Nilai |
|---|---|
| Visibilitas | Muncul di Google, Bing, dan semua platform AI Search |
| Efisiensi | Blog berbahasa dua dibuat dalam hitungan menit dengan AI |
| Konversi | Chatbot menangkap lead 24/7 tanpa biaya SDM tambahan |
| Skalabilitas | Konten dan layanan bisa dikelola sendiri tanpa developer |

---

## 2. Latar Belakang & Tujuan

### 2.1 Latar Belakang

Perkembangan AI Search (Generative Engine Optimization / GEO) mengubah cara pengguna menemukan bisnis. Selain muncul di hasil pencarian tradisional (Google/Bing), bisnis kini perlu **diindeks oleh model AI besar** seperti ChatGPT, Perplexity, dan Google AI Overviews. Website ini dibangun dengan mempertimbangkan landscape baru tersebut dari hari pertama.

### 2.2 Tujuan Produk

| ID | Tujuan | Indikator Keberhasilan |
|---|---|---|
| OBJ-01 | Membangun kehadiran brand online yang kuat | Muncul di halaman 1 Google dalam 3 bulan |
| OBJ-02 | Menghasilkan lead organik dari website | Minimal 10 inquiry/bulan dari website |
| OBJ-03 | Menjadi sumber informasi terpercaya di industri | Blog dikutip oleh AI Search dalam 6 bulan |
| OBJ-04 | Operasional konten mandiri tanpa developer | Admin dapat publish konten tanpa bantuan teknis |
| OBJ-05 | Meningkatkan engagement pengunjung | Rata-rata session duration > 2 menit |

### 2.3 Out of Scope (v1.0)
- Fitur e-commerce / pembayaran online
- Portal klien / project tracking
- Integrasi CRM pihak ketiga
- Mobile app (iOS/Android)

---

## 3. Pengguna & Stakeholder

### 3.1 Pengguna Publik (End Users)

#### Persona 1: Calon Klien Lokal
- **Profil:** Pebisnis Indonesia, 30–50 tahun, mencari vendor/partner
- **Kebutuhan:** Memahami layanan, melihat portfolio, menghubungi tim
- **Bahasa:** Bahasa Indonesia
- **Perangkat:** Mobile-first (60%), Desktop (40%)
- **Ekspektasi:** Website cepat, informasi jelas, mudah menghubungi

#### Persona 2: Calon Klien Internasional
- **Profil:** Professional/Business owner, non-Indonesia
- **Kebutuhan:** Portfolio, kredibilitas, cara kerja, pricing
- **Bahasa:** English
- **Perangkat:** Desktop (70%), Mobile (30%)
- **Ekspektasi:** Konten profesional, credibility signals kuat

#### Persona 3: Pengguna AI Search
- **Profil:** Semua umur, menggunakan ChatGPT/Perplexity untuk riset vendor
- **Kebutuhan:** Informasi akurat tentang layanan & keahlian perusahaan
- **Saluran:** AI chatbots, bukan website langsung
- **Ekspektasi:** Informasi konsisten di semua platform

### 3.2 Pengguna Admin

#### Persona 4: Admin / Pemilik Bisnis
- **Profil:** Pemilik bisnis atau staf non-teknis
- **Kebutuhan:** Mengelola konten, melihat pesan masuk, publish blog
- **Keahlian Teknis:** Rendah–Menengah
- **Ekspektasi:** Interface sederhana, AI membantu pembuatan konten

### 3.3 Stakeholder
| Stakeholder | Kepentingan |
|---|---|
| Pemilik Bisnis | ROI dari website, lead generation |
| Tim Sales | Kualitas dan kuantitas inquiry |
| Tim Konten | Kemudahan pembuatan dan pengelolaan artikel |
| Tim IT | Keamanan, performa, dan maintainability |

---

## 4. Fitur & Persyaratan Fungsional

### 4.1 Halaman Publik

#### 4.1.1 Homepage / Landing Page
- **Hero Section:** Tagline utama, sub-headline, CTA button (Hubungi Kami / View Portfolio)
- **About Snapshot:** Deskripsi singkat perusahaan (3–4 kalimat), link ke halaman About
- **Services Preview:** Grid 3–6 layanan utama dengan ikon, deskripsi singkat
- **Stats/Numbers:** Angka pencapaian (klien dilayani, tahun berdiri, proyek selesai)
- **Portfolio Highlight:** 3–6 proyek terbaik (featured)
- **Testimonials Slider:** Ulasan klien dengan rating bintang
- **CTA Section:** Ajakan kontak / konsultasi gratis
- **Blog Preview:** 3 artikel terbaru

**Persyaratan Teknis:**
- Above-the-fold load time < 1.5 detik
- Animasi entrance menggunakan Framer Motion
- Fully responsive (mobile, tablet, desktop)

---

#### 4.1.2 Halaman About Us
- Cerita perusahaan (founding story)
- Misi, Visi, dan Values
- Timeline pencapaian perusahaan
- Grid profil tim (foto, nama, jabatan, bio singkat, LinkedIn)

---

#### 4.1.3 Halaman Services
- **List View:** Semua layanan dengan ikon, deskripsi, dan link ke detail
- **Service Detail Page (`/services/[slug]`):**
  - Deskripsi lengkap layanan
  - Fitur / apa yang didapat klien
  - Proses kerja (step-by-step)
  - FAQ spesifik layanan (untuk GEO)
  - CTA: "Konsultasi Gratis" / "Hubungi Kami"

---

#### 4.1.4 Halaman Portfolio
- Grid/masonry layout semua proyek
- Filter berdasarkan kategori/tag
- **Portfolio Detail Page (`/portfolio/[slug]`):**
  - Cover image dan galeri foto
  - Deskripsi proyek
  - Challenge dan solusi yang diberikan
  - Teknologi yang digunakan
  - Hasil/outcome yang dicapai
  - Link ke proyek (jika tersedia)

---

#### 4.1.5 Halaman Blog / Insights
- Daftar artikel dengan thumbnail, judul, excerpt, tanggal, estimasi waktu baca
- Filter berdasarkan kategori dan tag
- Search artikel
- **Blog Detail Page (`/blog/[slug]`):**
  - Konten artikel lengkap (rich text)
  - FAQ section di bagian bawah (untuk GEO)
  - Share ke sosial media
  - Artikel terkait (related posts)
  - Author bio

---

#### 4.1.6 Halaman Contact
- Form kontak: Nama, Email, Nomor Telepon, Pesan, Layanan yang diminati
- Informasi kontak perusahaan (alamat, email, telepon, jam operasional)
- Embed Google Maps
- Link sosial media
- Konfirmasi email otomatis setelah form dikirim

---

#### 4.1.7 Halaman FAQ (Dedicated)
- Pertanyaan umum tentang bisnis, layanan, proses kerja, dan pembayaran
- Accordion expand/collapse
- Terstruktur dengan FAQPage schema (JSON-LD) untuk GEO

---

### 4.2 AI Chatbot

#### Deskripsi
Widget chatbot floating yang muncul di semua halaman. Chatbot **hanya** menjawab pertanyaan seputar bisnis menggunakan model AI NVIDIA NIM.

#### Fitur Chatbot
| Fitur | Deskripsi |
|---|---|
| Scope Terbatas | Hanya menjawab topik: layanan, harga, proses, kontak, portfolio |
| Bahasa Adaptif | Deteksi bahasa pengguna, respons dalam bahasa yang sama |
| Quick Replies | Suggest pertanyaan populer di awal percakapan |
| Fallback | Jika tidak bisa jawab, arahkan ke halaman kontak atau WhatsApp |
| Riwayat Sesi | Percakapan tersimpan selama sesi aktif (tidak persisten lintas sesi) |
| Log Admin | Riwayat chat dapat dilihat admin untuk analisis dan peningkatan |
| Rate Limiting | Max 30 pesan per IP per jam |

#### Contoh Topik yang Dijawab
- "Apa saja layanan yang ditawarkan?"
- "Berapa harga untuk pembuatan website?"
- "Bagaimana proses kerja kalian?"
- "Apakah ada garansi?"
- "Bagaimana cara menghubungi tim?"

#### Contoh Topik yang Ditolak
- Pertanyaan politik, pribadi, atau tidak berkaitan dengan bisnis
- Respons: *"Maaf, saya hanya dapat membantu pertanyaan seputar layanan kami. Ada yang ingin Anda tanyakan tentang bisnis kami?"*

#### System Prompt Template
```
Kamu adalah asisten virtual resmi dari [Nama Perusahaan].
Tugasmu adalah membantu calon klien dan pengunjung website
dengan pertanyaan seputar bisnis kami.

HANYA jawab pertanyaan tentang:
1. Layanan yang kami tawarkan: [daftar layanan]
2. Proses kerja dan timeline
3. Cara menghubungi tim kami
4. Portfolio dan pengalaman kami
5. FAQ umum seputar bisnis kami

JANGAN jawab pertanyaan di luar topik di atas.
Jika ditanya hal lain, tolak dengan sopan dan tawarkan bantuan
yang relevan dengan bisnis kami.

Selalu gunakan bahasa yang sama dengan pengguna (Indonesia/English).
Tone: profesional namun ramah dan membantu.
```

---

### 4.3 AI Blog Generator (Admin)

#### Deskripsi
Fitur di admin panel yang membantu admin membuat artikel blog dalam dua bahasa secara efisien menggunakan NVIDIA NIM.

#### Alur Pembuatan Blog

```
Step 1: Admin input
  └── Topik / keyword utama
  └── Bahasa sumber (ID atau EN)
  └── Panjang artikel (Pendek ~800 kata / Sedang ~1500 kata / Panjang ~2500 kata)
  └── Tone (Informatif / Persuasif / Tutorial)

Step 2: AI Generate (Bahasa Sumber)
  └── Judul SEO-friendly
  └── Meta description (max 160 karakter)
  └── Slug URL
  └── Konten lengkap dengan heading H2/H3
  └── FAQ section (3–5 pertanyaan)
  └── Tags dan kategori

Step 3: AI Auto-Translate
  └── Terjemahkan semua konten ke bahasa kedua
  └── Sesuaikan idiom dan konteks budaya (bukan terjemahan literal)

Step 4: Admin Review & Edit
  └── Edit di rich text editor (WYSIWYG)
  └── Upload/pilih gambar dari media library
  └── Set tanggal publish

Step 5: Publish
  └── Tersimpan di Supabase (2 record: EN + ID)
  └── Otomatis muncul di /en/blog/[slug] dan /id/blog/[slug]
  └── Sitemap otomatis diperbarui
```

#### Output yang Dihasilkan AI
- Judul (EN + ID)
- Slug URL
- Meta title (EN + ID)
- Meta description (EN + ID)
- Konten artikel (EN + ID)
- FAQ section (EN + ID)
- Tags yang disarankan
- Estimasi waktu baca

---

### 4.4 Admin Panel

#### 4.4.1 Autentikasi Admin
- Login dengan email + password via Supabase Auth
- Proteksi semua route `/admin/*` via Next.js middleware
- Session management dengan Supabase (JWT)
- Tidak ada fitur registrasi publik — admin dibuat manual di Supabase

#### 4.4.2 Dashboard
- Total artikel (published/draft)
- Total pesan masuk (read/unread)
- Total portfolio item
- Total sesi chatbot (7 hari terakhir)
- Grafik pesan masuk per bulan
- Artikel terbaru yang perlu direview

#### 4.4.3 Blog Manager
| Fitur | Deskripsi |
|---|---|
| List Artikel | Tabel dengan filter status (draft/published), pencarian |
| Buat Artikel | Form + AI Generator + Rich text editor (Tiptap/Quill) |
| Edit Artikel | Edit konten EN dan ID dalam satu tampilan (tab) |
| Status Artikel | Draft → Published → Archived |
| Preview | Preview tampilan artikel sebelum publish |
| Delete | Soft delete (arsip, tidak hapus permanen) |

#### 4.4.4 Services Manager
- CRUD layanan (dengan translasi EN + ID)
- Upload ikon layanan
- Atur urutan tampilan (drag & drop)
- Aktif/nonaktifkan layanan

#### 4.4.5 Portfolio Manager
- CRUD proyek portfolio
- Upload multiple gambar (via Supabase Storage)
- Tag / kategori proyek
- Tandai sebagai featured (tampil di homepage)

#### 4.4.6 Testimonials Manager
- Lihat semua testimonial yang masuk
- Approve / Reject testimonial
- Tambah testimonial manual
- Set testimonial untuk tampil di homepage

#### 4.4.7 Messages Inbox
- Lihat semua pesan dari contact form
- Tandai sebagai read/unread
- Filter dan pencarian
- Export ke CSV

#### 4.4.8 Team Manager
- CRUD profil anggota tim
- Upload foto profil
- Atur urutan tampilan
- Edit jabatan dan bio (EN + ID)

#### 4.4.9 Media Library
- Upload gambar ke Supabase Storage
- Preview, copy URL, dan hapus media
- Filter berdasarkan tipe file dan tanggal upload

#### 4.4.10 Chat Logs
- Lihat riwayat sesi chatbot
- Filter berdasarkan tanggal
- Analisis topik yang sering ditanyakan

#### 4.4.11 Site Settings
- Informasi perusahaan (nama, deskripsi, alamat, kontak)
- SEO global (default meta title, description)
- Sosial media links
- Edit system prompt chatbot
- Toggle maintenance mode

---

## 5. Arsitektur Teknis

### 5.1 Tech Stack

| Kategori | Teknologi | Alasan |
|---|---|---|
| **Framework** | Next.js 16.2.6 (App Router) | SSG/ISR untuk performa SEO, React server components |
| **Bahasa** | TypeScript | Type safety, developer experience |
| **Database & Auth** | Supabase (PostgreSQL) | Realtime, Auth bawaan, Storage, RLS |
| **AI Model** | NVIDIA NIM API | Chatbot & blog generation |
| **UI Components** | shadcn/ui + Tailwind CSS | Customizable, aksesibel |
| **Animasi** | Framer Motion | Animasi halaman dan elemen |
| **Rich Text Editor** | Tiptap | Editor blog di admin panel |
| **Internasionalisasi** | next-intl | i18n routing EN/ID |
| **Dark Mode** | next-themes | Theme switching persisten |
| **Form** | React Hook Form + Zod | Validasi form yang aman |
| **Email** | Resend | Notifikasi form kontak |
| **Sitemap** | next-sitemap | Auto-generate sitemap bilingual |
| **Analytics** | Vercel Analytics | Privacy-first analytics |
| **Hosting** | Vercel | Edge network, CI/CD dari GitHub |

### 5.2 Arsitektur Sistem

```
┌──────────────────────────────────────────────────────────────┐
│                        NEXT.JS 15 APP                        │
│                                                              │
│  Public (/[locale]/...)     Admin (/admin/...)               │
│  ├── Homepage               ├── Dashboard                    │
│  ├── About                  ├── Blog + AI Writer             │
│  ├── Services/[slug]        ├── Services                     │
│  ├── Portfolio/[slug]       ├── Portfolio                    │
│  ├── Blog/[slug]            ├── Testimonials                 │
│  ├── Contact                ├── Messages                     │
│  ├── FAQ                    ├── Team                         │
│  └── [Chatbot Widget]       ├── Media Library                │
│                             ├── Chat Logs                    │
│                             └── Settings                     │
│                                                              │
│  API Routes                                                  │
│  ├── /api/chat              → NVIDIA NIM Chatbot             │
│  ├── /api/blog-generate     → NVIDIA NIM Blog AI            │
│  ├── /api/contact           → Email via Resend               │
│  └── /api/admin/*           → Supabase CRUD                  │
│                                                              │
│  Middleware                                                  │
│  ├── Locale detection & redirect                             │
│  └── Admin auth protection                                   │
└──────────────┬───────────────────────┬───────────────────────┘
               │                       │
               ▼                       ▼
      ┌──────────────┐        ┌────────────────────┐
      │  NVIDIA NIM  │        │      Supabase       │
      │  API         │        │                    │
      │              │        │  ├── PostgreSQL DB  │
      │  Model:      │        │  ├── Auth (Admin)   │
      │  • llama-3.1 │        │  ├── Storage        │
      │    -70b      │        │  │   (Media/Images) │
      │  • nemotron  │        │  └── RLS Policies   │
      │    -70b      │        └────────────────────┘
      └──────────────┘
```

### 5.3 Routing & i18n

```
/ → redirect ke /id (default bahasa Indonesia)

/id/                    /en/
/id/about               /en/about
/id/services            /en/services
/id/services/[slug]     /en/services/[slug]
/id/portfolio           /en/portfolio
/id/portfolio/[slug]    /en/portfolio/[slug]
/id/blog                /en/blog
/id/blog/[slug]         /en/blog/[slug]
/id/contact             /en/contact
/id/faq                 /en/faq

/admin                  (tidak memiliki locale)
/admin/login
/admin/dashboard
/admin/blog
/admin/blog/new
/admin/blog/[id]/edit
/admin/services
/admin/portfolio
/admin/testimonials
/admin/messages
/admin/team
/admin/media
/admin/chat-logs
/admin/settings
```

### 5.4 NVIDIA NIM API Integration

```typescript
// lib/nvidia.ts
import OpenAI from 'openai'

export const nvidia = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
})

// Model yang digunakan:
// Chatbot:     meta/llama-3.1-70b-instruct
// Blog Gen:    nvidia/llama-3.1-nemotron-70b-instruct
// Translate:   meta/llama-3.1-8b-instruct (ringan, cepat)
```

### 5.5 Struktur Folder

```
/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── portfolio/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   └── faq/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── services/page.tsx
│   │   ├── portfolio/page.tsx
│   │   ├── testimonials/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── team/page.tsx
│   │   ├── media/page.tsx
│   │   ├── chat-logs/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── chat/route.ts
│       ├── blog-generate/route.ts
│       ├── contact/route.ts
│       └── admin/
│           ├── articles/route.ts
│           ├── services/route.ts
│           ├── portfolio/route.ts
│           └── ...
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Testimonials.tsx
│   │   ├── BlogPreview.tsx
│   │   └── Contact.tsx
│   ├── ui/                  (shadcn components)
│   ├── admin/               (admin-specific UI)
│   ├── chatbot/
│   │   ├── ChatWidget.tsx
│   │   ├── ChatBubble.tsx
│   │   └── QuickReplies.tsx
│   └── common/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── ThemeToggle.tsx
│       └── LanguageSwitcher.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── nvidia.ts
│   └── i18n/
│       ├── config.ts
│       └── dictionaries/
│           ├── en.json
│           └── id.json
├── middleware.ts
└── public/
    ├── llms.txt
    ├── llms-id.txt
    ├── robots.txt
    └── sitemap.xml (auto-generated)
```

---

## 6. Skema Database

### 6.1 Tabel Konten

```sql
-- === ARTICLES / BLOG ===
CREATE TABLE articles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR UNIQUE NOT NULL,
  status      VARCHAR DEFAULT 'draft',  -- draft | published | archived
  cover_image TEXT,
  tags        TEXT[],
  author_id   UUID REFERENCES auth.users,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE article_translations (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id         UUID REFERENCES articles(id) ON DELETE CASCADE,
  locale             VARCHAR(5) NOT NULL,  -- 'en' | 'id'
  title              TEXT NOT NULL,
  content            TEXT NOT NULL,
  excerpt            TEXT,
  meta_title         VARCHAR(60),
  meta_description   VARCHAR(160),
  faq                JSONB,  -- [{q: "...", a: "..."}]
  reading_time_min   INT,
  UNIQUE(article_id, locale)
);

-- === SERVICES ===
CREATE TABLE services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR UNIQUE NOT NULL,
  icon        VARCHAR,
  order_index INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true
);

CREATE TABLE service_translations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id   UUID REFERENCES services(id) ON DELETE CASCADE,
  locale       VARCHAR(5) NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  features     JSONB,  -- ["Feature 1", "Feature 2"]
  process      JSONB,  -- [{step: 1, title: "...", desc: "..."}]
  faq          JSONB,
  meta_title   VARCHAR(60),
  meta_desc    VARCHAR(160),
  UNIQUE(service_id, locale)
);

-- === PORTFOLIO ===
CREATE TABLE portfolio (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         VARCHAR UNIQUE NOT NULL,
  cover_image  TEXT,
  images       TEXT[],
  project_url  TEXT,
  tags         TEXT[],
  is_featured  BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio_translations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolio(id) ON DELETE CASCADE,
  locale       VARCHAR(5) NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  challenge    TEXT,
  solution     TEXT,
  outcome      TEXT,
  UNIQUE(portfolio_id, locale)
);

-- === TESTIMONIALS ===
CREATE TABLE testimonials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name     VARCHAR NOT NULL,
  client_role     VARCHAR,
  client_company  VARCHAR,
  client_avatar   TEXT,
  rating          INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  locale          VARCHAR(5) NOT NULL,
  content         TEXT NOT NULL,
  is_approved     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- === TEAM ===
CREATE TABLE team_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR NOT NULL,
  avatar       TEXT,
  linkedin_url TEXT,
  order_index  INT DEFAULT 0,
  is_active    BOOLEAN DEFAULT true
);

CREATE TABLE team_translations (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  locale    VARCHAR(5) NOT NULL,
  role      VARCHAR NOT NULL,
  bio       TEXT,
  UNIQUE(member_id, locale)
);
```

### 6.2 Tabel Interaksi

```sql
-- === CONTACT MESSAGES ===
CREATE TABLE contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR NOT NULL,
  email       VARCHAR NOT NULL,
  phone       VARCHAR,
  subject     VARCHAR,
  service     VARCHAR,
  message     TEXT NOT NULL,
  locale      VARCHAR(5),
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- === CHAT SESSIONS & MESSAGES ===
CREATE TABLE chat_sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale     VARCHAR(5),
  ip_address VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role       VARCHAR NOT NULL CHECK (role IN ('user', 'assistant')),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.3 Tabel Sistem

```sql
-- === SITE SETTINGS ===
CREATE TABLE site_settings (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key    VARCHAR NOT NULL,
  locale VARCHAR(5) NOT NULL,
  value  JSONB NOT NULL,
  UNIQUE(key, locale)
);

-- Contoh data:
-- key: 'company_info', locale: 'id', value: {name, tagline, address, email, phone}
-- key: 'social_links', locale: 'en', value: {instagram, linkedin, twitter}
-- key: 'chatbot_prompt', locale: 'id', value: {system_prompt}
-- key: 'seo_defaults', locale: 'en', value: {meta_title, meta_description}

-- === MEDIA LIBRARY ===
CREATE TABLE media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename    VARCHAR NOT NULL,
  url         TEXT NOT NULL,
  size        INT,
  mime_type   VARCHAR,
  alt_text    TEXT,
  uploaded_by UUID REFERENCES auth.users,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.4 Row Level Security (RLS)

```sql
-- Aktifkan RLS pada semua tabel
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
-- (dan seterusnya untuk semua tabel)

-- Public: hanya baca konten yang published
CREATE POLICY "Public read published articles"
  ON articles FOR SELECT
  USING (status = 'published');

-- Admin: akses penuh (via service role key di server)
-- API routes admin menggunakan Supabase service role key
-- bukan anon key, sehingga bypass RLS

-- Contact messages: siapa saja bisa insert, hanya admin bisa baca
CREATE POLICY "Anyone can insert contact"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admin can read contacts"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');
```

---

## 7. Desain & UX

### 7.1 Prinsip Desain
- **Mobile-First:** Desain dimulai dari viewport 375px, lalu scale up
- **Accessibility:** WCAG 2.1 AA compliant (contrast ratio, keyboard navigation, ARIA)
- **Performance-First:** Optimasi gambar (next/image), lazy loading, minimal bundle size
- **Konsistensi:** Design system dengan CSS variables dan shadcn/ui tokens

### 7.2 Dark / Light Mode

```css
/* Light Mode (default) */
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --primary: [brand-color];
  --secondary: [secondary-color];
  --muted: #f5f5f5;
  --border: #e5e5e5;
}

/* Dark Mode */
.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --primary: [brand-color-adjusted];
  --muted: #1a1a1a;
  --border: #262626;
}
```

**Implementasi:**
- Menggunakan `next-themes` library
- Preferensi disimpan di `localStorage`
- Deteksi otomatis `prefers-color-scheme` sistem
- Toggle button di navbar (accessible)
- Transisi smooth antar mode (CSS transition 200ms)

### 7.3 Animasi (Framer Motion)

| Jenis Animasi | Trigger | Deskripsi |
|---|---|---|
| Page Enter | Route change | Fade-in + slight translateY |
| Hero Elements | On mount | Staggered entrance (delay 0.1s antar elemen) |
| Section Reveal | Scroll into view | Fade-in dari bawah |
| Card Hover | Mouse enter | Scale 1.02 + shadow increase |
| Chatbot Open | Click | Scale + fade dari kanan bawah |
| CTA Button | Mouse enter | Background color shift + scale |

### 7.4 Responsif Breakpoints

```
Mobile:  375px – 767px   (1 kolom)
Tablet:  768px – 1023px  (2 kolom)
Desktop: 1024px – 1279px (3 kolom)
Wide:    1280px+          (3-4 kolom, max-width 1440px)
```

### 7.5 Navigasi

**Navbar (Publik):**
- Logo kiri
- Menu: Home, About, Services, Portfolio, Blog, Contact
- Language switcher (ID | EN)
- Dark/Light mode toggle
- CTA Button "Hubungi Kami"
- Mobile: hamburger menu dengan slide-in drawer

**Sidebar (Admin):**
- Logo + nama perusahaan
- Menu navigasi dengan ikon
- Badge notifikasi untuk pesan baru
- Info admin yang login
- Tombol logout

---

## 8. SEO, GEO & AI Search

### 8.1 Technical SEO

#### Metadata per Halaman
```typescript
// Setiap halaman menggunakan generateMetadata()
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `${pageTitle} | ${siteName}`,
    description: metaDescription,
    openGraph: {
      title, description, images, locale, type
    },
    twitter: { card, title, description, images },
    alternates: {
      canonical: canonicalUrl,
      languages: { 'id': '/id/path', 'en': '/en/path' }
    }
  }
}
```

#### Hreflang Tags (Otomatis di setiap halaman)
```html
<link rel="alternate" hreflang="id" href="https://domain.com/id/[path]" />
<link rel="alternate" hreflang="en" href="https://domain.com/en/[path]" />
<link rel="alternate" hreflang="x-default" href="https://domain.com/en/[path]" />
```

#### Structured Data (JSON-LD)

| Halaman | Schema Type |
|---|---|
| Homepage | `Organization`, `WebSite`, `LocalBusiness` |
| Blog Post | `Article`, `BreadcrumbList` |
| FAQ | `FAQPage` |
| Service | `Service`, `FAQPage` |
| Contact | `LocalBusiness`, `ContactPage` |
| Team | `Person` |

#### Sitemap Bilingual
```
sitemap.xml berisi:
- /id/* — semua halaman Bahasa Indonesia
- /en/* — semua halaman English
- Prioritas: Homepage > Services > Blog > Portfolio > Other
- Changefreq: daily (blog), weekly (services), monthly (about)
```

#### robots.txt
```
User-agent: *
Allow: /en/
Allow: /id/
Disallow: /admin/
Disallow: /api/

# AI Crawlers (allow content)
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /
```

### 8.2 GEO (Generative Engine Optimization)

#### Strategi Konten GEO

**1. FAQ di setiap halaman:**
- Minimal 3–5 pertanyaan per halaman layanan
- Format: pertanyaan natural yang sering dicari pengguna
- Implementasi: `FAQPage` JSON-LD schema

**2. Format konten yang disukai AI:**
- Jawaban langsung di paragraf pertama (direct answer)
- Heading berbentuk pertanyaan (H2: "Apa itu [Layanan]?")
- List dan tabel untuk informasi terstruktur
- Statistik dengan sumber yang jelas

**3. Struktur halaman blog optimal untuk GEO:**
```
H1: [Judul Utama — berisi keyword]
Paragraf intro: jawaban langsung dalam 2–3 kalimat
H2: Apa itu [Topik]?
H2: Mengapa [Topik] Penting?
H2: Bagaimana Cara [Topik]?
  H3: Langkah 1
  H3: Langkah 2
H2: FAQ
  - Pertanyaan 1?
  - Pertanyaan 2?
H2: Kesimpulan
```

### 8.3 AI Search Optimization

#### llms.txt (untuk AI Crawlers)

**`/public/llms.txt`** (English)
```
# [Company Name]
> [Brief description of what the company does, 1-2 sentences]

## Services
- [Service 1](/en/services/service-1-slug)
- [Service 2](/en/services/service-2-slug)

## Key Pages
- About Us: /en/about
- Portfolio: /en/portfolio
- Blog: /en/blog
- Contact: /en/contact
- FAQ: /en/faq

## Contact
- Email: hello@domain.com
- Location: Bali, Indonesia
```

**`/public/llms-id.txt`** (Bahasa Indonesia)
```
# [Nama Perusahaan]
> [Deskripsi singkat perusahaan dalam 1–2 kalimat]

## Layanan
- [Layanan 1](/id/services/layanan-1-slug)
- [Layanan 2](/id/services/layanan-2-slug)

## Halaman Utama
- Tentang Kami: /id/about
- Portfolio: /id/portfolio
- Blog: /id/blog
- Kontak: /id/contact
- FAQ: /id/faq

## Kontak
- Email: hello@domain.com
- Lokasi: Bali, Indonesia
```

#### Checklist AI Search Readiness
- [ ] Google Business Profile terdaftar dan lengkap
- [ ] Bing Webmaster Tools terdaftar (sumber data GPT/Copilot)
- [ ] `llms.txt` tersedia di root domain (EN + ID)
- [ ] `robots.txt` mengizinkan AI crawlers
- [ ] Konten E-E-A-T (Experience, Expertise, Authoritativeness, Trust)
- [ ] Author bio lengkap di setiap artikel blog
- [ ] Data perusahaan konsisten di semua platform (nama, alamat, kontak)
- [ ] Press mention / backlink dari media online (ongoing)

---

## 9. Keamanan & Performa

### 9.1 Keamanan

| Area | Implementasi |
|---|---|
| Admin Auth | Supabase Auth (JWT) + Next.js middleware |
| API Rate Limiting | Upstash Ratelimit untuk `/api/chat` (30 req/jam/IP) |
| Input Sanitization | Zod validation di semua form dan API routes |
| SQL Injection | Supabase client (parameterized queries otomatis) |
| XSS | Next.js built-in escaping + Tiptap sanitization |
| CORS | API routes hanya menerima dari domain sendiri |
| Environment Variables | Semua secret di `.env.local`, tidak di-commit ke Git |
| RLS | Row Level Security aktif di semua tabel Supabase |
| HTTPS | Enforced via Vercel (otomatis) |

### 9.2 Target Performa (Core Web Vitals)

| Metrik | Target | Keterangan |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5 detik | SSG/ISR untuk halaman konten |
| FID / INP (Interaction to Next Paint) | < 200ms | Minimal JavaScript blocking |
| CLS (Cumulative Layout Shift) | < 0.1 | Explicit width/height pada gambar |
| Time to First Byte | < 800ms | Vercel Edge Network |
| Lighthouse Score | > 90 (semua kategori) | |

### 9.3 Optimasi Performa

```
Rendering Strategy:
- Homepage, About, FAQ    → SSG (Static Site Generation)
- Blog, Portfolio         → ISR (Incremental Static Regeneration, 1 jam)
- Admin Panel             → CSR (Client Side Rendering)
- API Routes              → Edge Functions (Vercel Edge)

Image Optimization:
- next/image untuk semua gambar
- WebP format otomatis
- Lazy loading default
- Explicit width & height

Bundle Optimization:
- Code splitting per route (Next.js otomatis)
- Minimal third-party libraries
- Tree shaking
```

---

## 10. Roadmap & Fase Pengembangan

### Phase 1 — Foundation (Minggu 1–2)
**Goal:** Infrastruktur siap, admin bisa login

- [ ] Setup repository GitHub
- [ ] Inisialisasi Next.js 15 + TypeScript + Tailwind
- [ ] Konfigurasi next-intl untuk routing EN/ID
- [ ] Konfigurasi next-themes untuk dark/light mode
- [ ] Setup Supabase project + jalankan migration SQL
- [ ] Setup Vercel deployment + environment variables
- [ ] Admin login page + proteksi route via middleware
- [ ] Layout admin panel (sidebar + navbar)

**Deliverable:** Admin dapat login, infrastruktur berjalan

---

### Phase 2 — Admin Panel Core (Minggu 2–3)
**Goal:** Admin dapat mengelola konten dasar

- [ ] Dashboard (statistik + summary)
- [ ] Services CRUD (EN + ID)
- [ ] Portfolio CRUD + upload gambar
- [ ] Team CRUD + upload avatar
- [ ] Media Library (upload + kelola)
- [ ] Site Settings (info perusahaan)

**Deliverable:** Admin panel fungsional untuk konten utama

---

### Phase 3 — Public Website (Minggu 3–4)
**Goal:** Website publik live dengan konten dinamis dari Supabase

- [ ] Layout utama + Navbar + Footer
- [ ] Homepage (semua sections)
- [ ] Halaman About
- [ ] Halaman Services + Service Detail
- [ ] Halaman Portfolio + Portfolio Detail
- [ ] Halaman Contact + form (simpan ke Supabase)
- [ ] Halaman FAQ
- [ ] Language switcher (EN ↔ ID)
- [ ] Dark/Light mode toggle
- [ ] Animasi Framer Motion

**Deliverable:** Website publik live dan fully functional

---

### Phase 4 — Blog & AI Features (Minggu 4–5)
**Goal:** Blog live + AI features aktif

- [ ] Blog Manager di admin (CRUD + rich text editor)
- [ ] AI Blog Generator (NVIDIA NIM)
- [ ] Auto-translate blog (EN ↔ ID)
- [ ] Halaman Blog publik + Blog Detail
- [ ] API Route chatbot (`/api/chat`)
- [ ] Chatbot UI widget (floating)
- [ ] Testimonials Manager + Approval flow
- [ ] Messages Inbox di admin

**Deliverable:** Blog bisa publish dengan AI, chatbot aktif

---

### Phase 5 — SEO, GEO & Polish (Minggu 5–6)
**Goal:** Siap untuk search engine dan AI search

- [ ] generateMetadata() di semua halaman (EN + ID)
- [ ] JSON-LD Structured Data di semua halaman
- [ ] hreflang tags
- [ ] next-sitemap konfigurasi (bilingual)
- [ ] robots.txt
- [ ] llms.txt (EN + ID)
- [ ] Chat Logs admin page
- [ ] Rate limiting chatbot API
- [ ] Vercel Analytics
- [ ] Lighthouse audit & optimasi
- [ ] Cross-browser testing
- [ ] Submit ke Google Search Console + Bing Webmaster

**Deliverable:** Website siap launch, SEO/GEO teroptimasi

---

### Phase 6 — Post-Launch (Bulan 2+)
**Ongoing:**
- Publikasi blog rutin (2x/minggu, menggunakan AI Generator)
- Monitor Google Search Console
- Monitor Vercel Analytics
- Iterasi berdasarkan feedback pengguna
- Daftar ke Google Business Profile
- Bangun backlink dari media dan direktori bisnis

---

## 11. Risiko & Mitigasi

| ID | Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|---|
| R-01 | NVIDIA NIM API downtime | Rendah | Tinggi | Fallback pesan error graceful, retry logic |
| R-02 | Konten AI tidak akurat | Sedang | Sedang | Review wajib sebelum publish di admin |
| R-03 | Supabase storage limit | Rendah | Sedang | Kompresi gambar sebelum upload, monitor usage |
| R-04 | Chatbot disalahgunakan (spam) | Sedang | Rendah | Rate limiting per IP, filter konten |
| R-05 | SEO tidak terindex | Rendah | Tinggi | Submit manual ke GSC, monitor indexing |
| R-06 | Admin panel tidak user-friendly | Sedang | Sedang | User testing dengan pemilik bisnis sebelum launch |
| R-07 | Biaya NVIDIA NIM membengkak | Rendah | Sedang | Rate limit ketat, monitor token usage per bulan |
| R-08 | Konten terjemahan AI tidak natural | Sedang | Sedang | Review wajib sebelum publish |

---

## 12. Kriteria Keberhasilan

### Teknis
- [ ] Lighthouse score > 90 di semua kategori (Performance, SEO, Accessibility, Best Practices)
- [ ] LCP < 2.5 detik di mobile dan desktop
- [ ] Zero broken links pada launch
- [ ] Semua halaman terindeks di Google dalam 2 minggu setelah launch

### Bisnis (3 Bulan Pertama)
- [ ] Muncul di halaman 1 Google untuk 5+ keyword target
- [ ] Website dikutip oleh minimal 1 platform AI Search (Perplexity, dll)
- [ ] Minimal 10 inquiry organik per bulan dari website
- [ ] Admin dapat membuat dan publish konten tanpa bantuan developer

### Pengalaman Pengguna
- [ ] Chatbot mampu menjawab 80%+ pertanyaan umum dengan benar
- [ ] Rata-rata session duration > 2 menit
- [ ] Bounce rate < 50%

---

## 13. Glosarium

| Istilah | Definisi |
|---|---|
| **GEO** | Generative Engine Optimization — optimasi konten agar muncul di hasil AI Search |
| **AI Search** | Platform pencarian berbasis AI seperti ChatGPT, Perplexity, Google AI Overviews |
| **SSG** | Static Site Generation — halaman di-render saat build, bukan saat request |
| **ISR** | Incremental Static Regeneration — SSG dengan pembaruan berkala |
| **RLS** | Row Level Security — fitur Supabase untuk kontrol akses data per baris |
| **NVIDIA NIM** | NVIDIA Inference Microservices — API model AI NVIDIA yang kompatibel dengan OpenAI SDK |
| **hreflang** | Tag HTML untuk memberi tahu mesin pencari versi bahasa dari sebuah halaman |
| **llms.txt** | File standar baru untuk memberi informasi tentang website kepada AI crawler |
| **i18n** | Internationalization — proses membuat aplikasi mendukung banyak bahasa |
| **E-E-A-T** | Experience, Expertise, Authoritativeness, Trust — standar kualitas konten Google |
| **Core Web Vitals** | Metrik performa web dari Google (LCP, INP, CLS) |
| **JSON-LD** | Format structured data yang dibaca mesin pencari untuk memahami konten |
| **shadcn/ui** | Library UI components React yang dapat dikustomisasi penuh |
| **Framer Motion** | Library animasi React yang powerful |

---

*Dokumen ini bersifat living document dan akan diperbarui seiring perkembangan project.*

**Versi History:**

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0.0 | 20 Mei 2026 | Dokumen awal dibuat |
