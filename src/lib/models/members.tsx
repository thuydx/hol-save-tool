export const enum MemberColumn {
  ID = 0,
  APPEARANCE = 1,
  CHILDREN = 2,
  HOUSING = 3,
  PERSON_DATA = 4,
  CHARACTER = 5,
  AGE = 6,
  LITERARY = 7,
  MARTIAL = 8,
  BUSINESS = 9,
  ART = 10,
  MOOD = 11,
  OFFICIAL_TITLE = 12,
  MERITS = 13,
  TITLE_FENGDI = 14,
  STATUS = 15,
  REPUTATION = 16,
  STATUS_DURATION = 17,
  AVAILABILITY_DURATION = 18,
  STUDY_CONTENT = 19,
  CHARM = 20,
  HEALTH = 21,
  HEAD_OF_FAMILY = 22,
  SPECIAL_TAG = 23,
  RECENT_EVENTS = 24,
  PREGNANCY_MONTHS = 25,
  MARITAL_STATUS = 26,
  STRATEGY = 27,
  UNKNOWN_28 = 28,
  EQUIPMENT = 29,
  STAMINA = 30,
  MONTHLY_INCREMENT = 31,
  GROWTH_BONUS = 32,
  SKILL_POS = 33,
  PREGNANCY_PROBABILITY = 34,
  ABROAD_PLACEMENT = 35,
  LIFE_EVENTS = 36,
  UNKNOWN_37 = 37,
  SIDE_DISHES = 38,
  MARRIED_TIME = 39,
  SCHOOL = 40,
  CLAN_RESPONSIBILITIES = 41,
  TRAVEL = 42,
}

/**
 * load/save LocalStorage
 * import/export JSON
 * undo/redo
 */
export type MemberRawRow = string[]

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
 * Parsed View Model (UI)
 * - for display in the UI
 * - for editing in the UI
 * - for saving to LocalStorage
 */
export interface MemberParsed {
  /* =======================
   * 0
   * ======================= */
  id: string                                  // ID

  /* =======================
   * 1 → 4
   * ======================= */
  appearance: MemberAppearance                // 1
  childrenIds: string[]                       // 2
  housing: MemberHousing                      // 3
  person: MemberPersonData                    // 4

  /* =======================
   * 5 → 11
   * ======================= */
  character: number                           // 5
  // 1: Kiêu hãnh
  // 2: Chính trực
  // 3: Hoạt bát
  // 4: Tốt bụng
  // 5: Chân thành
  // 6: Tự do thoải mái
  // 7: Lãnh đạm
  // 8: Tự ti
  // 9: Hèn nhát
  // 10: Nhút nhát
  // 11: Dữ dội
  // 12: Hay thay đổi
  // 13: U sầu
  // 14: Đa nghi
  age: number                                 // 6
  literary: number                            // 7
  martial: number                             // 8
  business: number                            // 9
  art: number                                 // 10
  mood: string                                // 11

