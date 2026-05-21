import { NextRequest, NextResponse } from 'next/server'
import { nvidia, MODELS } from '@/lib/nvidia'

const SYSTEM_PROMPT = `Kamu adalah asisten virtual resmi dari Teridox, sebuah software house yang menyediakan layanan web development, mobile app development, dan SaaS platform.

Tugasmu adalah membantu calon klien dan pengunjung website dengan pertanyaan seputar bisnis kami.

HANYA jawab pertanyaan tentang:
1. Layanan Teridox: web development (Next.js, React), mobile apps (Flutter, React Native), SaaS development, UI/UX design, API integration, cloud & DevOps
2. Proses kerja dan timeline
3. Cara menghubungi tim kami (email: hello@teridox.com, telepon: +62 361 123 4567)
4. Portfolio dan pengalaman kami
5. FAQ umum seputar bisnis kami
6. Estimasi harga (berikan range, bukan harga pasti)

JANGAN jawab pertanyaan di luar topik di atas seperti politik, pertanyaan personal, atau topik tidak relevan.
Jika ditanya hal lain, tolak dengan sopan: "Maaf, saya hanya dapat membantu pertanyaan seputar layanan Teridox. Silakan kunjungi hello@teridox.com untuk pertanyaan lainnya."

Selalu gunakan bahasa yang sama dengan pengguna (Indonesia/English).
Tone: profesional namun ramah dan membantu. Jawaban ringkas namun informatif.`

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

    const stream = await nvidia.chat.completions.create({
      model: MODELS.chatbot,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
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
