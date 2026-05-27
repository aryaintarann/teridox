import { NextRequest, NextResponse } from 'next/server'
import { nvidia, MODELS } from '@/lib/nvidia'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  topic: z.string().min(3),
  language: z.enum(['id', 'en']),
  length: z.enum(['short', 'medium', 'long']),
  tone: z.enum(['informative', 'persuasive', 'tutorial']),
})

const wordCounts = { short: 800, medium: 1500, long: 2500 }

export async function POST(req: NextRequest) {
  // Auth check — middleware excludes /api/* so we verify here
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { topic, language, length, tone } = schema.parse(body)

    const wordCount = wordCounts[length]
    const langName = language === 'id' ? 'Bahasa Indonesia' : 'English'

    const generatePrompt = `Kamu adalah content writer profesional untuk Teridox, sebuah software house.

Buat artikel blog SEO-friendly tentang: "${topic}"

Persyaratan:
- Bahasa: ${langName}
- Panjang: sekitar ${wordCount} kata
- Tone: ${tone}
- Sertakan heading H2 dan H3
- Sertakan section FAQ di bagian akhir (3-5 pertanyaan)
- Optimasi untuk keyword utama: ${topic}

Output dalam format JSON berikut:
{
  "title": "Judul SEO-friendly",
  "slug": "slug-url-friendly",
  "metaTitle": "Meta title max 60 karakter",
  "metaDescription": "Meta description max 160 karakter",
  "content": "Konten artikel dalam markdown",
  "faq": [{"q": "pertanyaan", "a": "jawaban"}],
  "tags": ["tag1", "tag2", "tag3"],
  "readingTimeMin": 8
}`

    const completion = await nvidia.chat.completions.create({
      model: MODELS.blogGen,
      messages: [{ role: 'user', content: generatePrompt }],
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content ?? '{}')

    if (language === 'id') {
      const translatePrompt = `Translate the following JSON content from Indonesian to English. Keep the JSON structure exactly the same. Only translate the text values (title, metaTitle, metaDescription, content, faq questions and answers). Keep slug and tags in their original form or transliterate appropriately.

JSON to translate:
${JSON.stringify(result, null, 2)}`

      const translated = await nvidia.chat.completions.create({
        model: MODELS.translate,
        messages: [{ role: 'user', content: translatePrompt }],
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      })

      const translatedResult = JSON.parse(translated.choices[0].message.content ?? '{}')
      return NextResponse.json({ original: result, translated: translatedResult, sourceLang: language })
    } else {
      const translatePrompt = `Translate the following JSON content from English to Bahasa Indonesia. Keep the JSON structure exactly the same. Only translate the text values (title, metaTitle, metaDescription, content, faq questions and answers). Keep slug and tags in their original form or transliterate appropriately.

JSON to translate:
${JSON.stringify(result, null, 2)}`

      const translated = await nvidia.chat.completions.create({
        model: MODELS.translate,
        messages: [{ role: 'user', content: translatePrompt }],
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      })

      const translatedResult = JSON.parse(translated.choices[0].message.content ?? '{}')
      return NextResponse.json({ original: result, translated: translatedResult, sourceLang: language })
    }
  } catch (error) {
    console.error('Blog generate error:', error)
    return NextResponse.json({ error: 'Failed to generate blog' }, { status: 500 })
  }
}
