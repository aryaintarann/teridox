export interface BlogPost {
  id: string
  title: string
  title_en: string
  slug: string
  content: string
  content_en: string
  meta_title: string
  meta_description: string
  tags: string[]
  reading_time_min: number
  published: boolean
  category: string
  created_at: string
  updated_at: string
}

export interface PortfolioItem {
  id: string
  title: string
  slug: string
  description: string
  challenge: string
  solution: string
  outcome: string
  technologies: string[]
  image_url: string
  project_url: string
  category: string
  featured: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar_url: string
  published: boolean
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar_url: string
  linkedin_url: string
  display_order: number
  active: boolean
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  locale: string
  read: boolean
  created_at: string
}

export interface SiteSetting {
  key: string
  value: string
  updated_at: string
}
