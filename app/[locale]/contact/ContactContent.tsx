'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Mail, Phone, Clock, Loader2, CheckCircle } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useSiteSettings } from '@/lib/context/SiteSettingsContext'

type FormData = { name: string; email: string; phone?: string; service?: string; message: string }

interface ServiceOption { title: string; title_en: string }

export default function ContactContent() {
  const t = useTranslations('contact')
  const settings = useSiteSettings()

  const schema = useMemo(() => z.object({
    name: z.string().min(2, t('form.errors.nameTooShort')),
    email: z.string().email(t('form.errors.emailInvalid')),
    phone: z.string().optional(),
    service: z.string().optional(),
    message: z.string().min(10, t('form.errors.messageTooShort')),
  }), [t])
  const { locale } = useParams<{ locale: string }>()
  const [submitted, setSubmitted] = useState(false)
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([])

  useEffect(() => {
    createClient()
      .from('services')
      .select('title,title_en')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => setServiceOptions(data ?? []))
  }, [])

  const email   = settings.company_email   || t('info.email')
  const phone   = settings.company_phone   || t('info.phone')
  const address = settings.company_address || t('info.address')
  const hours   = settings.company_hours   || t('info.hours')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) setSubmitted(true)
    } catch {}
  }

  return (
    <div className="pt-16">
      <section className="section-padding" style={{ background: 'var(--muted)' }}>
        <div className="container-max text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-extrabold mb-4">
            {t('title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-64 gap-4">
                <CheckCircle className="h-16 w-16 text-emerald-500" />
                <p className="text-lg font-semibold">{t('form.success')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label>{t('form.name')}</Label>
                    <Input {...register('name')} placeholder={t('form.namePlaceholder')} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('form.email')}</Label>
                    <Input {...register('email')} type="email" placeholder={t('form.emailPlaceholder')} />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label>{t('form.phone')}</Label>
                    <Input {...register('phone')} placeholder={t('form.phonePlaceholder')} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('form.service')}</Label>
                    <select {...register('service')} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">{t('form.servicePlaceholder')}</option>
                      {serviceOptions.map((s) => {
                        const label = locale === 'en' ? s.title_en : s.title
                        return <option key={s.title} value={label}>{label}</option>
                      })}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{t('form.message')}</Label>
                  <Textarea {...register('message')} placeholder={t('form.messagePlaceholder')} rows={5} />
                  {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                </div>
                <Button type="submit" size="lg" className="rounded-xl px-8 gap-2" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? t('form.submitting') : t('form.submit')}
                </Button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: MapPin, label: t('info.labelAddress'), value: address },
              { icon: Mail,  label: t('info.labelEmail'),   value: email },
              { icon: Phone, label: t('info.labelPhone'),   value: phone },
              { icon: Clock, label: t('info.labelHours'),   value: hours },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-muted-foreground text-sm">{value}</p>
                </div>
              </div>
            ))}

            {/* Maps placeholder */}
            <div className="rounded-2xl overflow-hidden border border-border bg-muted h-52 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Bali, Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
