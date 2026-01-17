/**
 * ===============================
 *  ICON ATLAS & MAPPING CONFIG
 * ===============================
 */

export type IconRect = {
  x: number
  y: number
  w: number
  h: number
}

/**
 * ===== SPRITE CONFIG (ĐÃ CHỐT) =====
 */
export const SPRITE_CONFIG = {
  SPRITE_WIDTH: 2048,
  SPRITE_HEIGHT: 2048,

  ICON_WIDTH: 105,
  ICON_HEIGHT: 105,

  COLUMNS: 19,

  START_X: 0,
  START_Y: 15,

  GAP_X: 0.5,
  GAP_Y: -1,

  TOTAL_ITEMS: 285,
}


/**
 * ===== MAIN ICON SPRITE CONFIG =====
 */
export const MAIN_SPRITE_CONFIG = {
  SPRITE_WIDTH: 512,
  SPRITE_HEIGHT: 512,

  ICON_WIDTH: 80,
  ICON_HEIGHT: 80,

  COLUMNS: 5,
  ROWS: 5,

  START_X: 0,
  START_Y: 0,

  GAP_X: 5,
  GAP_Y: 5,

  TOTAL_ICONS: 25,
}

/**
 * ===============================
 * HORSE ICON SPRITE CONFIG
 * ===============================
 */
export const HORSE_SPRITE_CONFIG = {
  SPRITE_WIDTH: 512,
  SPRITE_HEIGHT: 512,

  ICON_WIDTH: 100,
  ICON_HEIGHT: 100,

  COLUMNS: 4,
  ROWS: 3,

  START_X: 0,
  START_Y: 0,

  GAP_X: 5,
  GAP_Y: 0,

  TOTAL_ICONS: 12,
}

/**
 * ===== AUTO ICON ATLAS =====
 * iconId -> rect
 */
export const ITEM_ICON_ATLAS: Record<string, IconRect> =
  Object.fromEntries(
    Array.from({ length: SPRITE_CONFIG.TOTAL_ITEMS }, (_, id) => {
      const col = id % SPRITE_CONFIG.COLUMNS
      const row = Math.floor(id / SPRITE_CONFIG.COLUMNS)

      const x =
        SPRITE_CONFIG.START_X +
        col * (SPRITE_CONFIG.ICON_WIDTH + SPRITE_CONFIG.GAP_X)

      const y =
        SPRITE_CONFIG.START_Y +
        row * (SPRITE_CONFIG.ICON_HEIGHT + SPRITE_CONFIG.GAP_Y)

      return [
        String(id),
        {
          x,
          y,
          w: SPRITE_CONFIG.ICON_WIDTH,
          h: SPRITE_CONFIG.ICON_HEIGHT,
        },
      ]
    })
  )

/**
 * ===== MAIN ICON ATLAS =====
 * iconId -> rect
 */
export const MAIN_ICON_ATLAS: Record<string, IconRect> =
  Object.fromEntries(
    Array.from({ length: MAIN_SPRITE_CONFIG.TOTAL_ICONS }, (_, id) => {
      const col = id % MAIN_SPRITE_CONFIG.COLUMNS
      const row = Math.floor(id / MAIN_SPRITE_CONFIG.COLUMNS)

      const x =
        MAIN_SPRITE_CONFIG.START_X +
        col * (MAIN_SPRITE_CONFIG.ICON_WIDTH + MAIN_SPRITE_CONFIG.GAP_X)

      const y =
        MAIN_SPRITE_CONFIG.START_Y +
        row * (MAIN_SPRITE_CONFIG.ICON_HEIGHT + MAIN_SPRITE_CONFIG.GAP_Y)

      return [
        String(id),
        {
          x,
          y,
          w: MAIN_SPRITE_CONFIG.ICON_WIDTH,
          h: MAIN_SPRITE_CONFIG.ICON_HEIGHT,
        },
      ]
    })
  )

/**
 * ===== HORSE ICON ATLAS =====
 * iconId -> rect
 */
export const HORSE_ICON_ATLAS: Record<string, IconRect> =
  Object.fromEntries(
    Array.from({ length: HORSE_SPRITE_CONFIG.TOTAL_ICONS }, (_, id) => {
      const col = id % HORSE_SPRITE_CONFIG.COLUMNS
      const row = Math.floor(id / HORSE_SPRITE_CONFIG.COLUMNS)

      const x =
        HORSE_SPRITE_CONFIG.START_X +
        col * (HORSE_SPRITE_CONFIG.ICON_WIDTH + HORSE_SPRITE_CONFIG.GAP_X)

      const y =
        HORSE_SPRITE_CONFIG.START_Y +
        row * (HORSE_SPRITE_CONFIG.ICON_HEIGHT + HORSE_SPRITE_CONFIG.GAP_Y)

      return [
        String(id),
        {
          x,
          y,
          w: HORSE_SPRITE_CONFIG.ICON_WIDTH,
          h: HORSE_SPRITE_CONFIG.ICON_HEIGHT,
        },
      ]
    })
  )

/**
 * ===== ITEM → ICON MAPPING =====
 * Nhiều item dùng chung 1 icon
 */
