/**
 * Data example
 * "value": [
 *             [   // group by family
 *                 [   // memberOther detail
 *                     "M1",
 *                     "16|28|2|15",
 *                     "Tô Hiền Thiện|2|3|17|1|79|0|6|1|null",
 *                     "73",
 *                     "28.46975",
 *                     "27.77662",
 *                     "68.9928",
 *                     "30.07368",
 *                     "-100",
 *                     "0@0@0@-1@-1|0",
 *                     "1",
 *                     "0|0",
 *                     "-1",
 *                     "33@0@null@0@1",
 *                     "M3|M15|M23|M24",
 *                     "0",
 *                     "0",
 *                     "41.70321",
 *                     "0",
 *                     "0",
 *                     "81",
 *                     "2",
 *                     "72",
 *                     "1",
 *                     "-5|0|-3|0.06|0.06|0.06|0.06",
 *                     "0",
 *                     "null",
 *                     "69@-1@null@null",
 *                     "0",
 *                     "null",
 *                     "0",
 *                     "78"
 *                 ],
 *             ],
 *         ],
 */

export const enum MemberOtherColumn {
  ID = 0,
  APPEARANCE = 1,
  PERSON_DATA = 2,
  AGE = 3,
  LITERARY = 4,
  MARTIAL = 5,
  BUSINESS = 6,
  ART = 7,
  MOOD = 8,
  OFFICIAL_TITLE = 9,
  UNKNOWN_10 = 10,
  FENGDI = 11, // ⬅ compound field
  UNKNOWN_12 = 12,
  UNKNOWN_13 = 13,
  CHILDREN_IDS = 14,
  FAVOR = 15,
  UNKNOWN_16 = 16,
  REPUTATION = 17,
  UNKNOWN_18 = 18,
  UNKNOWN_19 = 19,
  HEALTH = 20,
  UNKNOWN_21 = 21,
  STRATEGY = 22,
  UNKNOWN_23 = 23,
  MONTHLY_INCREMENT = 24,
  UNKNOWN_25 = 25,
  UNKNOWN_26 = 26,
  SPECIAL_TAG = 27,
  UNKNOWN_28 = 28,
  UNKNOWN_29 = 29,
  UNKNOWN_30 = 30,
  UNKNOWN_31 = 31,
}

export type MemberOtherRawRow = string[]

/* ============================================================
 * APPEARANCE
 * ============================================================ */
export interface MemberOtherAppearance {
  backHair: number
  body: number
  face: number
  frontHair: number
}

export const parseAppearance = (raw: string): MemberOtherAppearance => {
  const [backHair, body, face, frontHair] = raw.split('|').map(Number)
  return {backHair, body, face, frontHair}
}

export const serializeAppearance = (a: MemberOtherAppearance): string =>
  [a.backHair, a.body, a.face, a.frontHair].join('|')

/* ============================================================
 * PERSON DATA
 * ============================================================ */
export interface MemberOtherPersonData {
  name: string
  generation: number
  talentType: number
  talentPoint: number
  gender: 0 | 1
  lifespan: number
  skillType: number
  luck: number
  personality: number
  unknown: string | null
}

export const parsePersonData = (raw: string): MemberOtherPersonData => {
  const [
    name,
    generation,
    talentType,
    talentPoint,
    gender,
    lifespan,
    skillType,
    luck,
    personality,
    unknown,
  ] = raw.split('|')

  return {
    name,
    generation: Number(generation),
    talentType: Number(talentType),
    talentPoint: Number(talentPoint),
    gender: Number(gender) as 0 | 1,
    lifespan: Number(lifespan),
    skillType: Number(skillType),
    luck: Number(luck),
    personality: Number(personality),
    unknown: unknown === 'null' ? null : unknown,
  }
}

export const serializePersonData = (p: MemberOtherPersonData): string =>
  [
    p.name,
    p.generation,
    p.talentType,
    p.talentPoint,
    p.gender,
    p.lifespan,
    p.skillType,
    p.luck,
    p.personality,
    p.unknown ?? 'null',
  ].join('|')

/* ============================================================
 * TITLE FENGDI  (compound field)
 * ============================================================ */
export interface MemberOtherTitleFengdi {
  level: number          // Fief level (0–3)
  prefectureId: number   // fief_name
}

