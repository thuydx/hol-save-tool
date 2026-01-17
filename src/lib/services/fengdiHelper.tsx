export function parseTitleFengdi(
  titleFengdi: string | undefined,
  t: any,
) {
  if (!titleFengdi) return null

  const [levelRaw, prefectureRaw] = titleFengdi.split('|')
  const level = Number(levelRaw)
  const prefectureId = Number(prefectureRaw)

  if (Number.isNaN(level) || Number.isNaN(prefectureId)) {
    return null
  }

  const fiefName = t.fief_name?.[prefectureId] ?? ''

  const levelName = t.fief_level?.[level] ?? ''

  return {
    fengdi: fiefName,
    fengdiTitle: `${fiefName} ${levelName}`.trim(),
  }
}