  /* =======================
   * 12 → 18
   * ======================= */
  officialTitle: MemberOfficialTitle | null   // 12
  // a@b@c@d@e|f
  // a: is at least so far always 0 or 5
  // b: is the rank of the position 0 means rank 7, 6 means rank 1
  // c: is the position
  // d: is the province key
  // e: is the county key
  //
  // a@b@c Position
  // ----- -------------------
  // 0@0@0 None
  // 5@0@0 No Firm Position
  // 5@0@1 Deputy Magistrate
  // 5@0@2 County Marshal
  // 5@0@3 Yihui Officer
  // 5@1@0 No Firm Position
  // 5@1@1 Magistrate
  // 5@1@2 Gui'de Officer
  // 5@2@0 No Firm Position
  // 5@3@0 No Firm Position
  // 5@3@1 Provincial Governor
  // 5@3@3 General of Zuolin
  // 5@3@4 General of Youlin
  // 5@3@5 General of Zuoxiao
  // 5@3@6 General of Youxiao
  // 5@3@7 General of Zuowu
  // 5@3@8 General of Youwu
  // 5@3@9 General of Zuotun
  // 5@3@1 General of Youtun
  // 5@3@1 General of Zuohou
  // 5@3@1 General of Youhou
  // 5@3@1 General of Zuoyu
  // 5@3@1 General of Youyu
  // 5@4@0 No Firm Position
  // 5@4@1 Justice Minister
  // 5@4@2 Civil Minister
  // 5@4@3 Revenue Minister
  // 5@4@4 Rites Minister
  // 5@4@5 Industry Minister
  // 5@4@6 War Minister
  // 5@4@7 Censor
  // 5@4@8 Censor
  // 5@4@9 Censor
  // 5@4@1 Censor
  // 5@5@0 No Firm Position
  // 5@5@1 Grand Minister
  // 5@5@2 Imperial Censor
  // 5@6@0 No Firm Position
  // 5@6@1 Chancellor
  merits: number                              // 13
  // 0 None
  // 1 Xiucai
  // 2 Juren
  // 3 Xieyuan
  // 4 Gongshi
  // 5 Huiyuan
  // 6 Jinshi
  // 7 Tanhua
  // 8 Bangyan
  // 9 Zhuangyuan
  titleFengdi: {
    level: number                             // 0–3
    prefectureId: number
  }                                           // 14
  // City indexes and Level for Fiefs
  //
  // 1 Nan
  // 2 Sanchuan
  // 3 Shu
  // 4 Danyang
  // 5 Chenliu
  // 6 Changsha
  // 7 Kuaiji
  // 8 Guangling
  // 9 Taiyuan
  // 10 Yizhou
  // 11 Nanhai
  // 12 Yunnan|
  //
  // Fief level
  // 0 None
  // 1 Earl
  // 2 Marquis
  // 3 Duke
  // 4 King
  //
  //
  // Chỉ số và cấp độ thành phố cho Fiefs
  //
  // 1 Nam Quận
  // 2 Tam Xuyên
  // 3 Ba Thục
  // 4 Đan Dương
  // 5 Thần Lưu
  // 6 Trường Sa
  // 7 Kuaiji
  // 8 Quảng Lĩnh
  // 9 Thái Nguyên
  // 10 Ích Châu
  // 11 Nam Hải
  // 12 Vân Nam
  //
  // cấp độ thái ấp
  // 0 Không có
  // 1 Bá tước
  // 2 Hầu tước
  // 3 công tước
  // 4 Vương
  status: number                              // 15
  reputation: number                          // 16
  statusDuration: number                      // 17
  availabilityDuration: number                // 18

  /* =======================
   * 19 → 24
   * ======================= */
  studyContent: {
    bookId: number
    progress: number
  } | null                                    // 19
  charm: number                               // 20
  health: number                              // 21
  isHeadOfFamily: boolean                     // 22
  specialTags: string[]                       // 23
  recentEvents: string | null                 // 24

  /* =======================
   * 25 → 28
   * ======================= */
  pregnancyMonths: number                     // 25
  maritalStatus: number                       // 26
  strategy: number                            // 27
  unknown28: string                           // 28

  /* =======================
   * 29 → 34
   * ======================= */
  equipment: MemberEquipment                  // 29
  stamina: number                             // 30
  monthlyIncrement: MemberMonthlyIncrement    // 31
  growthBonus: MemberGrowthBonus              // 32
  skillPos: number                            // 33
  pregnancyProbability: number                // 34

  /* =======================
   * 35 → 39
   * ======================= */
  abroadPlacement: string                     // 35
  lifeEvents: MemberLifeEvent[]               // 36
  unknown37: string                           // 37
  sideDishes: string                          // 38
  marriedTime: number                         // 39

