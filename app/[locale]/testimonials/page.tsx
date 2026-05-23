'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import { Star, CheckCircle, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Link } from '@/lib/i18n/navigation'

const COPY = {
  id: {
    badge: 'BERBAGI PENGALAMAN',
    title: 'Ceritakan Pengalaman\nAnda Bersama Kami',
    subtitle: 'Masukan Anda sangat berarti untuk kami dan membantu calon klien memilih solusi yang tepat.',
    name: 'Nama Lengkap *', namePlaceholder: 'Nama Anda',
    role: 'Jabatan', rolePlaceholder: 'CEO, Manager, Developer, dll',
    company: 'Perusahaan', companyPlaceholder: 'Nama perusahaan / instansi',
    content: 'Testimoni *', contentPlaceholder: 'Ceritakan pengalaman Anda bekerja sama dengan kami. Apa yang paling berkesan? Bagaimana proyek berjalan?',
    rating: 'Rating',
    submit: 'Kirim Testimoni',
    submitting: 'Mengirim...',
    successTitle: 'Terima Kasih!',
    successDesc: 'Testimoni Anda telah berhasil dikirim. Tim kami akan meninjaunya sebelum ditampilkan di website.',
    backHome: 'Kembali ke Beranda',
    errorName: 'Nama wajib diisi.',
    errorContent: 'Testimoni wajib diisi (minimal 20 karakter).',
    note: 'Testimoni akan ditinjau oleh tim kami sebelum dipublikasikan.',
  },
  en: {
    badge: 'SHARE YOUR EXPERIENCE',
    title: 'Tell Us About Your\nExperience With Us',
    subtitle: 'Your feedback means a lot to us and helps potential clients choose the right solution.',
    name: 'Full Name *', namePlaceholder: 'Your name',
    role: 'Job Title', rolePlaceholder: 'CEO, Manager, Developer, etc.',
    company: 'Company', companyPlaceholder: 'Company / organization name',
    content: 'Testimonial *', contentPlaceholder: 'Tell us about your experience working with us. What stood out the most? How did the project go?',
    rating: 'Rating',
    submit: 'Submit Testimonial',
    submitting: 'Submitting...',
    successTitle: 'Thank You!',
    successDesc: 'Your testimonial has been submitted successfully. Our team will review it before publishing.',
    backHome: 'Back to Home',
    errorName: 'Name is required.',
    errorContent: 'Testimonial is required (minimum 20 characters).',
    note: 'Your testimonial will be reviewed by our team before being published.',
  },
}

export default function TestimonialSubmitPage() {
  const locale = useLocale()
  const c = locale === 'en' ? COPY.en : COPY.id

  const [form, setForm] = useState({ name: '', role: '', company: '', content: '', rating: 5 })
  const [errors, setErrors] = useState<{ name?: string; content?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  function set(field: string, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: { name?: string; content?: string } = {}
    if (!form.name.trim()) newErrors.name = c.errorName
    if (!form.content.trim() || form.content.trim().length < 20) newErrors.content = c.errorContent
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setErrors({ content: data.error ?? 'Gagal mengirim.' })
      }
    } catch {
      setErrors({ content: 'Gagal mengirim. Coba lagi.' })
    }
    setSubmitting(false)
  }

  return (
    <div className="pt-16 min-h-screen" style={{ background: 'var(--muted)' }}>
      <div className="section-padding">
        <div className="container-max max-w-2xl">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border rounded-3xl p-12 text-center shadow-sm"
              >
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3">{c.successTitle}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">{c.successDesc}</p>
                <Button asChild className="rounded-xl px-8">
                  <Link href="/">{c.backHome}</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {c.badge}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4" style={{ whiteSpace: 'pre-line' }}>
                    {c.title}
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-lg mx-auto">{c.subtitle}</p>
                </div>

                {/* Form card */}
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">{c.name}</Label>
                    <Input
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder={c.namePlaceholder}
                      className={errors.name ? 'border-red-400' : ''}
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>

                  {/* Role + Company */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">{c.role}</Label>
                      <Input value={form.role} onChange={e => set('role', e.target.value)} placeholder={c.rolePlaceholder} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">{c.company}</Label>
                      <Input value={form.company} onChange={e => set('company', e.target.value)} placeholder={c.companyPlaceholder} />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{c.rating}</Label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => set('rating', s)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star className={`h-8 w-8 transition-colors ${s <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground hover:text-yellow-300'}`} />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground self-center">{form.rating}/5</span>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">{c.content}</Label>
                    <Textarea
                      value={form.content}
                      onChange={e => set('content', e.target.value)}
                      placeholder={c.contentPlaceholder}
                      rows={5}
                      className={`resize-none ${errors.content ? 'border-red-400' : ''}`}
                    />
                    <div className="flex items-center justify-between">
                      {errors.content
                        ? <p className="text-xs text-red-500">{errors.content}</p>
                        : <span />
                      }
                      <p className="text-xs text-muted-foreground">{form.content.length} karakter</p>
                    </div>
                  </div>

                  {/* Note */}
                  <p className="text-xs text-muted-foreground text-center border border-dashed border-border rounded-xl py-3 px-4">
                    {c.note}
                  </p>

                  {/* Submit */}
                  <Button type="submit" disabled={submitting} className="w-full rounded-xl h-12 text-base font-semibold gap-2">
                    {submitting
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> {c.submitting}</>
                      : <><Send className="h-4 w-4" /> {c.submit}</>
                    }
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
