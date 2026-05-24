import { NextRequest, NextResponse } from 'next/server'
import { nvidia, MODELS } from '@/lib/nvidia'
import { createClient } from '@supabase/supabase-js'

// Singleton — no cookies needed, service role bypasses RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Cache built prompt per warm instance (avoids repeated DB round-trips)
let promptCache: { text: string; expiresAt: number } | null = null

async function buildSystemPrompt(): Promise<string> {
  if (promptCache && Date.now() < promptCache.expiresAt) return promptCache.text

  const [{ data: settingsData }, { data: servicesData }] = await Promise.all([
    supabaseAdmin.from('site_settings').select('key,value'),
    supabaseAdmin.from('services').select('title,description').eq('active', true).order('display_order'),
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

  const prompt = `You are the official virtual assistant for ${companyName}, ${description}.

LANGUAGE RULE (HIGHEST PRIORITY):
- Detect the language of the user's message.
- If the user writes in English → reply ONLY in English.
- If the user writes in Indonesian → reply ONLY in Indonesian.
- Never mix languages in a single reply.

YOUR ROLE:
Help prospective clients and website visitors with questions about our business.

SERVICES WE OFFER:
${servicesList || '- Service information is being updated.'}

CONTACT INFORMATION:
- Email: ${email}
- Phone: ${phone}${waLine}
- Address: ${address}
- Business hours: ${hours}

ANSWERING GUIDELINES:
1. Answer questions about the services above, our work process, timeline, price estimates (ranges only, never exact figures), portfolio, and how to contact us.
2. For out-of-scope questions (politics, personal matters, unrelated topics), politely decline — in the same language the user used.
3. Tone: professional, friendly, and concise.`

  promptCache = { text: prompt, expiresAt: Date.now() + 10 * 60 * 1000 }
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
