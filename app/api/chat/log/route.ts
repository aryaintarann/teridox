import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { sessionId, messages } = await req.json()
    if (!sessionId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ ok: false })
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
