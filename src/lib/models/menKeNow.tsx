/* ============================
 * MenKe (Retainer) Model
 * ============================ */

export enum MenKeNowColumn {
  ID = 0,
  APPEARANCE = 1,
  PERSON_DATA = 2,
  AGE = 3,
  LITERARY = 4,
  MARTIAL = 5,
  BUSINESS = 6,
  ART = 7,
  MOOD = 8,
  LOCATION = 9,
  STATUS = 10,
  REPUTATION = 11,
  UNKNOWN_12 = 12,
  CHARM = 13,
  HEALTH = 14,
  SCHEMES = 15,
  SKILL_POINT = 16,
  PREGNANCY_MONTHS = 17,
  SALARY = 18,
  STAMINA = 19,
  UNKNOWN_20 = 20,
  TAGS = 21,
}

export type MenKeNowRawRow = string[]

/* ============================
 * Compound types
 * ============================ */

export interface AppearanceCompound {
  backHair: number
  body: number
  faceShape: number
  frontHair: number
}

export interface PersonDataCompound {
  name: string
  unknown1: number
  talentType: number
  talentValue: number
  sex: number
  lifespan: number
  skill: number
  luck: number
  trait: number | null
  hobby: number | null
}

export interface LocationCompound {
  jobId: number
  buildingId: string | null
  studentMemberId: string | null
}

/* ============================
 * Parsed row
 * ============================ */

export interface MenKeNowParsed {
  id: string
  appearance: AppearanceCompound
  person: PersonDataCompound
  age: number
  literary: number
  martial: number
  business: number
  art: number
  mood: number
  location: LocationCompound
  status: number
  reputation: number
  charm: number
  health: number
  schemes: number
  skillPoint: number
  pregnancyMonths: number
  salary: number
  stamina: number
  tags: string | null
}

/* ============================
 * Column map
 * ============================ */

export const MenKeNowColumnMap: Record<keyof MenKeNowParsed, MenKeNowColumn> = {
  id: MenKeNowColumn.ID,
  appearance: MenKeNowColumn.APPEARANCE,
  person: MenKeNowColumn.PERSON_DATA,
  age: MenKeNowColumn.AGE,
  literary: MenKeNowColumn.LITERARY,
  martial: MenKeNowColumn.MARTIAL,
  business: MenKeNowColumn.BUSINESS,
  art: MenKeNowColumn.ART,
  mood: MenKeNowColumn.MOOD,
  location: MenKeNowColumn.LOCATION,
  status: MenKeNowColumn.STATUS,
  reputation: MenKeNowColumn.REPUTATION,
  charm: MenKeNowColumn.CHARM,
  health: MenKeNowColumn.HEALTH,
  schemes: MenKeNowColumn.SCHEMES,
  skillPoint: MenKeNowColumn.SKILL_POINT,
  pregnancyMonths: MenKeNowColumn.PREGNANCY_MONTHS,
  salary: MenKeNowColumn.SALARY,
  stamina: MenKeNowColumn.STAMINA,
  tags: MenKeNowColumn.TAGS,
}

/* ============================
 * Parse helpers
 * ============================ */

export function parseAppearance(v: string): AppearanceCompound {
  const [b, body, f, fr] = v.split('|').map(Number)
  return {backHair: b, body, faceShape: f, frontHair: fr}
}

export function serializeAppearance(a: AppearanceCompound): string {
  return [a.backHair, a.body, a.faceShape, a.frontHair].join('|')
}

export function parsePersonData(v: string): PersonDataCompound {
  const [
    name,
    unknown1,
    talentType,
    talentValue,
    sex,
    lifespan,
    skill,
    luck,
    trait,
    hobby,
  ] = v.split('|')

  return {
    name,
    unknown1: Number(unknown1),
    talentType: Number(talentType),
    talentValue: Number(talentValue),
    sex: Number(sex),
    lifespan: Number(lifespan),
    skill: Number(skill),
    luck: Number(luck),
    trait: trait === 'null' ? null : Number(trait),
    hobby: hobby === 'null' ? null : Number(hobby),
  }
}

export function serializePersonData(p: PersonDataCompound): string {
  return [
    p.name,
    p.unknown1,
    p.talentType,
    p.talentValue,
    p.sex,
    p.lifespan,
    p.skill,
    p.luck,
    p.trait ?? 'null',
    p.hobby ?? 'null',
  ].join('|')
}

export function parseLocation(v: string): LocationCompound {
  const [jobId, buildingId, studentMemberId] = v.split('|')
  return {
    jobId: Number(jobId),
    buildingId: buildingId === 'null' ? null : buildingId,
    studentMemberId: studentMemberId === 'null' ? null : studentMemberId,
  }
}

export function serializeLocation(l: LocationCompound): string {
  return [
    l.jobId,
    l.buildingId ?? 'null',
    l.studentMemberId ?? 'null',
  ].join('|')
}

/* ============================
 * Row parse / serialize
 * ============================ */

export function deserializeMenKeNow(row: MenKeNowRawRow): MenKeNowParsed {
  return {
    id: row[0],
    appearance: parseAppearance(row[1]),
    person: parsePersonData(row[2]),
    age: Number(row[3]),
    literary: Number(row[4]),
    martial: Number(row[5]),
    business: Number(row[6]),
    art: Number(row[7]),
    mood: Number(row[8]),
    location: parseLocation(row[9]),
    status: Number(row[10]),
    reputation: Number(row[11]),
    charm: Number(row[13]),
    health: Number(row[14]),
    schemes: Number(row[15]),
    skillPoint: Number(row[16]),
    pregnancyMonths: Number(row[17]),
    salary: Number(row[18]),
    stamina: Number(row[19]),
    tags: row[21] === 'null' ? null : row[21],
  }
}

export function serializeMenKeNow(
  parsed: MenKeNowParsed,
  base: MenKeNowRawRow
): MenKeNowRawRow {
  const row = [...base]

  row[1] = serializeAppearance(parsed.appearance)
  row[2] = serializePersonData(parsed.person)
  row[3] = String(parsed.age)
  row[4] = String(parsed.literary)
  row[5] = String(parsed.martial)
  row[6] = String(parsed.business)
  row[7] = String(parsed.art)
  row[8] = String(parsed.mood)
  row[9] = serializeLocation(parsed.location)
  row[10] = String(parsed.status)
  row[11] = String(parsed.reputation)
  row[13] = String(parsed.charm)
  row[14] = String(parsed.health)
  row[15] = String(parsed.schemes)
  row[16] = String(parsed.skillPoint)
  row[17] = String(parsed.pregnancyMonths)
  row[18] = String(parsed.salary)
  row[19] = String(parsed.stamina)
  row[21] = parsed.tags ?? 'null'

  return row
}
