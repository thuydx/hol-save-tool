export type cunRow = [
  string, // 0 coordinates latitude|longitude eg -3.2|1.6
  string, // 1 area Camp site option 4,6,9,16
  string, // 2 population
  string, // 3 happy
  string, // 4 business
  string, // 5 agriculture
  string, // 6 unknow
  string, // 7 unknow
]
/**
 * [
 *                     "12.8|0",
 *                     "9",
 *                     "898",
 *                     "70",
 *                     "68",
 *                     "12",
 *                     "0",
 *                     "14"
 */
export const EMPTY_CUN_ROW: cunRow = [
  '',
  '16',
  '700',
  '90',
  '10',
  '70',
  '0',
  '14'
]

export const AREA_OPTIONS = ['4', '6', '9', '16']
