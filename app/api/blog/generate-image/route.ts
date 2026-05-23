import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const BUCKET = 'blog-images'

// Models tried in order — first one that responds with an image wins
const MODELS = [
  {
    url: 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell',
    body: (prompt: string) => ({
      prompt,
      width: 1024,
      height: 576,
      num_inference_steps: 4,
      seed: 0,
      guidance_scale: 0,
    }),
  },
  {
    url: 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev',
    body: (prompt: string) => ({
      prompt,
      width: 1024,
      height: 576,
      num_inference_steps: 20,
      seed: 0,
      guidance_scale: 3.5,
    }),
  },
  {
    url: 'https://ai.api.nvidia.com/v1/genai/stabilityai/sdxl-turbo',
    body: (prompt: string) => ({
      text_prompts: [{ text: prompt, weight: 1 }],
      cfg_scale: 7,
      sampler: 'K_EULER_ANCESTRAL',
      seed: 0,
      steps: 20,
      width: 1024,
      height: 576,
    }),
  },
]

function extractBase64(data: Record<string, unknown>): string | undefined {
  // FLUX / SD3 format: artifacts[0].base64
  const artifacts = data.artifacts as Array<{ base64?: string }> | undefined
  if (artifacts?.[0]?.base64) return artifacts[0].base64
  // OpenAI-compatible format: data[0].b64_json
  const dataArr = data.data as Array<{ b64_json?: string }> | undefined
  if (dataArr?.[0]?.b64_json) return dataArr[0].b64_json
  return undefined
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, articleTitle } = await req.json() as { prompt?: string; articleTitle?: string }

    const finalPrompt = prompt?.trim() ||
      `Professional blog cover image for article "${articleTitle}", modern minimalist style, clean composition, technology and business theme, high quality digital art`

    let base64: string | undefined
    let lastError = ''

    for (const model of MODELS) {
      const nvRes = await fetch(model.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(model.body(finalPrompt)),
      })

      if (!nvRes.ok) {
        lastError = await nvRes.text()
        continue
      }

      const nvData = await nvRes.json() as Record<string, unknown>
      base64 = extractBase64(nvData)
      if (base64) break
      lastError = 'No image data in response'
    }

    if (!base64) {
      return NextResponse.json({ error: `Semua model gagal. Error terakhir: ${lastError}` }, { status: 502 })
    }

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
