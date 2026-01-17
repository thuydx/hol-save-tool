/**
 * APPEARANCE
 * "11|17|0|9"
 */
export interface MemberAppearance {
  backHair: number
  body: number
  face: number
  frontHair: number
}

/**
 * PERSON_DATA
 * "name|generation|talent|talentPos|gender|lifespan|skills|luck|?|hobby"
 */
export interface MemberPersonData {
  name: string
  generation: number
  talent: number
  talentPos: number
  gender: number
  lifespan: number
  skills: number
  luck: number
  unknown?: number
  hobby: number
}

/**
 * HOUSING
 * "1|LTB22656|null|5"
 */
export interface MemberHousing {
  isMainHouse: boolean
  buildingId: string | null
  unknown: string | null
  totalResidents: number
}

/**
 * FENGDI_TITLE
 * "4|4" Uyển Lăng Vương
 */
export type MemberTitleFengdi = {
  level: number          // fief_level
  prefectureId: number  // city_name
}

/**
 * OFFICIAL_TITLE
 * "5@5@1@-1@-1|162446"
 */
export type MemberOfficialTitle = {
  identity: number        // a
  rank: number            // b
  position: number        // c
  prefectureId: number    // d
  countyId: number        // e
  politicalAchievement: number // f

  /** derived – NOT serialized */
  i18nKey?: string        // `${a}@${b}@${c}`
}

/**
 * EQUIPMENT
 * "weapon|jewelry|talisman"
 */
export interface MemberEquipment {
  weaponId: number | null
  jewelryId: number | null
  talismanId: number | null
}

/**
 * MONTHLY_INCREMENT
 * "0|0|0|0.99|0.99|0.99|0.99"
 */
