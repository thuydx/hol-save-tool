export type ShiJiaKingRelation = {
  familyId: number
  value: number
}

export type ShiJiaKingParsed = {
  name: string
  level: number
  relationshipIndex: number
  unknownCol3?: number
  unknownCol4?: number | null
  relations: ShiJiaKingRelation[]
}
