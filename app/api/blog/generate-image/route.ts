import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

const BUCKET = 'blog-images'

type ImageResult = { buffer: Buffer; contentType: string }

// 1. Try NVIDIA's OpenAI-compatible image endpoint (same key as text generation)
async function tryNvidia(prompt: string): Promise<ImageResult | null> {
  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/flux.1-schnell',
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) return null
    const data = await res.json() as { data?: Array<{ b64_json?: string }> }
    const b64 = data.data?.[0]?.b64_json
    if (!b64) return null
    return { buffer: Buffer.from(b64, 'base64'), contentType: 'image/png' }
  } catch {
    return null
  }
}

// 2. Pollinations.ai — free FLUX-powered image gen, no API key needed
async function tryPollinations(prompt: string): Promise<ImageResult | null> {
  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=576&model=flux&nologo=true&seed=${Date.now()}`
    const res = await fetch(url, { signal: AbortSignal.timeout(55_000) })
    if (!res.ok) return null
    const ab = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') ?? 'image/jpeg'
    return { buffer: Buffer.from(ab), contentType }
  } catch {
    return null
  }
}

async function uploadToSupabase(buffer: Buffer, contentType: string): Promise<string> {
  const ext = contentType.includes('png') ? 'png' : 'jpg'
  const filename = `ai-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const supabase = await createAdminClient()

  await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  }).catch(() => {})

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType, upsert: false })

  if (error) throw new Error(error.message)

  return supabase.storage.from(BUCKET).getPublicUrl(filename).data.publicUrl
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, articleTitle } = await req.json() as { prompt?: string; articleTitle?: string }

    const finalPrompt = prompt?.trim() ||
      `Professional blog cover image for article "${articleTitle}", modern minimalist style, technology and business theme, clean composition, high quality digital art`

    const result = await tryNvidia(finalPrompt) ?? await tryPollinations(finalPrompt)

    if (!result) {
      return NextResponse.json({ error: 'Semua layanan image generation tidak tersedia saat ini' }, { status: 502 })
    }

    const publicUrl = await uploadToSupabase(result.buffer, result.contentType)
    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Generate gambar gagal'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
