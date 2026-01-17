'use client'

import {usePathname, useRouter} from 'next/navigation'
import {CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,} from '@coreui/react'
import {useEffect, useState} from 'react'

type Props = {
  children: React.ReactNode
}

export default function RequireUploadedData({children}: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const segments = pathname.split('/').filter(Boolean)
  const lang = segments[0] || 'vi'
  const isHomePage = segments.length === 1

  /** 🔒 trạng thái trung gian để tránh hydration mismatch */
  const [checked, setChecked] = useState(false)
  const [hasData, setHasData] = useState<boolean>(false)

  useEffect(() => {
    try {
      setHasData(!!localStorage.getItem('uploadedJson'))
    } catch {
      setHasData(false)
    } finally {
      setChecked(true)
    }
  }, [])

  const goHome = () => {
    router.replace(`/${lang}`)
  }

  /** ⛔ SSR + first client render → giống nhau */
  if (!checked) {
    return null
  }

  /** ✅ Home page luôn render */
  if (isHomePage) {
    return <>{children}</>
  }

  /** ⛔ Block protected pages */
  if (!hasData) {
    return (
      <CModal
        visible
        backdrop="static"
        keyboard={false}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Please upload data</CModalTitle>
        </CModalHeader>

        <CModalBody>
          You need to upload game data before accessing this page.
        </CModalBody>

        <CModalFooter>
          <CButton color="primary" onClick={goHome}>
            Go to Home
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  /** ✅ Has data → render page */
  return <>{children}</>
}
