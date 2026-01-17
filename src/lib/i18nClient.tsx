'use client'

import {useEffect, useMemo, useState} from 'react'
import {useParams} from 'next/navigation'
import {defaultLang, getDict, Lang} from '@/lib/i18n'
import viDict from '@/lang/vi.json'

export function useI18nClient<T = any>() {
  const params = useParams<{ lang?: Lang }>()
  const lang: Lang = params?.lang ?? defaultLang

  // async dictionaries keyed by lang
  const [dictMap, setDictMap] = useState<Record<string, T>>({})

  useEffect(() => {
    if (lang === defaultLang) return

    let cancelled = false

    void getDict(lang).then((dict) => {
      if (cancelled) return

      setDictMap((prev) => {
        if (prev[lang]) return prev
        return {...prev, [lang]: dict as T}
      })
    })

    return () => {
      cancelled = true
    }
  }, [lang])

  const t = useMemo<T>(() => {
    if (lang === defaultLang) return viDict as T
    return dictMap[lang] ?? (viDict as T) // fallback while loading
  }, [lang, dictMap])

  return {t, lang}
}


/**
 * Example for the Client Component usage
 */
// 'use client'
//
// import React from 'react'
// import { useI18nClient } from '@/lib/i18nClient'
//
// type I18nSchema = {
//   common: { ok: string }
//   example: { title: string; description: string }
// }
//
// export default function ExamplePage() {
//   const { t, lang } = useI18nClient<I18nSchema>()
//
//   return (
//     <main style={{ padding: 16 }}>
//       <div>lang\={lang}</div>
//       <h1>{t.example?.title ?? '...'}</h1>
//       <p>{t.example?.description ?? ''}</p>
//       <button type="button">{t.common?.ok ?? 'OK'}</button>
//     </main>
//   )
// }
