import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10),
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const supabase = await createAdminClient()
    await supabase.from('contact_messages').insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      message: data.message,
      locale: req.headers.get('accept-language')?.startsWith('id') ? 'id' : 'en',
    })

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@teridox.com',
      to: process.env.RESEND_TO_EMAIL ?? 'hello@teridox.com',
      subject: `[Teridox] Pesan baru dari ${data.name}`,
      html: `
        <h2>Pesan Baru dari Website Teridox</h2>
        <p><strong>Nama:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telepon:</strong> ${data.phone || '-'}</p>
        <p><strong>Layanan:</strong> ${data.service || '-'}</p>
        <p><strong>Pesan:</strong></p>
        <p>${data.message}</p>
      `,
    })

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@teridox.com',
      to: data.email,
      subject: 'Terima kasih telah menghubungi Teridox',
      html: `
        <h2>Halo ${data.name},</h2>
        <p>Terima kasih telah menghubungi kami. Kami telah menerima pesan Anda dan akan merespons dalam 1x24 jam kerja.</p>
        <p>Sementara itu, Anda bisa menjelajahi layanan kami di <a href="${process.env.NEXT_PUBLIC_APP_URL}">teridox.com</a>.</p>
        <br/>
        <p>Salam,<br/>Tim Teridox</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
