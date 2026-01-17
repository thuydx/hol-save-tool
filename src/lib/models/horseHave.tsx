/**
 * Horse_Have row model
 * All values are STRING (even numbers)
 */
export type HorseHaveRow = [
  string,          // COL_0 color
  string,          // COL_1 yearAge
  string,          // COL_2 lifespan
  string,          // COL_3 power
  string,          // COL_4 speed
  string,          // COL_5 smart
  string    // COL_6 owner (Member ID)
]

export const DEFAULT_HORSE_HAVE_ROW: HorseHaveRow = [
  '0',
  '1',
  '100',
  '100',
  '100',
  '100',
  "null",
]
