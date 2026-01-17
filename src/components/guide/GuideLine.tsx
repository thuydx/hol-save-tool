'use client'

import { useGuideLine } from '@/lib/providers/GuideLine'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardSubtitle,
  CCardTitle,
} from '@coreui/react'

export default function GuideLine() {
  const { data } = useGuideLine()

  if (!data) return null

  return (
    <CCard className="mb-4 guide-card-bg guide-scope" style={{ whiteSpace: 'pre-line' }}>
      <CCardHeader className="guide-card-header bg-transparent">
        <CCardTitle>{data.title}</CCardTitle>
        <CCardSubtitle>{data.description}</CCardSubtitle>
      </CCardHeader>
      {data.content && (
        <CCardBody className="guide-card-body bg-transparent" style={{ whiteSpace: 'pre-line' }}>
          {data.content}
        </CCardBody>
      )}
    </CCard>
  )
}
