'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Shield, Zap, Users, Award } from 'lucide-react'
import CTASection from '@/components/sections/CTASection'

const iconMap: Record<string, React.ElementType> = { Shield, Zap, Users, Award }

const team = [
  { name: 'Rizky Pratama', role: 'CEO & Co-Founder', avatar: 'RP', bio: '10+ tahun di industri software' },
  { name: 'Dewi Sari', role: 'CTO', avatar: 'DS', bio: 'Ahli cloud architecture & DevOps' },
  { name: 'Andi Kurniawan', role: 'Lead Designer', avatar: 'AK', bio: 'Spesialis UI/UX & product design' },
  { name: 'Mira Lestari', role: 'Head of Mobile', avatar: 'ML', bio: 'Flutter & React Native expert' },
  { name: 'Fajar Hidayat', role: 'Backend Lead', avatar: 'FH', bio: 'Node.js, PostgreSQL, AWS' },
  { name: 'Siti Rahayu', role: 'Project Manager', avatar: 'SR', bio: 'PMP certified, agile specialist' },
]

export default function AboutPage() {
  const t = useTranslations('about')
  const values = t.raw('values.items') as Array<{ icon: string; title: string; desc: string }>
  const timeline = t.raw('timeline.items') as Array<{ year: string; title: string; desc: string }>

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="section-padding" style={{ background: 'var(--muted)' }}>
        <div className="container-max text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-4"
          >
            {t('title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-max max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-4">{t('story.title')}</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{t('story.content')}</p>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(['mission', 'vision'] as const).map((key) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <h3 className="text-xl font-bold mb-3 text-primary">{t(`${key}.title`)}</h3>
                <p className="text-muted-foreground leading-relaxed">{t(`${key}.content`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-max">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            {t('values.title')}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = iconMap[v.icon] || Shield
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6 rounded-2xl border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm">{v.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">{t('team.title')}</h2>
            <p className="text-muted-foreground">{t('team.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  {member.avatar}
                </div>
                <p className="font-semibold text-sm">{member.name}</p>
                <p className="text-primary text-xs">{member.role}</p>
                <p className="text-muted-foreground text-xs mt-1">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-max">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            {t('timeline.title')}
          </motion.h2>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-6 pl-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center z-10">
                    {item.year.slice(-2)}
                  </div>
                  <div className="pb-2">
                    <span className="text-xs font-bold text-primary">{item.year}</span>
                    <h3 className="font-bold mt-0.5">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
