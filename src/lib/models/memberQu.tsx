import {MemberColumnMap, MemberRawRow} from "@/models/members";

export const enum MemberQuColumn {
  ID = 0,
  APPEARANCE = 1,
  PERSON_DATA = 2,
  CHILDREN = 3,
  HOUSING = 4,
  AGE = 5,
  MARTIAL = 6,
  LITERARY = 7,
  BUSINESS = 8,
  ART = 9,
  MOOD = 10,
  MERITS = 11,
  REPUTATION = 12,
  MARITAL_STATUS = 13,
  EQUIPMENT = 14,
  CHARM = 15,
  HEALTH = 16,
  COL_17 = 17,
  PREGNANCY_MONTH = 18,
  STRATEGY = 19,
  STAMINA = 20,
  MONTHLY_INCREMENT = 21,
  GROWTH_BONUS = 22,
  SKILL_POINT = 23,
  COL_24 = 24,
  PREGNANCY_STATUS = 25,
  RELATION_TREE = 26,
  TRAITS = 27,
  COL_28 = 28,
  COL_29 = 29,
  COL_30 = 30,
  WORK_PLACE = 31,
  TASK = 32,
}


/**
 * load/save LocalStorage
 * import/export JSON
 * undo/redo
 */
export type MemberQuRawRow = string[]

/**
 * APPEARANCE
 * "11|17|0|9"
 */
export interface MemberQuAppearance {
  backHair: number
  body: number
  face: number
  frontHair: number
}

/**
 * PERSON_DATA
 * Name|family|Talent|Talent Point|Gender|Life Span|Skill|Luck|Trait|Marry to #|Hobby|?
 */
export interface MemberQuPersonData {
  name: string
  family: number
  talent: number
  talentPoint: number
  gender: number
  lifespan: number
  skills: number
  luck: number
  trait: number
  marryTo: string // reference to member ID
  hobby: number
  unknown?: number
}


/**
 * HOUSING
 * "1|LTB22656|null|5"
 */
export interface MemberQuHousing {
  isMainHouse: boolean
  buildingId: string | null
  unknown: string | null
  totalResidents: number
}


/**
 * EQUIPMENT
 * "weapon|jewelry|talisman"
 */
export interface MemberQuEquipment {
  weaponId: number | null
  jewelryId: number | null
  talismanId: number | null
}

/**
 * MONTHLY_INCREMENT
 * "0|0|0|0.99|0.99|0.99|0.99"
 */
export interface MemberQuMonthlyIncrement {
  unknown1: number
  unknown2: number
  unknown3: number
  literary: number
  martial: number
  business: number
  art: number
}

/**
 * GROWTH_BONUS
 * "5|9|0|0|0|0"
 */
export interface MemberQuGrowthBonus {
  intelligence: number
  charisma: number
  strategy: number
  writing: number
  might: number
  business: number
}

export type MemberQuParsed = {
  id: string
  appearance: MemberQuAppearance
  personData: MemberQuPersonData
  children: string
  housing: MemberQuHousing
  age: number
  martial: number
  literary: number
  business: number
  art: number
  mood: number
  merits: number
  reputation: number
  maritalStatus: number
  equipment: MemberQuEquipment
  charm: number
  health: number
  pregnancyMonth: number
  pregnancyStatus: number
  strategy: number
  stamina: number
  monthlyIncrement: MemberQuMonthlyIncrement
  growthBonus: MemberQuGrowthBonus
  skillPoint: number
  workPlace: string
  task: string
}

export const MemberQuColumnMap = {
  id: MemberQuColumn.ID,
  appearance: MemberQuColumn.APPEARANCE,
  personData: MemberQuColumn.PERSON_DATA,
  children: MemberQuColumn.CHILDREN,
  housing: MemberQuColumn.HOUSING,
  age: MemberQuColumn.AGE,
  martial: MemberQuColumn.MARTIAL,
  literary: MemberQuColumn.LITERARY,
  business: MemberQuColumn.BUSINESS,
  art: MemberQuColumn.ART,
  mood: MemberQuColumn.MOOD,
  merits: MemberQuColumn.MERITS,
  reputation: MemberQuColumn.REPUTATION,
  maritalStatus: MemberQuColumn.MARITAL_STATUS,
  equipment: MemberQuColumn.EQUIPMENT,
  charm: MemberQuColumn.CHARM,
  health: MemberQuColumn.HEALTH,
  pregnancyMonth: MemberQuColumn.PREGNANCY_MONTH,
  pregnancyStatus: MemberQuColumn.PREGNANCY_STATUS,
  strategy: MemberQuColumn.STRATEGY,
  stamina: MemberQuColumn.STAMINA,
  monthlyIncrement: MemberQuColumn.MONTHLY_INCREMENT,
  growthBonus: MemberQuColumn.GROWTH_BONUS,
  skillPoint: MemberQuColumn.SKILL_POINT,
  workPlace: MemberQuColumn.WORK_PLACE,
  task: MemberQuColumn.TASK,
} as const


