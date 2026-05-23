import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, role, company, content, rating } = body

    if (!name?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Nama dan testimoni wajib diisi.' }, { status: 400 })
    }
    if (content.trim().length < 20) {
      return NextResponse.json({ error: 'Testimoni terlalu singkat (minimal 20 karakter).' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from('testimonials').insert({
      name: name.trim(),
      role: role?.trim() ?? '',
      company: company?.trim() ?? '',
      content: content.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      avatar_url: '',
      published: false, // admin harus approve dulu
    })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal mengirim testimoni.' }, { status: 500 })
  }
}
