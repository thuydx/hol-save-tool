export type FarmRawRow = string[]

export type FarmParsed = {
  belongToClan: string
  farmName: string
  area: string
  maxFarmers: string
  environment: string
  security: string
  convenience: string
  farmHeadId: string
  farmerCount: [string, string, string]
  farmerRatio: [string, string, string]
}

/* =============================
 * COLUMN INDEX (1 nơi duy nhất)
 * ============================= */
export const FarmCol = {
  BELONG_TO_CLAN: 0,
  AREA: 5,
  FARM_NAME: 6,
  MAX_FARMERS: 7,
  ENVIRONMENT: 10,
  SECURITY: 11,
  CONVENIENCE: 12,
  FARM_HEAD_ID: 16,
  FARMER_COUNT: 24,
  FARMER_RATIO: 26,
} as const

/* =============================
 * PARSE
 * ============================= */
export function parseFarm(row: FarmRawRow): FarmParsed {
  return {
    belongToClan: row[FarmCol.BELONG_TO_CLAN],
    farmName: row[FarmCol.FARM_NAME],
    area: row[FarmCol.AREA],
    maxFarmers: row[FarmCol.MAX_FARMERS],
    environment: row[FarmCol.ENVIRONMENT],
    security: row[FarmCol.SECURITY],
    convenience: row[FarmCol.CONVENIENCE],
    farmHeadId: row[FarmCol.FARM_HEAD_ID],
    farmerCount: (row[FarmCol.FARMER_COUNT] ?? '0|0|0').split('|') as any,
    farmerRatio: (row[FarmCol.FARMER_RATIO] ?? '0|0|0').split('|') as any,
  }
}

/* =============================
 * SERIALIZE
 * ============================= */
export function serializeFarm(
  raw: FarmRawRow,
  parsed: Partial<FarmParsed>
): FarmRawRow {
  const next = [...raw]

  if (parsed.belongToClan !== undefined)
    next[FarmCol.BELONG_TO_CLAN] = parsed.belongToClan

  if (parsed.farmName !== undefined)
    next[FarmCol.FARM_NAME] = parsed.farmName

  if (parsed.area !== undefined)
    next[FarmCol.AREA] = parsed.area

  if (parsed.maxFarmers !== undefined)
    next[FarmCol.MAX_FARMERS] = parsed.maxFarmers

  if (parsed.environment !== undefined)
    next[FarmCol.ENVIRONMENT] = parsed.environment

  if (parsed.security !== undefined)
    next[FarmCol.SECURITY] = parsed.security

  if (parsed.convenience !== undefined)
    next[FarmCol.CONVENIENCE] = parsed.convenience

  if (parsed.farmHeadId !== undefined)
    next[FarmCol.FARM_HEAD_ID] = parsed.farmHeadId

  if (parsed.farmerCount)
    next[FarmCol.FARMER_COUNT] = parsed.farmerCount.join('|')

  if (parsed.farmerRatio)
    next[FarmCol.FARMER_RATIO] = parsed.farmerRatio.join('|')

  return next
}
