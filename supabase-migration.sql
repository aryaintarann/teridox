-- ============================================
-- Teridox Admin Panel - Database Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Extend contact_messages (if it exists)
ALTER TABLE IF EXISTS contact_messages
  ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  slug TEXT UNIQUE NOT NULL,
  content TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  reading_time_min INTEGER DEFAULT 5,
  published BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'teknologi',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Portfolio items
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  challenge TEXT DEFAULT '',
  solution TEXT DEFAULT '',
  outcome TEXT DEFAULT '',
  technologies TEXT[] DEFAULT '{}',
  image_url TEXT DEFAULT '',
  project_url TEXT DEFAULT '',
  category TEXT DEFAULT 'web',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  company TEXT DEFAULT '',
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url TEXT DEFAULT '',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Team members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Site settings (key-value)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default settings
INSERT INTO site_settings (key, value) VALUES
  ('company_name', 'Teridox'),
  ('company_email', 'hello@teridox.com'),
  ('company_phone', '+62 812-3456-7890'),
  ('company_address', 'Bali, Indonesia'),
  ('whatsapp_number', '6281234567890'),
  ('instagram_url', 'https://instagram.com/teridox'),
  ('linkedin_url', 'https://linkedin.com/company/teridox')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Authenticated admins: full access
CREATE POLICY IF NOT EXISTS "admin_blog" ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "admin_portfolio" ON portfolio_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "admin_testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "admin_team" ON team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "admin_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "admin_messages" ON contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public: read published content
CREATE POLICY IF NOT EXISTS "public_blog" ON blog_posts FOR SELECT TO anon USING (published = true);
CREATE POLICY IF NOT EXISTS "public_portfolio" ON portfolio_items FOR SELECT TO anon USING (true);
CREATE POLICY IF NOT EXISTS "public_testimonials" ON testimonials FOR SELECT TO anon USING (published = true);
CREATE POLICY IF NOT EXISTS "public_team" ON team_members FOR SELECT TO anon USING (active = true);

-- Public: insert contact messages
CREATE POLICY IF NOT EXISTS "public_insert_contact" ON contact_messages FOR INSERT TO anon WITH CHECK (true);

-- ============================================
-- Updated_at trigger for blog_posts
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
