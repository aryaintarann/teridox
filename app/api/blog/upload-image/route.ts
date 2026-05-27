import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const BUCKET = 'blog-images'
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif']

function detectMimeFromMagicBytes(buf: Buffer): string | null {
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg'
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'image/png'
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return 'image/webp'
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'image/gif'
  return null
}

export async function POST(req: NextRequest) {
  // Auth check — middleware excludes /api/* so we verify here
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0)
      return NextResponse.json({ error: 'File tidak valid' }, { status: 400 })

    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ error: 'Format tidak didukung (jpg, png, webp, gif)' }, { status: 400 })

    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: 'Ukuran file melebihi 5 MB' }, { status: 400 })

    // Validate extension
    const ext = (file.name.split('.').pop() ?? '').toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext))
      return NextResponse.json({ error: 'Ekstensi tidak diizinkan' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())

    // Validate magic bytes — do not trust file.type from client
    const detectedMime = detectMimeFromMagicBytes(buffer)
    if (!detectedMime)
      return NextResponse.json({ error: 'Isi file bukan gambar yang valid' }, { status: 400 })

    const safeExt = detectedMime === 'image/jpeg' ? 'jpg'
      : detectedMime === 'image/png' ? 'png'
      : detectedMime === 'image/webp' ? 'webp'
      : 'gif'

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`

    const adminSupabase = await createAdminClient()

    await adminSupabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_SIZE,
      allowedMimeTypes: ALLOWED_TYPES,
    }).catch(() => {})

    const { error } = await adminSupabase.storage
      .from(BUCKET)
      .upload(filename, buffer, { contentType: detectedMime, upsert: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: { publicUrl } } = adminSupabase.storage.from(BUCKET).getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl })
  } catch {
    return NextResponse.json({ error: 'Upload gagal' }, { status: 500 })
  }
}
