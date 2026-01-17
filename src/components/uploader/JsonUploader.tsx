'use client'

import React, {DragEvent, useRef, useState} from 'react'
import {CButton, CCard, CCardBody, CForm, CToast, CToastBody, CToastHeader,} from '@coreui/react'
import {useI18nClient} from '@/lib/i18nClient'

type JsonUploaderProps = {
  storageKey: string
  maxFileSize?: number
  allowedTypes?: readonly string[]
  allowedExtensions?: readonly string[]
  onUploadAction?: (data: unknown) => void
}

export default function JsonUploader({
                                       storageKey,
                                       maxFileSize = 2 * 1024 * 1024,
                                       allowedTypes = ['application/json'],
                                       allowedExtensions = ['json', 'es3'],
                                       onUploadAction,
                                     }: JsonUploaderProps) {
  const {t} = useI18nClient<{ uploader: Record<string, string> }>()

  const fileRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    color: 'success' | 'danger'
  } | null>(null)

  const acceptHint = allowedExtensions.map((e) => `.${e}`).join(', ')

  /* ---------------- helpers ---------------- */

  const isValidFileType = (file: File): boolean => {
    if (file.type && allowedTypes.includes(file.type)) return true
    const ext = file.name.split('.').pop()?.toLowerCase()
    return !!ext && allowedExtensions.includes(ext)
  }

  const validateAndSave = async (file: File): Promise<string> => {
    if (!isValidFileType(file)) throw t.uploader.invalidFileType
    if (file.size > maxFileSize) throw t.uploader.fileTooLarge

    const text = await file.text()
    const parsed = JSON.parse(text)

    if (!parsed || typeof parsed !== 'object') {
      throw t.uploader.invalidJsonStructure
    }

    if (Object.keys(parsed).length === 0) {
      throw t.uploader.emptyJson
    }

    localStorage.setItem(storageKey, JSON.stringify(parsed))
    onUploadAction?.(parsed)

    return t.uploader.saved
  }

  /* ---------------- handlers ---------------- */

  const handleSelectFile = (file: File) => {
    setSelectedFile(file)
    setFileName(file.name)
  }

  const handleSubmit = async () => {
    if (!selectedFile) return

    try {
      const msg = await validateAndSave(selectedFile)
      setToast({message: msg, color: 'success'})
      setSelectedFile(null)
    } catch (err) {
      setToast({message: String(err), color: 'danger'})
    }
  }

  /* ---------------- drag & drop ---------------- */

  const prevent = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    prevent(e)
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleSelectFile(file)
  }

  /* ---------------- render ---------------- */

  return (
    <>
      <CCard>
        <CCardBody>
          <h5>{t.uploader.title}</h5>

          <div
            onDragOver={prevent}
            onDragEnter={(e) => {
              prevent(e)
              setIsDragging(true)
            }}
            onDragLeave={(e) => {
              prevent(e)
              setIsDragging(false)
            }}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`border rounded p-4 text-center mb-3 ${
              isDragging ? 'border-primary bg-body-secondary' : ''
            }`}
            style={{cursor: 'pointer'}}
          >
            <strong>{t.uploader.dropHere}</strong>
            <br/>
            <small className="text-muted">
              Accept: {acceptHint}
            </small>

            <div className="text-muted mt-2">
              {fileName ?? t.uploader.noFileChosen}
            </div>
          </div>

          <CForm
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <input
              ref={fileRef}
              type="file"
              className="d-none"
              accept={acceptHint}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleSelectFile(file)
              }}
            />

            <CButton type="submit" disabled={!selectedFile} color="primary">
              {t.uploader.upload}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>

      {toast && (
        <div style={{position: 'fixed', top: 16, right: 16, zIndex: 9999}}>
          <CToast
            visible
            autohide
            delay={3000}
            color={toast.color}
            onClose={() => setToast(null)}
          >
            <CToastHeader closeButton>
              <strong className="me-auto">
                {t.uploader.toastTitle}
              </strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        </div>
      )}
    </>
  )
}
