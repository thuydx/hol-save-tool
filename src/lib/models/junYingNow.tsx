export type JunYingRow = [
  string, // 0 coordinates latitude|longitude eg -3.2|1.6
  string, // 1 area Camp site option 4,6,9,16
  string, // 2 soldiers Amount of troop
  string, // 3 combat power
  string, // 4 loyalty
  string, // 5 low equip
  string, // 6 high equip
  string, // 7 camp name
  string  // 8 salary
]

export const EMPTY_JUNYING_ROW: JunYingRow = [
  '',
  '4',
  '0',
  '0',
  '0',
  '0',
  '0',
  '',
  '0'
]

export const AREA_OPTIONS = ['4', '6', '9', '16']