/**
 * HELPER
 */
const toInt = (v: string | null, d = 0) =>
  v === null || v === 'null' ? d : Number(v)

// const toFloat = (v: string | null, d = 0) =>
//   v === null || v === 'null' ? d : Number(v)

const toNull = (v: string) => (v === 'null' ? null : v)

/**
 * APPEARANCE
 */

export function parseAppearance(raw: string): MemberQuAppearance {
  const [backHair, body, face, frontHair] = raw.split('|').map(Number)

  return {backHair, body, face, frontHair}
}

export function serializeAppearance(a: MemberQuAppearance): string {
  return [
    a.backHair,
    a.body,
    a.face,
    a.frontHair,
  ].join('|')
}

/**
 * PERSON_DATA
 * Name|family|Talent|Talent Point|Gender|Life Span|Skill|Luck|Trait|Marry to #|Hobby|?
 */
export function parsePersonData(raw: string): MemberQuPersonData {
  const [
    name,
    family,
    talent,
    talentPoint,
    gender,
    lifespan,
    skills,
    luck,
    trait,
    marryTo,
    hobby,
    unknown,
  ] = raw.split('|')

  return {
    name,
    family: toInt(family),
    talent: toInt(talent),
    talentPoint: toInt(talentPoint),
    gender: toInt(gender),
    lifespan: toInt(lifespan),
    skills: toInt(skills),
    luck: toInt(luck),
    trait: toInt(trait),
    marryTo: marryTo,
    hobby: toInt(hobby),
    unknown: toInt(unknown),
  }
}

export function serializePersonData(p: MemberQuPersonData): string {
  return [
    p.name,
    p.family,
    p.talent,
    p.talentPoint,
    p.gender,
    p.lifespan,
    p.skills,
    p.luck,
    p.trait,
    p.marryTo ?? 'null',
    p.hobby,
    p.unknown
  ].join('|')
}

/**
 * HOUSING
 */
export function parseHousing(raw: string): MemberQuHousing {
  const [main, buildingId, unknown, residents] = raw.split('|')

  return {
    isMainHouse: main === '1',
    buildingId: toNull(buildingId),
    unknown: toNull(unknown),
    totalResidents: toInt(residents),
  }
}

export function serializeHousing(h: MemberQuHousing): string {
  return [
    h.isMainHouse ? 1 : 0,
    h.buildingId ?? 'null',
    h.unknown ?? 'null',
    h.totalResidents,
  ].join('|')
}


/**
 * EQUIPMENT
 */
export function parseEquipment(raw: string): MemberQuEquipment {
  const [weapon, jewelry, talisman] = raw.split('|')

  return {
    weaponId: toNull(weapon) ? Number(weapon) : null,
    jewelryId: toNull(jewelry) ? Number(jewelry) : null,
    talismanId: toNull(talisman) ? Number(talisman) : null,
  }
}

export function serializeEquipment(e: MemberQuEquipment): string {
  return [
    e.weaponId ?? 'null',
    e.jewelryId ?? 'null',
    e.talismanId ?? 'null',
  ].join('|')
}


/**
 * MONTHLY_INCREMENT
 * PARSE
 */
export function parseMonthlyIncrement(raw: string): MemberQuMonthlyIncrement {
  const [
    u1,
    u2,
    u3,
    literary,
    martial,
    business,
    art,
  ] = raw.split('|')

  return {
    unknown1: Number(u1),
    unknown2: Number(u2),
    unknown3: Number(u3),
    literary: Number(literary),
    martial: Number(martial),
    business: Number(business),
    art: Number(art),
  }
}

/**
 * MONTHLY_INCREMENT
 * Serializer
 */
export function serializeMonthlyIncrement(m: MemberQuMonthlyIncrement): string {
  return [
    m.unknown1,
    m.unknown2,
    m.unknown3,
    m.literary,
    m.martial,
    m.business,
    m.art,
  ].join('|')
}

/**
 * GROWTH_BONUS
 * Parser
 */
export function parseGrowthBonus(raw: string): MemberQuGrowthBonus {
  const [
    intelligence,
    charisma,
    strategy,
    writing,
    might,
    business,
  ] = raw.split('|')

  return {
    intelligence: Number(intelligence),
    charisma: Number(charisma),
    strategy: Number(strategy),
    writing: Number(writing),
    might: Number(might),
    business: Number(business),
  }
}

/**
 * GROWTH_BONUS
 * Serializer
 */
export function serializeGrowthBonus(g: MemberQuGrowthBonus): string {
  return [
    g.intelligence,
    g.charisma,
    g.strategy,
    g.writing,
    g.might,
    g.business,
  ].join('|')
}

