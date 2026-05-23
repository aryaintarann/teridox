import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const BUCKET = 'blog-images'
const NVIDIA_IMAGE_API = 'https://ai.api.nvidia.com/v1/genai/stabilityai/sdxl-turbo'

export async function POST(req: NextRequest) {
  try {
    const { prompt, articleTitle } = await req.json() as { prompt?: string; articleTitle?: string }

    const finalPrompt = prompt?.trim() ||
      `Professional blog cover image for article titled "${articleTitle}", modern minimalist design, clean composition, technology and business theme, high quality digital art, 4K`

    const nvRes = await fetch(NVIDIA_IMAGE_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text_prompts: [{ text: finalPrompt, weight: 1 }],
        cfg_scale: 7,
        sampler: 'K_EULER_ANCESTRAL',
        seed: 0,
        steps: 25,
        width: 1024,
        height: 576,
      }),
    })

    if (!nvRes.ok) {
      const errText = await nvRes.text()
      return NextResponse.json({ error: `NVIDIA API: ${errText}` }, { status: 502 })
    }

    const nvData = await nvRes.json()
    const base64 = nvData.artifacts?.[0]?.base64 as string | undefined

    if (!base64) return NextResponse.json({ error: 'Tidak ada gambar dari AI' }, { status: 502 })

    const buffer = Buffer.from(base64, 'base64')
    const filename = `ai-${Date.now()}-${Math.random().toString(36).slice(2)}.png`

    const supabase = await createAdminClient()

    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    }).catch(() => {})

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, { contentType: 'image/png', upsert: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl })
  } catch {
    return NextResponse.json({ error: 'Generate gambar gagal' }, { status: 500 })
  }
}