export const parseTitleFengdi = (
  raw: string,
): MemberOtherTitleFengdi => {
  const [level, prefectureId] = raw.split('|')
  return {
    level: Number(level),
    prefectureId: Number(prefectureId),
  }
}

export const serializeTitleFengdi = (
  t: MemberOtherTitleFengdi,
): string =>
  `${t.level}|${t.prefectureId}`

/* ============================================================
 * PARSED VIEW MODEL
 * ============================================================ */
export interface MemberOtherParsed {
  id: string

  appearance: MemberOtherAppearance
  person: MemberOtherPersonData

  age: number
  literary: number
  martial: number
  business: number
  art: number
  mood: number

  officialTitle: string
  titleFengdi: MemberOtherTitleFengdi

  childrenIds: string[]
  favor: number
  reputation: number
  health: number
  strategy: number

  monthlyIncrement: string
  specialTag: string
}

/* ============================================================
 * DESERIALIZE
 * ============================================================ */
export function deserializeMemberOther(
  row: MemberOtherRawRow,
): MemberOtherParsed {
  return {
    id: row[MemberOtherColumn.ID],

    appearance: parseAppearance(row[MemberOtherColumn.APPEARANCE]),
    person: parsePersonData(row[MemberOtherColumn.PERSON_DATA]),

    age: Number(row[MemberOtherColumn.AGE]),
    literary: Number(row[MemberOtherColumn.LITERARY]),
    martial: Number(row[MemberOtherColumn.MARTIAL]),
    business: Number(row[MemberOtherColumn.BUSINESS]),
    art: Number(row[MemberOtherColumn.ART]),
    mood: Number(row[MemberOtherColumn.MOOD]),

    officialTitle: row[MemberOtherColumn.OFFICIAL_TITLE],
    titleFengdi: parseTitleFengdi(row[MemberOtherColumn.FENGDI]),

    childrenIds:
      row[MemberOtherColumn.CHILDREN_IDS] === 'null'
        ? []
        : row[MemberOtherColumn.CHILDREN_IDS].split('|'),

    favor: Number(row[MemberOtherColumn.FAVOR]),
    reputation: Number(row[MemberOtherColumn.REPUTATION]),
    health: Number(row[MemberOtherColumn.HEALTH]),
    strategy: Number(row[MemberOtherColumn.STRATEGY]),

    monthlyIncrement: row[MemberOtherColumn.MONTHLY_INCREMENT],
    specialTag: row[MemberOtherColumn.SPECIAL_TAG],
  }
}

/* ============================================================
 * SERIALIZE
 * ============================================================ */
export function serializeMemberOther(
  parsed: MemberOtherParsed,
  baseRow?: MemberOtherRawRow,
): MemberOtherRawRow {
  const row = baseRow
    ? [...baseRow]
    : new Array(32).fill('0')

  row[MemberOtherColumn.ID] = parsed.id
  row[MemberOtherColumn.APPEARANCE] =
    serializeAppearance(parsed.appearance)
  row[MemberOtherColumn.PERSON_DATA] =
    serializePersonData(parsed.person)

  row[MemberOtherColumn.AGE] = String(parsed.age)
  row[MemberOtherColumn.LITERARY] = String(parsed.literary)
  row[MemberOtherColumn.MARTIAL] = String(parsed.martial)
  row[MemberOtherColumn.BUSINESS] = String(parsed.business)
  row[MemberOtherColumn.ART] = String(parsed.art)
  row[MemberOtherColumn.MOOD] = String(parsed.mood)

  row[MemberOtherColumn.OFFICIAL_TITLE] =
    parsed.officialTitle
  row[MemberOtherColumn.FENGDI] =
    serializeTitleFengdi(parsed.titleFengdi)

  row[MemberOtherColumn.CHILDREN_IDS] =
    parsed.childrenIds.length
      ? parsed.childrenIds.join('|')
      : 'null'

  row[MemberOtherColumn.FAVOR] = String(parsed.favor)
  row[MemberOtherColumn.REPUTATION] =
    String(parsed.reputation)
  row[MemberOtherColumn.HEALTH] =
    String(parsed.health)
  row[MemberOtherColumn.STRATEGY] =
    String(parsed.strategy)

  row[MemberOtherColumn.MONTHLY_INCREMENT] =
    parsed.monthlyIncrement
  row[MemberOtherColumn.SPECIAL_TAG] =
    parsed.specialTag

  return row
}
