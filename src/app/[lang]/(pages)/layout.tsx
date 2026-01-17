import {ReactNode, use} from 'react'
import {notFound} from 'next/navigation'
import {isValidLang} from '@/lib/i18n'
import Layout from '@/views/layout'
import RequireUploadedData from "@/components/guards/RequireUploadedData";

export default function PagesLayout({children, params}: Readonly<{
  children: ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang } = use(params)

  if (!isValidLang(lang)) {
    notFound()
  }
  return (
    <Layout>
        <RequireUploadedData>{children}</RequireUploadedData>
    </Layout>
  )
}