export interface MemberMonthlyIncrement {
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
export interface MemberGrowthBonus {
  intelligence: number
  charisma: number
  strategy: number
  writing: number
  might: number
  business: number
}

/**
 * LIFE_EVENTS
 * "19@92@Place@null|20@89@Title@null"
 */
export interface MemberLifeEvent {
  age: number
  code: number
  description: string
  relatedPerson: string | null
}

/**
 * CLAN_RESPONSIBILITIES
 * "taskId|money|unknown"
 */
export interface MemberClanResponsibility {
  taskId: number
  money: number
  unknown: number
}


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

export function parseAppearance(raw: string): MemberAppearance {
  const [backHair, body, face, frontHair] = raw.split('|').map(Number)

  return {backHair, body, face, frontHair}
}

export function serializeAppearance(a: MemberAppearance): string {
  return [
    a.backHair,
    a.body,
    a.face,
    a.frontHair,
  ].join('|')
}

/**
 * PERSON_DATA
 */
export function parsePersonData(raw: string): MemberPersonData {
  const [
    name,
    generation,
    talent,
    talentPos,
    gender,
    lifespan,
    skills,
    luck,
    unknown,
    hobby,
  ] = raw.split('|')

  return {
    name,
    generation: toInt(generation),
    talent: toInt(talent),
    talentPos: toInt(talentPos),
    gender: toInt(gender),
    lifespan: toInt(lifespan),
    skills: toInt(skills),
    luck: toInt(luck),
    unknown: toInt(unknown),
    hobby: toInt(hobby),
  }
}

export function serializePersonData(p: MemberPersonData): string {
  return [
    p.name,
    p.generation,
    p.talent,
    p.talentPos,
    p.gender,
    p.lifespan,
    p.skills,
    p.luck,
    p.unknown ?? 0,
    p.hobby,
  ].join('|')
}

/**
 * HOUSING
 */
export function parseHousing(raw: string): MemberHousing {
  const [main, buildingId, unknown, residents] = raw.split('|')

  return {
    isMainHouse: main === '1',
    buildingId: toNull(buildingId),
    unknown: toNull(unknown),
    totalResidents: toInt(residents),
  }
}

export function serializeHousing(h: MemberHousing): string {
  return [
    h.isMainHouse ? 1 : 0,
    h.buildingId ?? 'null',
    h.unknown ?? 'null',
    h.totalResidents,
  ].join('|')
}

/**
 * OFFICIAL_TITLE
 */
/**
 * OFFICIAL_TITLE
 * raw format: a@b@c@d@e|f
 */
export function parseOfficialTitle(
  raw: string
): MemberOfficialTitle | null {
  if (!raw || raw === '0' || raw === 'null') return null

  const [info, merit] = raw.split('|')

  const [
    identity,
    rank,
    position,
    prefectureId,
    countyId,
  ] = info.split('@').map(Number)

  if (
    [identity, rank, position].some(v => Number.isNaN(v))
  ) {
    return null
  }

  return {
    identity,              // a
    rank,                  // b
    position,              // c
    prefectureId: prefectureId ?? 0, // d
    countyId: countyId ?? 0,         // e
    politicalAchievement: Number(merit) || 0, // f

    /**
     * ✅ derived field for i18n
     * official_title.${a}@${b}@${c}
     */
    i18nKey: `${identity}@${rank}@${position}`,
  }
}


export function serializeOfficialTitle(
  t: MemberOfficialTitle | null
): string {
  if (!t) return '0'

  return (
    [
      t.identity,
      t.rank,
      t.position,
      t.prefectureId ?? 0,
      t.countyId ?? 0,
    ].join('@') +
    '|' +
    (t.politicalAchievement ?? 0)
  )
}

/**
 * TITLE_FENGDI
 * raw format: level|prefectureId
 */
export function parseTitleFengdi(raw: string): MemberTitleFengdi {
  if (!raw || raw === 'null') {
    return {level: 0, prefectureId: 0}
  }

  const [level, prefectureId] = raw.split('|')

  return {
    level: Number(level) || 0,
    prefectureId: Number(prefectureId) || 0,
  }
}

export function serializeTitleFengdi(
  t: MemberTitleFengdi
): string {
  return `${t.level}|${t.prefectureId}`
}


/**
 * EQUIPMENT
 */
export function parseEquipment(raw: string): MemberEquipment {
  const [weapon, jewelry, talisman] = raw.split('|')

  return {
    weaponId: toNull(weapon) ? Number(weapon) : null,
    jewelryId: toNull(jewelry) ? Number(jewelry) : null,
    talismanId: toNull(talisman) ? Number(talisman) : null,
  }
}

export function serializeEquipment(e: MemberEquipment): string {
  return [
    e.weaponId ?? 'null',
    e.jewelryId ?? 'null',
    e.talismanId ?? 'null',
  ].join('|')
}

/**
 * LIFE_EVENTS
 */
export function parseLifeEvents(raw: string): MemberLifeEvent[] {
  if (!raw || raw === 'null') return []

  return raw.split('|').map(e => {
    const [age, code, desc, related] = e.split('@')

    return {
      age: Number(age),
      code: Number(code),
      description: desc,
      relatedPerson: toNull(related),
    }
  })
}

export function serializeLifeEvents(events: MemberLifeEvent[]): string {
  if (!events.length) return 'null'

  return events
    .map(e =>
      [
        e.age,
        e.code,
        e.description,
        e.relatedPerson ?? 'null',
      ].join('@'),
    )
    .join('|')
}

/**
 * MONTHLY_INCREMENT
 * PARSE
 */
export function parseMonthlyIncrement(raw: string): MemberMonthlyIncrement {
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
export function serializeMonthlyIncrement(m: MemberMonthlyIncrement): string {
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
export function parseGrowthBonus(raw: string): MemberGrowthBonus {
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
export function serializeGrowthBonus(g: MemberGrowthBonus): string {
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
 * CLAN_RESPONSIBILITIES
 * Parser
 */
export function parserClanResponsibilities(raw: string): MemberClanResponsibility {
  const [
    taskId,
    money,
    unknown,
  ] = raw.split('|')
  return {
    taskId: Number(taskId),
    money: Number(money),
    unknown: Number(unknown),
  }
}

export function serializeClanResponsibilities(c: MemberClanResponsibility): string {
  return [c.taskId, c.money, c.unknown].join('|')
}
