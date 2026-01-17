import {cifCn, cifUs, cifVn} from '@coreui/icons'

export const langs = ['en', 'vi', 'cn'] as const
export const defaultLang = 'vi'

export type Lang = (typeof langs)[number]

export function isValidLang(lang: string): lang is Lang {
  return langs.includes(lang as Lang)
}

export async function getDict(lang: Lang) {
  return (await import(`../lang/${lang}.json`)).default
}

export function generateLangParams() {
  return langs.map((lang) => ({lang}))
}

const langOptions = [
  {code: 'en', label: 'English', flag: cifUs},
  {code: 'vi', label: 'Tiếng Việt', flag: cifVn},
  {code: 'cn', label: '中文', flag: cifCn},
]
export default langOptions

/**
 * Example for the Server Component usage
 */
// import { getDict, Lang, defaultLang } from '@/lib/i18n'
//
// export default async function ThingsPage({
//                                            params,
//                                          }: {
//   params?: { lang?: Lang }
// }) {
//   const lang = params?.lang ?? defaultLang
//   const dict = await getDict(lang)
//
//   return <h1>{dict.things.title}</h1>
// }

/**
 * use useI18nClient for the Client Component usage
 */
