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

-- ============================================================
-- Selesai. Semua tabel, policy, trigger, dan index siap.
-- ============================================================
