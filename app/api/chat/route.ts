import { NextRequest, NextResponse } from 'next/server'
import { nvidia, MODELS } from '@/lib/nvidia'
import { createAdminClient } from '@/lib/supabase/server'

// Cache the built system prompt for 5 minutes to avoid DB hit on every message
let promptCache: { text: string; expiresAt: number } | null = null

async function buildSystemPrompt(): Promise<string> {
  if (promptCache && Date.now() < promptCache.expiresAt) return promptCache.text

  const supabase = await createAdminClient()

  const [{ data: settingsData }, { data: servicesData }] = await Promise.all([
    supabase.from('site_settings').select('key,value'),
    supabase.from('services').select('title,description').eq('active', true).order('display_order'),
  ])

  const s: Record<string, string> = {}
  ;(settingsData ?? []).forEach(({ key, value }: { key: string; value: string }) => { s[key] = value })

  const companyName = s.company_name    || 'Teridox'
  const email       = s.company_email   || 'hello@teridox.com'
  const phone       = s.company_phone   || '+62 361 123 4567'
  const address     = s.company_address || 'Bali, Indonesia'
  const hours       = s.company_hours   || 'Senin – Jumat: 09:00 – 18:00 WITA'
  const description = s.footer_description || 'software house yang menyediakan solusi teknologi untuk bisnis'
  const waLine      = s.whatsapp_number ? `\n- WhatsApp: +${s.whatsapp_number}` : ''

  const servicesList = (servicesData ?? [])
    .map((sv: { title: string; description: string }) => `- ${sv.title}: ${sv.description}`)
    .join('\n')

  const prompt = `Kamu adalah asisten virtual resmi dari ${companyName}, ${description}.

Tugasmu adalah membantu calon klien dan pengunjung website dengan pertanyaan seputar layanan kami.

LAYANAN YANG KAMI TAWARKAN:
${servicesList || '- Informasi layanan sedang diperbarui.'}

INFORMASI KONTAK:
- Email: ${email}
- Telepon: ${phone}${waLine}
- Alamat: ${address}
- Jam operasional: ${hours}

PANDUAN MENJAWAB:
1. Jawab pertanyaan tentang layanan di atas, proses kerja, timeline, estimasi harga (range, bukan harga pasti), portfolio, dan cara menghubungi kami.
2. Jika ditanya estimasi harga, berikan gambaran umum berdasarkan kompleksitas — hindari angka pasti.
3. Jika pertanyaan di luar topik bisnis (politik, hal pribadi, topik tidak relevan), tolak dengan sopan: "Maaf, saya hanya dapat membantu pertanyaan seputar layanan ${companyName}. Silakan hubungi kami di ${email} untuk pertanyaan lainnya."
4. Selalu gunakan bahasa yang sama dengan pengguna (Indonesia atau English).
5. Tone: profesional, ramah, dan ringkas.`

  promptCache = { text: prompt, expiresAt: Date.now() + 5 * 60 * 1000 }
  return prompt
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (limit) {
    if (now < limit.resetAt && limit.count >= 30) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }
    if (now >= limit.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + 3600_000 })
    } else {
      rateLimitMap.set(ip, { count: limit.count + 1, resetAt: limit.resetAt })
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600_000 })
  }

  try {
    const { messages } = await req.json()
    const systemPrompt = await buildSystemPrompt()

    const stream = await nvidia.chat.completions.create({
      model: MODELS.chatbot,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10),
      ],
      max_tokens: 512,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const data = JSON.stringify(chunk)
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}
