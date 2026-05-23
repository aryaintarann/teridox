-- ============================================================
-- Teridox — Supabase Migration
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- Aman dijalankan berulang (idempotent)
-- ============================================================

-- ============================================================
-- 1. TABLES
-- ============================================================

-- Contact messages (dari form kontak website)
CREATE TABLE IF NOT EXISTS contact_messages (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT        DEFAULT '',
  service     TEXT        DEFAULT '',
  message     TEXT        NOT NULL,
  locale      TEXT        DEFAULT 'id',
  read        BOOLEAN     DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title               TEXT        NOT NULL,
  title_en            TEXT        DEFAULT '',
  slug                TEXT        NOT NULL UNIQUE,
  content             TEXT        DEFAULT '',
  content_en          TEXT        DEFAULT '',
  meta_title          TEXT        DEFAULT '',
  meta_description    TEXT        DEFAULT '',
  tags                TEXT[]      DEFAULT '{}',
  reading_time_min    INTEGER     DEFAULT 5,
  published           BOOLEAN     DEFAULT false,
  category            TEXT        DEFAULT 'teknologi',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio items
CREATE TABLE IF NOT EXISTS portfolio_items (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT        NOT NULL,
  slug          TEXT        NOT NULL UNIQUE,
  description   TEXT        DEFAULT '',
  challenge     TEXT        DEFAULT '',
  solution      TEXT        DEFAULT '',
  outcome       TEXT        DEFAULT '',
  technologies  TEXT[]      DEFAULT '{}',
  image_url     TEXT        DEFAULT '',
  project_url   TEXT        DEFAULT '',
  category      TEXT        DEFAULT 'web',
  featured      BOOLEAN     DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  role        TEXT        DEFAULT '',
  company     TEXT        DEFAULT '',
  content     TEXT        NOT NULL,
  rating      INTEGER     DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url  TEXT        DEFAULT '',
  published   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT        NOT NULL,
  role            TEXT        NOT NULL,
  bio             TEXT        DEFAULT '',
  avatar_url      TEXT        DEFAULT '',
  linkedin_url    TEXT        DEFAULT '',
  display_order   INTEGER     DEFAULT 0,
  active          BOOLEAN     DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (key-value)
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT        PRIMARY KEY,
  value       TEXT        DEFAULT '',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Chat sessions (digunakan oleh halaman admin Chat Logs)
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  ip          TEXT        DEFAULT '',
  messages    JSONB       DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. DEFAULT SITE SETTINGS
-- ============================================================

INSERT INTO site_settings (key, value) VALUES
  ('company_name',    'Teridox'),
  ('company_email',   'hello@teridox.com'),
  ('company_phone',   '+62 812-3456-7890'),
  ('company_address', 'Bali, Indonesia'),
  ('whatsapp_number', '6281234567890'),
  ('instagram_url',   'https://instagram.com/teridox'),
  ('linkedin_url',    'https://linkedin.com/company/teridox'),
  ('tiktok_url',      ''),
  ('twitter_url',     ''),
  ('meta_description', 'Teridox adalah software house dari Bali yang menyediakan layanan web development, mobile app, software sales, dan AI integration.')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 3. TRIGGER — auto-update updated_at pada blog_posts
-- ============================================================

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE contact_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions     ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama sebelum buat ulang (agar idempotent di semua versi PG)
DROP POLICY IF EXISTS "admin_contact"      ON contact_messages;
DROP POLICY IF EXISTS "admin_blog"         ON blog_posts;
DROP POLICY IF EXISTS "admin_portfolio"    ON portfolio_items;
DROP POLICY IF EXISTS "admin_testimonials" ON testimonials;
DROP POLICY IF EXISTS "admin_team"         ON team_members;
DROP POLICY IF EXISTS "admin_settings"     ON site_settings;
DROP POLICY IF EXISTS "admin_chat"         ON chat_sessions;

DROP POLICY IF EXISTS "public_blog"        ON blog_posts;
DROP POLICY IF EXISTS "public_portfolio"   ON portfolio_items;
DROP POLICY IF EXISTS "public_testimonials"ON testimonials;
DROP POLICY IF EXISTS "public_team"        ON team_members;
DROP POLICY IF EXISTS "public_contact_insert" ON contact_messages;

-- Admin (authenticated): akses penuh ke semua tabel
CREATE POLICY "admin_contact"      ON contact_messages  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_blog"         ON blog_posts        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_portfolio"    ON portfolio_items   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_testimonials" ON testimonials      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_team"         ON team_members      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_settings"     ON site_settings     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_chat"         ON chat_sessions     FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Publik (anon): hanya baca konten yang dipublish
CREATE POLICY "public_blog"         ON blog_posts       FOR SELECT TO anon USING (published = true);
CREATE POLICY "public_portfolio"    ON portfolio_items  FOR SELECT TO anon USING (true);
CREATE POLICY "public_testimonials" ON testimonials     FOR SELECT TO anon USING (published = true);
CREATE POLICY "public_team"         ON team_members     FOR SELECT TO anon USING (active = true);

-- Publik (anon): hanya bisa insert pesan kontak
CREATE POLICY "public_contact_insert" ON contact_messages FOR INSERT TO anon WITH CHECK (true);

-- Services (dikelola dari admin, bilingual)
CREATE TABLE IF NOT EXISTS services (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT        NOT NULL UNIQUE,
  icon          TEXT        DEFAULT 'Globe',
  accent_color  TEXT        DEFAULT '#00C7B7',
  title         TEXT        NOT NULL DEFAULT '',
  title_en      TEXT        DEFAULT '',
  description   TEXT        DEFAULT '',
  description_en TEXT       DEFAULT '',
  features      JSONB       DEFAULT '[]',
  features_en   JSONB       DEFAULT '[]',
  process       JSONB       DEFAULT '[]',
  process_en    JSONB       DEFAULT '[]',
  faq           JSONB       DEFAULT '[]',
  faq_en        JSONB       DEFAULT '[]',
  display_order INTEGER     DEFAULT 0,
  active        BOOLEAN     DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. INDEXES (performa query publik)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_blog_slug       ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_published  ON blog_posts (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_port_slug       ON portfolio_items (slug);
CREATE INDEX IF NOT EXISTS idx_port_featured   ON portfolio_items (featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testi_published ON testimonials (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_order      ON team_members (active, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_contact_unread  ON contact_messages (read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_created    ON chat_sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_order  ON services (active, display_order ASC);

-- ============================================================
-- 6. RLS — services
-- ============================================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_services"  ON services;
DROP POLICY IF EXISTS "public_services" ON services;

CREATE POLICY "admin_services"  ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_services" ON services FOR SELECT TO anon USING (active = true);

-- ============================================================
-- 7. SEED DATA — services (dari messages/id.json + en.json)
-- Aman dijalankan berulang karena ON CONFLICT DO NOTHING
-- ============================================================

INSERT INTO services (slug, icon, accent_color, title, title_en, description, description_en, features, features_en, process, process_en, faq, faq_en, display_order) VALUES

('web-development', 'Globe', '#00C7B7',
 'Web Development', 'Web Development',
 'Website modern, cepat, dan responsif yang menghadirkan pengalaman pengguna terbaik dan mendorong pertumbuhan bisnis Anda secara signifikan.',
 'Modern, fast, and responsive websites that deliver the best user experience and drive significant business growth.',
 '["Landing Page & Company Profile","E-Commerce Platform","Custom Web Application","CMS & Headless Integration","API Development & Integration"]'::jsonb,
 '["Landing Page & Company Profile","E-Commerce Platform","Custom Web Application","CMS & Headless Integration","API Development & Integration"]'::jsonb,
 '[{"step":1,"title":"Discovery & Planning","desc":"Kami memahami kebutuhan bisnis dan tujuan Anda secara menyeluruh."},{"step":2,"title":"Design & Prototyping","desc":"Membuat wireframe dan desain UI yang disetujui klien sebelum development."},{"step":3,"title":"Development","desc":"Pengembangan dengan teknologi modern, clean code, dan best practices."},{"step":4,"title":"Testing & Launch","desc":"QA menyeluruh di berbagai perangkat dan browser sebelum go-live."}]'::jsonb,
 '[{"step":1,"title":"Discovery & Planning","desc":"We thoroughly understand your business needs and goals."},{"step":2,"title":"Design & Prototyping","desc":"We create wireframes and UI designs approved by the client before development."},{"step":3,"title":"Development","desc":"Development using modern technologies, clean code, and best practices."},{"step":4,"title":"Testing & Launch","desc":"Thorough QA across devices and browsers before going live."}]'::jsonb,
 '[{"q":"Berapa lama pembuatan website?","a":"Company profile: 2-4 minggu. Web app kompleks: 2-4 bulan."},{"q":"Teknologi apa yang digunakan?","a":"Next.js, React, TypeScript, Tailwind CSS, Supabase/PostgreSQL."},{"q":"Apakah ada revisi desain?","a":"Ya, termasuk 3 kali revisi desain tanpa biaya tambahan."}]'::jsonb,
 '[{"q":"How long does website development take?","a":"Company profile: 2-4 weeks. Complex web app: 2-4 months."},{"q":"What technologies do you use?","a":"Next.js, React, TypeScript, Tailwind CSS, Supabase/PostgreSQL."},{"q":"Are design revisions included?","a":"Yes, up to 3 design revisions are included at no extra cost."}]'::jsonb,
 0),

('mobile-development', 'Smartphone', '#6366F1',
 'Mobile App Development', 'Mobile App Development',
 'Aplikasi mobile iOS dan Android yang intuitif dengan performa tinggi, pengalaman pengguna yang mulus, dan fitur-fitur yang sesuai kebutuhan bisnis Anda.',
 'Intuitive iOS and Android mobile apps with high performance, seamless user experience, and features tailored to your business needs.',
 '["React Native Cross-Platform","Native iOS & Android","App Store & Play Store Publishing","Push Notifications & Deep Linking","Offline-First Capability"]'::jsonb,
 '["React Native Cross-Platform","Native iOS & Android","App Store & Play Store Publishing","Push Notifications & Deep Linking","Offline-First Capability"]'::jsonb,
 '[{"step":1,"title":"Konsultasi & Scope","desc":"Mendefinisikan fitur, user flow, dan target pengguna aplikasi."},{"step":2,"title":"UI/UX Design","desc":"Prototype interaktif yang bisa dicoba sebelum masuk tahap development."},{"step":3,"title":"Development Sprint","desc":"Agile development dengan demo dan review setiap 2 minggu."},{"step":4,"title":"QA & Submit","desc":"Testing di berbagai device dan submit ke App Store serta Google Play."}]'::jsonb,
 '[{"step":1,"title":"Consultation & Scope","desc":"Defining the features, user flow, and target audience of the app."},{"step":2,"title":"UI/UX Design","desc":"An interactive prototype you can try before development begins."},{"step":3,"title":"Development Sprints","desc":"Agile development with demos and reviews every 2 weeks."},{"step":4,"title":"QA & Submission","desc":"Testing on multiple devices and submission to the App Store and Google Play."}]'::jsonb,
 '[{"q":"Flutter atau React Native?","a":"Kami merekomendasikan Flutter untuk performa terbaik, React Native untuk integrasi ekosistem React."},{"q":"Berapa lama proses review App Store?","a":"Apple App Store: 1-3 hari kerja. Google Play: beberapa jam hingga 2 hari."},{"q":"Apakah ada support update di masa depan?","a":"Ya, tersedia paket maintenance dan update fitur secara berkala."}]'::jsonb,
 '[{"q":"Flutter or React Native?","a":"We recommend Flutter for best performance, React Native for React ecosystem integration."},{"q":"How long does the App Store review take?","a":"Apple App Store: 1-3 business days. Google Play: a few hours to 2 days."},{"q":"Is future update support available?","a":"Yes, we offer maintenance packages and periodic feature updates."}]'::jsonb,
 1),

('software-sales', 'Package', '#F59E0B',
 'Penjualan Software', 'Software Sales',
 'Kami menyediakan dan menjual solusi software siap pakai maupun berlisensi yang sesuai dengan kebutuhan operasional dan skala bisnis Anda.',
 'We provide and sell ready-to-use and licensed software solutions tailored to your operational needs and business scale.',
 '["Software Berlisensi Resmi","Software Manajemen Bisnis","Software Akuntansi & Keuangan","Software HR & Payroll","Instalasi & Onboarding"]'::jsonb,
 '["Official Licensed Software","Business Management Software","Accounting & Finance Software","HR & Payroll Software","Installation & Onboarding"]'::jsonb,
 '[{"step":1,"title":"Konsultasi Kebutuhan","desc":"Kami memahami kebutuhan operasional dan skala bisnis Anda."},{"step":2,"title":"Rekomendasi Produk","desc":"Kami merekomendasikan software yang paling sesuai dari katalog kami."},{"step":3,"title":"Pembelian & Lisensi","desc":"Proses pembelian dan aktivasi lisensi resmi yang mudah dan cepat."},{"step":4,"title":"Instalasi & Training","desc":"Instalasi, konfigurasi, dan pelatihan penggunaan untuk tim Anda."}]'::jsonb,
 '[{"step":1,"title":"Needs Consultation","desc":"We understand your operational needs and business scale."},{"step":2,"title":"Product Recommendation","desc":"We recommend the most suitable software from our catalog."},{"step":3,"title":"Purchase & License","desc":"Easy and fast purchase process and official license activation."},{"step":4,"title":"Installation & Training","desc":"Installation, configuration, and usage training for your team."}]'::jsonb,
 '[{"q":"Software apa saja yang tersedia?","a":"Kami menyediakan software manajemen bisnis, akuntansi, HR & payroll, dan lainnya."},{"q":"Apakah lisensi resmi dan terjamin?","a":"Ya, semua software yang kami jual berlisensi resmi dari vendor aslinya."},{"q":"Apakah ada dukungan teknis setelah pembelian?","a":"Ya, kami menyediakan support teknis untuk instalasi dan penggunaan setelah pembelian."}]'::jsonb,
 '[{"q":"What software is available?","a":"We provide business management, accounting, HR & payroll software, and more."},{"q":"Are the licenses official and guaranteed?","a":"Yes, all software we sell has official licenses from the original vendors."},{"q":"Is there technical support after purchase?","a":"Yes, we provide technical support for installation and usage after purchase."}]'::jsonb,
 2),

('ai-integration', 'BrainCircuit', '#8B5CF6',
 'AI Integration', 'AI Integration',
 'Integrasikan kecerdasan buatan ke dalam produk atau proses bisnis Anda untuk efisiensi maksimal, otomasi cerdas, dan keunggulan kompetitif.',
 'Integrate artificial intelligence into your products or business processes for maximum efficiency, smart automation, and competitive advantage.',
 '["Chatbot & Virtual Assistant","AI-Powered Analytics","Otomasi Proses dengan AI","Integrasi LLM & RAG","Computer Vision & OCR"]'::jsonb,
 '["Chatbot & Virtual Assistant","AI-Powered Analytics","Process Automation with AI","LLM & RAG Integration","Computer Vision & OCR"]'::jsonb,
 '[{"step":1,"title":"Analisis Proses Bisnis","desc":"Mengidentifikasi proses yang paling potensial untuk diotomasi atau ditingkatkan dengan AI."},{"step":2,"title":"Desain Solusi AI","desc":"Merancang arsitektur dan memilih model AI yang paling tepat untuk kebutuhan Anda."},{"step":3,"title":"Development & Integrasi","desc":"Membangun dan mengintegrasikan solusi AI ke dalam sistem atau aplikasi yang sudah ada."},{"step":4,"title":"Testing & Deployment","desc":"Pengujian menyeluruh, fine-tuning, dan deployment ke lingkungan produksi."}]'::jsonb,
 '[{"step":1,"title":"Business Process Analysis","desc":"Identifying processes with the highest potential for automation or AI enhancement."},{"step":2,"title":"AI Solution Design","desc":"Designing the architecture and selecting the most suitable AI model for your needs."},{"step":3,"title":"Development & Integration","desc":"Building and integrating the AI solution into your existing systems or applications."},{"step":4,"title":"Testing & Deployment","desc":"Thorough testing, fine-tuning, and deployment to the production environment."}]'::jsonb,
 '[{"q":"Solusi AI apa yang bisa diintegrasikan?","a":"Chatbot, analitik prediktif, otomasi dokumen, computer vision, dan integrasi model bahasa besar (LLM)."},{"q":"Berapa lama waktu integrasi AI?","a":"Tergantung kompleksitas, mulai dari 2 minggu untuk chatbot sederhana hingga beberapa bulan untuk solusi enterprise."},{"q":"Apakah perlu infrastruktur khusus?","a":"Tidak selalu. Kami menyesuaikan solusi dengan infrastruktur yang sudah ada atau merekomendasikan yang paling efisien."}]'::jsonb,
 '[{"q":"What AI solutions can be integrated?","a":"Chatbots, predictive analytics, document automation, computer vision, and large language model (LLM) integration."},{"q":"How long does AI integration take?","a":"Depends on complexity, from 2 weeks for a simple chatbot to several months for enterprise solutions."},{"q":"Is special infrastructure required?","a":"Not always. We adapt solutions to existing infrastructure or recommend the most efficient option."}]'::jsonb,
 3)

ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Selesai. Semua tabel, policy, trigger, index, dan storage siap.
-- ============================================================