  /* =======================
   * 40 → 42
   * ======================= */
  school: number                                  // 40
  // School List on line 40
  // 0 None
  // 1 Mingli
  // 2 Jiuyuan
  // 3 Jinwen
  clanResponsibilities: MemberClanResponsibility  // 41
  travel: string                                  // 42
}

/**
 * Mapping table
 * for repository / serializer
 * Order MUST-follows MemberColumn index
 */
export const MemberColumnMap = {
  /* =======================
   * 0
   * ======================= */
  id: MemberColumn.ID,

  /* =======================
   * 1 → 4
   * ======================= */
  appearance: MemberColumn.APPEARANCE,
  childrenIds: MemberColumn.CHILDREN,
  housing: MemberColumn.HOUSING,
  person: MemberColumn.PERSON_DATA,

  /* =======================
   * 5 → 11
   * ======================= */
  character: MemberColumn.CHARACTER,
  age: MemberColumn.AGE,
  literary: MemberColumn.LITERARY,
  martial: MemberColumn.MARTIAL,
  business: MemberColumn.BUSINESS,
  art: MemberColumn.ART,
  mood: MemberColumn.MOOD,

  /* =======================
   * 12 → 18
   * ======================= */
  officialTitle: MemberColumn.OFFICIAL_TITLE,
  merits: MemberColumn.MERITS,
  titleFengdi: MemberColumn.TITLE_FENGDI,
  status: MemberColumn.STATUS,
  reputation: MemberColumn.REPUTATION,
  statusDuration: MemberColumn.STATUS_DURATION,
  availabilityDuration: MemberColumn.AVAILABILITY_DURATION,

  /* =======================
   * 19 → 24
   * ======================= */
  studyContent: MemberColumn.STUDY_CONTENT,
  charm: MemberColumn.CHARM,
  health: MemberColumn.HEALTH,
  isHeadOfFamily: MemberColumn.HEAD_OF_FAMILY,
  specialTags: MemberColumn.SPECIAL_TAG,
  recentEvents: MemberColumn.RECENT_EVENTS,

  /* =======================
   * 25 → 28
   * ======================= */
  pregnancyMonths: MemberColumn.PREGNANCY_MONTHS,
  maritalStatus: MemberColumn.MARITAL_STATUS,
  strategy: MemberColumn.STRATEGY,
  unknown28: MemberColumn.UNKNOWN_28,

  /* =======================
   * 29 → 34
   * ======================= */
  equipment: MemberColumn.EQUIPMENT,
  stamina: MemberColumn.STAMINA,
  monthlyIncrement: MemberColumn.MONTHLY_INCREMENT,
  growthBonus: MemberColumn.GROWTH_BONUS,
  skillPos: MemberColumn.SKILL_POS,
  pregnancyProbability: MemberColumn.PREGNANCY_PROBABILITY,

  /* =======================
   * 35 → 39
   * ======================= */
  abroadPlacement: MemberColumn.ABROAD_PLACEMENT,
  lifeEvents: MemberColumn.LIFE_EVENTS,
  unknown37: MemberColumn.UNKNOWN_37,
  sideDishes: MemberColumn.SIDE_DISHES,
  marriedTime: MemberColumn.MARRIED_TIME,

  /* =======================
   * 40 → 42
   * ======================= */
  school: MemberColumn.SCHOOL,
  clanResponsibilities: MemberColumn.CLAN_RESPONSIBILITIES,
  travel: MemberColumn.TRAVEL,
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

/**
 * deserializeAll(row) → MemberParsed
 */
export function deserializeAll(row: MemberRawRow): MemberParsed {
  return {
    /* 0 */
    id: row[MemberColumnMap.id],

    /* 1 → 4 */
    appearance: parseAppearance(row[MemberColumnMap.appearance]),
    childrenIds: row[MemberColumnMap.childrenIds].split('|'),
    housing: parseHousing(row[MemberColumnMap.housing]),
    person: parsePersonData(row[MemberColumnMap.person]),

    /* 5 → 11 */
    character: Number(row[MemberColumnMap.character]),
    age: Number(row[MemberColumnMap.age]),
    literary: Number(row[MemberColumnMap.literary]),
    martial: Number(row[MemberColumnMap.martial]),
    business: Number(row[MemberColumnMap.business]),
    art: Number(row[MemberColumnMap.art]),
    mood: row[MemberColumnMap.mood],

    /* 12 → 18 */
    officialTitle: parseOfficialTitle(
      row[MemberColumnMap.officialTitle],
    ),
    merits: Number(row[MemberColumnMap.merits]),
    titleFengdi: parseTitleFengdi(
      row[MemberColumnMap.titleFengdi],
    ),
    status: Number(row[MemberColumnMap.status]),
    reputation: Number(row[MemberColumnMap.reputation]),
    statusDuration: Number(row[MemberColumnMap.statusDuration]),
    availabilityDuration: Number(
      row[MemberColumnMap.availabilityDuration],
    ),

    /* 19 → 24 */
    studyContent:
      row[MemberColumnMap.studyContent] === 'null'
        ? null
        : (() => {
          const [bookId, progress] =
            row[MemberColumnMap.studyContent].split('@')
          return {
            bookId: Number(bookId),
            progress: Number(progress),
          }
        })(),
    charm: Number(row[MemberColumnMap.charm]),
    health: Number(row[MemberColumnMap.health]),
    isHeadOfFamily: row[MemberColumnMap.isHeadOfFamily] === '1',
    specialTags:
      row[MemberColumnMap.specialTags] === 'null'
        ? []
        : row[MemberColumnMap.specialTags].split('|'),
    recentEvents:
      row[MemberColumnMap.recentEvents] === 'null'
        ? null
        : row[MemberColumnMap.recentEvents],

    /* 25 → 28 */
    pregnancyMonths: Number(
      row[MemberColumnMap.pregnancyMonths],
    ),
    maritalStatus: Number(row[MemberColumnMap.maritalStatus]),
    strategy: Number(row[MemberColumnMap.strategy]),
    unknown28: row[MemberColumnMap.unknown28],

    /* 29 → 34 */
    equipment: parseEquipment(
      row[MemberColumnMap.equipment],
    ),
    stamina: Number(row[MemberColumnMap.stamina]),
    monthlyIncrement: parseMonthlyIncrement(
      row[MemberColumnMap.monthlyIncrement],
    ),
    growthBonus: parseGrowthBonus(
      row[MemberColumnMap.growthBonus],
    ),
    skillPos: Number(row[MemberColumnMap.skillPos]),
    pregnancyProbability: Number(
      row[MemberColumnMap.pregnancyProbability],
    ),

    /* 35 → 39 */
    abroadPlacement: row[MemberColumnMap.abroadPlacement],
    lifeEvents: parseLifeEvents(
      row[MemberColumnMap.lifeEvents],
    ),
    unknown37: row[MemberColumnMap.unknown37],
    sideDishes: row[MemberColumnMap.sideDishes],
    marriedTime: Number(row[MemberColumnMap.marriedTime]),

    /* 40 → 42 */
    school: Number(row[MemberColumnMap.school]),
    clanResponsibilities: parserClanResponsibilities(
      row[MemberColumnMap.clanResponsibilities],
    ),
    travel: row[MemberColumnMap.travel],
  }
}

/**
 * serializeAll(parsed) → MemberRawRow
 */
export function serializeAll(parsed: MemberParsed, baseRow?: MemberRawRow): MemberRawRow {
  // clone để giữ unknown field nếu có
  const row: MemberRawRow = baseRow
    ? [...baseRow]
    : new Array(43).fill('0')

  /* 0 */
  row[MemberColumnMap.id] = parsed.id

  /* 1 → 4 */
  row[MemberColumnMap.appearance] =
    serializeAppearance(parsed.appearance)

  row[MemberColumnMap.childrenIds] =
    parsed.childrenIds.join('|')

  row[MemberColumnMap.housing] =
    serializeHousing(parsed.housing)

  row[MemberColumnMap.person] =
    serializePersonData(parsed.person)

  /* 5 → 11 */
  row[MemberColumnMap.character] = String(parsed.character)
  row[MemberColumnMap.age] = String(parsed.age)
  row[MemberColumnMap.literary] = String(parsed.literary)
  row[MemberColumnMap.martial] = String(parsed.martial)
  row[MemberColumnMap.business] = String(parsed.business)
  row[MemberColumnMap.art] = String(parsed.art)
  row[MemberColumnMap.mood] = String(parsed.mood)

  /* 12 → 18 */
  row[MemberColumnMap.officialTitle] =
    serializeOfficialTitle(parsed.officialTitle)

  row[MemberColumnMap.merits] = String(parsed.merits)

  row[MemberColumnMap.titleFengdi] = serializeTitleFengdi(parsed.titleFengdi)

  row[MemberColumnMap.status] = String(parsed.status)
  row[MemberColumnMap.reputation] = String(parsed.reputation)
  row[MemberColumnMap.statusDuration] =
    String(parsed.statusDuration)
  row[MemberColumnMap.availabilityDuration] =
    String(parsed.availabilityDuration)

  /* 19 → 24 */
  row[MemberColumnMap.studyContent] =
    parsed.studyContent
      ? `${parsed.studyContent.bookId}@${parsed.studyContent.progress}`
      : 'null'

  row[MemberColumnMap.charm] = String(parsed.charm)
  row[MemberColumnMap.health] = String(parsed.health)
  row[MemberColumnMap.isHeadOfFamily] =
    parsed.isHeadOfFamily ? '1' : '0'

  row[MemberColumnMap.specialTags] =
    parsed.specialTags.length
      ? parsed.specialTags.join('|')
      : 'null'

  row[MemberColumnMap.recentEvents] =
    parsed.recentEvents ?? 'null'

  /* 25 → 28 */
  row[MemberColumnMap.pregnancyMonths] =
    String(parsed.pregnancyMonths)
  row[MemberColumnMap.maritalStatus] =
    String(parsed.maritalStatus)
  row[MemberColumnMap.strategy] =
    String(parsed.strategy)
  row[MemberColumnMap.unknown28] =
    parsed.unknown28

  /* 29 → 34 */
  row[MemberColumnMap.equipment] =
    serializeEquipment(parsed.equipment)

  row[MemberColumnMap.stamina] =
    String(parsed.stamina)

  row[MemberColumnMap.monthlyIncrement] =
    serializeMonthlyIncrement(parsed.monthlyIncrement)

  row[MemberColumnMap.growthBonus] =
    serializeGrowthBonus(parsed.growthBonus)

  row[MemberColumnMap.skillPos] =
    String(parsed.skillPos)

  row[MemberColumnMap.pregnancyProbability] =
    String(parsed.pregnancyProbability)

  /* 35 → 39 */
  row[MemberColumnMap.abroadPlacement] =
    parsed.abroadPlacement

  row[MemberColumnMap.lifeEvents] =
    serializeLifeEvents(parsed.lifeEvents)

  row[MemberColumnMap.unknown37] =
    parsed.unknown37

  row[MemberColumnMap.sideDishes] =
    parsed.sideDishes

  row[MemberColumnMap.marriedTime] =
    String(parsed.marriedTime)

  /* 40 → 42 */
  row[MemberColumnMap.school] =
    String(parsed.school)

  row[MemberColumnMap.clanResponsibilities] = serializeClanResponsibilities(parsed.clanResponsibilities)

  row[MemberColumnMap.travel] =
    parsed.travel

  return row
}

export function buildOfficialTitleKey(
  a?: number,
  b?: number,
  c?: number
): string | null {
  if (
    a === undefined ||
    b === undefined ||
    c === undefined
  ) {
    return null
  }

  return `${a}@${b}@${c}`
}
