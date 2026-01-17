export type ZhuangTouRawRow = string[]

export type ZhuangTouParsed = {
  id: string
  name: string
}

/**
 * Raw row structure:
 * [ id, portrait, "name|sub1|sub2|sub3", ... ]
 */
export function parseZhuangTou(
  row: ZhuangTouRawRow
): ZhuangTouParsed {
  return {
    id: row[0],
    name: (row[2] ?? '').split('|')[0],
  }
}
