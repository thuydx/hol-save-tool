import {
  parseAppearance,
  parsePersonData,
  parseOfficialTitle,
  parseTitleFengdi,
  parseMonthlyIncrement,
  MemberAppearance,
  MemberPersonData,
  MemberOfficialTitle,
  MemberTitleFengdi,
  MemberMonthlyIncrement
} from '@/lib/memberCommonParsers'

export const enum MemberKingColumn {
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
  TITLE_FENGDI = 10,
  UNKNOWN_11 = 11,
  UNKNOWN_12 = 12,
  CHILDREN_IDS = 13,
  FAVOR = 14,
  UNKNOWN_15 = 15,
  REPUTATION = 16,
  UNKNOWN_17 = 17,
  HEALTH = 18,
  UNKNOWN_19 = 19,
  STRATEGY = 20,
  MONTHLY_INCREMENT = 21,
  SPECIAL_TAG = 22,
}

export const MemberKingColumnMap = {
  id: MemberKingColumn.ID,
  appearance: MemberKingColumn.APPEARANCE,
  person: MemberKingColumn.PERSON_DATA,
  age: MemberKingColumn.AGE,
  literary: MemberKingColumn.LITERARY,
  martial: MemberKingColumn.MARTIAL,
  business: MemberKingColumn.BUSINESS,
  art: MemberKingColumn.ART,
  mood: MemberKingColumn.MOOD,
  officialTitle: MemberKingColumn.OFFICIAL_TITLE,
  titleFengdi: MemberKingColumn.TITLE_FENGDI,
  health: MemberKingColumn.HEALTH,
  strategy: MemberKingColumn.STRATEGY,
  monthlyIncrement: MemberKingColumn.MONTHLY_INCREMENT,
  specialTags: MemberKingColumn.SPECIAL_TAG,
} as const


export type MemberKingParsed = {
  id: string
  appearance: MemberAppearance
  person: MemberPersonData
  age: number
  literary: number
  martial: number
  business: number
  art: number
  mood: string
  officialTitle: MemberOfficialTitle | null
  titleFengdi: MemberTitleFengdi
  health: number
  strategy: number
  monthlyIncrement: MemberMonthlyIncrement
  specialTags: string[]
}

export function deserializeMemberKing(
  row: string[],
): MemberKingParsed {
  return {
    id: row[MemberKingColumnMap.id],
    appearance: parseAppearance(
      row[MemberKingColumnMap.appearance],
    ),
    person: parsePersonData(
      row[MemberKingColumnMap.person],
    ),
    age: Number(row[MemberKingColumnMap.age]),
    literary: Number(row[MemberKingColumnMap.literary]),
    martial: Number(row[MemberKingColumnMap.martial]),
    business: Number(row[MemberKingColumnMap.business]),
    art: Number(row[MemberKingColumnMap.art]),
    mood: row[MemberKingColumnMap.mood],
    officialTitle: parseOfficialTitle(
      row[MemberKingColumnMap.officialTitle],
    ),
    titleFengdi: parseTitleFengdi(
      row[MemberKingColumnMap.titleFengdi],
    ),
    health: Number(row[MemberKingColumnMap.health]),
    strategy: Number(row[MemberKingColumnMap.strategy]),
    monthlyIncrement: parseMonthlyIncrement(
      row[MemberKingColumnMap.monthlyIncrement] ?? '0|0|0|0|0|0|0',
    ),
    specialTags:
      row[MemberKingColumnMap.specialTags]?.split('|') ?? [],
  }
}
