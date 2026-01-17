'use client'

import React, {useEffect, useState} from 'react'
import {useParams, usePathname} from 'next/navigation'

import {CBreadcrumb, CBreadcrumbItem, CButton} from '@coreui/react'
import {Lang} from '@/lib/i18n'

const humanize = (text: string) =>
  text
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

export default function AppBreadcrumb() {
  const pathname = usePathname()
  const {lang} = useParams<{ lang: Lang }>()
  const [dict, setDict] = useState<any>(null)

  // Load translation dictionary (client-safe)
  useEffect(() => {
    import(`@/lang/${lang}.json`).then((m) => {
      setDict(m.default)
    })
  }, [lang])

  if (!pathname || !dict) return null

  // Remove empty + lang segment
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== lang)

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + [lang, ...segments.slice(0, index + 1)].join('/')
    const name =
      dict.menu?.[segment] ||
      humanize(segment)
    return {href, name, active: index === segments.length - 1}
  })

  // Export JSON from localStorage
  const handleExport = () => {
    const raw = localStorage.getItem('uploadedJson')
    if (!raw) {
      alert('No data to export')
      return
    }

    const blob = new Blob([raw], {type: 'application/json;charset=utf-8'})
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'GameData.es3'
    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="d-flex align-items-center mb-4">
      {/* LEFT: Breadcrumb */}
      <CBreadcrumb className="mb-0">
        <CBreadcrumbItem href={`/${lang}`}>
          {dict.menu?.home || 'Home'}
        </CBreadcrumbItem>

        {breadcrumbs.map((b, index) => (
          <CBreadcrumbItem
            key={index}
            {...(b.active ? {active: true} : {href: b.href})}
          >
            {b.name}
          </CBreadcrumbItem>
        ))}
      </CBreadcrumb>

      {/* RIGHT: Export button */}
      <div className="ms-auto">
        <CButton
          className="btn btn-primary"
          // color="success"
          variant="outline"
          size="sm"
          onClick={handleExport}
        >
          {dict.common.export}
        </CButton>
      </div>
    </div>
  )
}
