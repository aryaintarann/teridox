'use client'
import { useEffect } from 'react'

export function FontAwesomeLoader() {
  useEffect(() => {
    if (document.querySelector('link[data-fa]')) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css'
    link.crossOrigin = 'anonymous'
    link.setAttribute('data-fa', '1')
    document.head.appendChild(link)
  }, [])
  return null
}
