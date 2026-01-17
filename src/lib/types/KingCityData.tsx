/* =========================
 * Fengdi (Fief)
 * ========================= */

export type FengdiState = -2 | -1 | 2

export type FengdiCompound = {
  index: number          // fengdi index (0-based)
  state: FengdiState
  memberRef: string | null
}

/* =========================
 * Capital
 * ========================= */

export type KingCapital = {
  troop: number
  loyalty: number
}

/* =========================
 * Main Parsed Type
 * ========================= */

export type KingCityDataParsed = {
  capital: KingCapital
  fengdi: FengdiCompound[]
  treasury: number
  unknown14?: string | null
  unknown15?: string | null
}
