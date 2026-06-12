import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://teridox.com/id',
  },
}

export default function RootPage() {
  redirect('/id')
}
