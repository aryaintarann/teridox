import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const MAX_MESSAGES = 100
const MAX_MESSAGE_LENGTH = 10_000

export async function POST(req: NextRequest) {
  try {
    const { sessionId, messages } = await req.json()
    if (!sessionId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ ok: false })
    }

    // Validate sessionId must be a proper UUID — prevents arbitrary key injection
    if (!UUID_REGEX.test(sessionId)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    // Cap array size and individual message length to prevent data poisoning
    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    for (const msg of messages) {
      if (typeof msg?.content === 'string' && msg.content.length > MAX_MESSAGE_LENGTH) {
        return NextResponse.json({ ok: false }, { status: 400 })
      }
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const supabase = await createAdminClient()

    await supabase
      .from('chat_sessions')
      .upsert({ id: sessionId, ip, messages }, { onConflict: 'id' })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