export const ITEM_TO_ICON_MAP: Record<string, string> = {
  '66': '174',
  '67': '175',
  '68': '168',
  '69': '169',
  '70': '170',
  '71': '171',
  '72': '172',
  '73': '173',
  '74': '177',
  '75': '176',
  // Sách Văn +1 tới +3
  '169': '66',
  '170': '66',
  '171': '66',
  '172': '66',
  '173': '66',
  '174': '66',
  '175': '66',
  '176': '66',
  '177': '66',
  '178': '66',
  // Sách Văn +4 tới +5
  '179': '72',
  '180': '72',
  '181': '72',
  '182': '72',
  '183': '72',
  '184': '72',
  '185': '72',
  '186': '72',
  '187': '72',
  '188': '72',
  '189': '72',
  '190': '72',
  '191': '72',
  // Sách Võ
  '192': '67',
  '193': '67',
  '194': '67',
  '195': '67',
  '196': '67',
  '197': '67',
  '198': '67',
  '199': '67',
  '200': '67',
  '201': '67',
  '202': '67',
  '203': '67',
  '204': '67',
  '205': '67',
  '206': '67',
  // Sách Thương
  '207': '68',
  '208': '68',
  '209': '68',
  '210': '68',
  '211': '68',
  '212': '68',
  '213': '68',
  '214': '68',
  '215': '68',
  '216': '68',
  '217': '68',
  // Nghệ
  '218': '69',
  '219': '69',
  '220': '69',
  '221': '69',
  '222': '69',
  '223': '69',
  '224': '69',
  '225': '69',
  '226': '69',
  '227': '69',
  '228': '69',
  '229': '69',
  '230': '69',
  '231': '69',
  '232': '69',
  '233': '69',
  '234': '69',
  '235': '69',
  '236': '69',
  '237': '69',
  '238': '70',
  '239': '70',
  '240': '70',
  '241': '70',
  '242': '70',
  '243': '70',
  '244': '70',
  '245': '70',
  '246': '70',
  '247': '70',
  '248': '70',
  '249': '70',
  '250': '70',
  '251': '70',
  // Sách Pháp thuật
  '252': '74',
  '253': '74',
  '254': '74',
  '255': '74',
  '256': '74',
  // Sách Y thuật
  '257': '73',
  '258': '73',
  '259': '73',
  '260': '73',
  '261': '73',
  '262': '73',
  '263': '73',
  '264': '73',
  // Sách Đạo thuật
  '265': '75',
  '266': '75',
  '267': '75',
  '268': '75',
  '269': '75',
  // Sách Bói Toán
  '270': '75',
  '271': '75',
  '272': '75',
  '273': '75',
  '274': '75',
  // Sách Mị
  '275': '74',
  '276': '74',
  // Nghệ Thuật
  '277': '69',
  '278': '69',
  '279': '69',
  '280': '69',
  '281': '69',

  // '281': '178',
  '282': '179',
  '283': '180',
  '284': '181',
}

/**
 * ===== MAIN → ICON MAP =====
 * dùng cho button / title / UI
 */
export const MAIN_TO_ICON_MAP: Record<string, string> = {
  // ví dụ đặt tên semantic
  zibei: '0',
  map: '1',
  member: '2',
  warehouse: '3',
  stable: '4',

  letter: '5',
  scroll: '6',
  money: '7',
  silver: '8',
  gold: '9',

  slave: '11',
  fief: '14',


  treasury: '17',
  farm: '19'
  // fallback numeric vẫn OK
  // '10': '10',
}

/**
 * ===== HORSE → ICON MAP =====
 */
export const HORSE_TO_ICON_MAP: Record<string, string> = {
  red: '0',
  red_spotted: '1',
  blue: '2',
  blue_light: '3',
  white: '4',
  white_spotted: '5',
  gold: '6',
  gold_light: '7',
  black: '8',
  black_light: '9',
  grey: '10',
  grey_light: '11',
}


/**
 * ===== HELPER =====
 * itemId -> iconId
 */
export const resolveIconId = (itemId: string): string => {
  return ITEM_TO_ICON_MAP[itemId] ?? itemId
}
export const resolveMainIconId = (id: string): string => {
  return MAIN_TO_ICON_MAP[id] ?? id
}
export const resolveHorseIconId = (id: string): string => {
  return HORSE_TO_ICON_MAP[id] ?? id
}


export type IconSetConfig = {
  image: string
  spriteWidth: number
  spriteHeight: number
  atlas: Record<string, IconRect>
  resolveId?: (id: string) => string
}

/**
 * ===== ICON SET REGISTRY =====
 * default = item icon (PropIcon)
 */
export const ICON_SETS: Record<string, IconSetConfig> = {
  item: {
    image: '/assets/PropIcon.png',
    spriteWidth: SPRITE_CONFIG.SPRITE_WIDTH,
    spriteHeight: SPRITE_CONFIG.SPRITE_HEIGHT,
    atlas: ITEM_ICON_ATLAS,
    resolveId: resolveIconId,
  },
  main: {
    image: '/assets/MainA.png',
    spriteWidth: MAIN_SPRITE_CONFIG.SPRITE_WIDTH,
    spriteHeight: MAIN_SPRITE_CONFIG.SPRITE_HEIGHT,
    atlas: MAIN_ICON_ATLAS,
    resolveId: resolveMainIconId,
  },
  horse: {
    image: '/assets/HorseIcon.png',
    spriteWidth: HORSE_SPRITE_CONFIG.SPRITE_WIDTH,
    spriteHeight: HORSE_SPRITE_CONFIG.SPRITE_HEIGHT,
    atlas: HORSE_ICON_ATLAS,
    resolveId: resolveHorseIconId,
  },
}