/**
 * deserializeAll(row) → MemberParsed
 * Parse toàn bộ Member_qu → object dùng cho UI
 */
export function deserializeRow(row: MemberQuRawRow): MemberQuParsed {
  return {
    id: row[MemberQuColumn.ID],
    appearance: parseAppearance(row[MemberQuColumn.APPEARANCE]),
    personData: parsePersonData(row[MemberQuColumn.PERSON_DATA]),
    children: row[MemberQuColumn.CHILDREN],
    housing: parseHousing(row[MemberQuColumn.HOUSING]),

    age: Number(row[MemberQuColumn.AGE]),
    martial: Number(row[MemberQuColumn.MARTIAL]),
    literary: Number(row[MemberQuColumn.LITERARY]),
    business: Number(row[MemberQuColumn.BUSINESS]),
    art: Number(row[MemberQuColumn.ART]),
    mood: Number(row[MemberQuColumn.MOOD]),
    merits: Number(row[MemberQuColumn.MERITS]),
    reputation: Number(row[MemberQuColumn.REPUTATION]),
    maritalStatus: Number(row[MemberQuColumn.MARITAL_STATUS]),

    equipment: parseEquipment(row[MemberColumnMap.equipment]),
    charm: Number(row[MemberQuColumn.CHARM]),
    health: Number(row[MemberQuColumn.HEALTH]),

    pregnancyMonth: Number(row[MemberQuColumn.PREGNANCY_MONTH]),
    pregnancyStatus: Number(row[MemberQuColumn.PREGNANCY_STATUS]),

    strategy: Number(row[MemberQuColumn.STRATEGY]),
    stamina: Number(row[MemberQuColumn.STAMINA]),

    monthlyIncrement: parseMonthlyIncrement(row[MemberQuColumn.MONTHLY_INCREMENT]),
    growthBonus: parseGrowthBonus(row[MemberQuColumn.GROWTH_BONUS]),

    skillPoint: Number(row[MemberQuColumn.SKILL_POINT]),
    workPlace: row[MemberQuColumn.WORK_PLACE],
    task: row[MemberQuColumn.TASK],
  }
}

/* =======================
   * SERIALIZE
   * ======================= */

/**
 * Convert object → raw rows (string[][])
 */
export function serializeRow(parsed: MemberQuParsed, baseRow?: MemberQuRawRow): MemberQuRawRow {
  // clone để giữ unknown field nếu có
  const row: MemberRawRow = baseRow
    ? [...baseRow]
    : new Array(28).fill('0')

  row[MemberQuColumn.ID] = parsed.id
  row[MemberQuColumn.APPEARANCE] = serializeAppearance(parsed.appearance)
  row[MemberQuColumn.PERSON_DATA] = serializePersonData(parsed.personData)
  row[MemberQuColumn.CHILDREN] = parsed.children
  row[MemberQuColumn.HOUSING] = serializeHousing(parsed.housing)
  row[MemberQuColumn.AGE] = String(parsed.age)
  row[MemberQuColumn.MARTIAL] = String(parsed.martial)
  row[MemberQuColumn.LITERARY] = String(parsed.literary)
  row[MemberQuColumn.BUSINESS] = String(parsed.business)
  row[MemberQuColumn.ART] = String(parsed.art)
  row[MemberQuColumn.MOOD] = String(parsed.mood)
  row[MemberQuColumn.MERITS] = String(parsed.merits)
  row[MemberQuColumn.REPUTATION] = String(parsed.reputation)
  row[MemberQuColumn.MARITAL_STATUS] = String(parsed.maritalStatus)
  row[MemberQuColumn.EQUIPMENT] = serializeEquipment(parsed.equipment)
  row[MemberQuColumn.CHARM] = String(parsed.charm)
  row[MemberQuColumn.HEALTH] = String(parsed.health)
  row[MemberQuColumn.PREGNANCY_MONTH] = String(parsed.pregnancyMonth)
  row[MemberQuColumn.PREGNANCY_STATUS] = String(parsed.pregnancyStatus)
  row[MemberQuColumn.STRATEGY] = String(parsed.strategy)
  row[MemberQuColumn.STAMINA] = String(parsed.stamina)
  row[MemberQuColumn.MONTHLY_INCREMENT] = serializeMonthlyIncrement(parsed.monthlyIncrement)
  row[MemberQuColumn.GROWTH_BONUS] = serializeGrowthBonus(parsed.growthBonus)
  row[MemberQuColumn.SKILL_POINT] = String(parsed.skillPoint)
  row[MemberQuColumn.WORK_PLACE] = parsed.workPlace
  row[MemberQuColumn.TASK] = parsed.task

  return row
}
