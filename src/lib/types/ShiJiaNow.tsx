export type Coordinates = `${number}|${number}`

export type ArmyStrength = {
  privateArmy: number
  militaryPower: number
}

export type ShiJiaNowRelation = {
  familyId: number
  value: number
}

export type ShiJiaNowParsed = {
  id: number
  name: string
  level: number
  relationshipIndex: number
  coordinates: Coordinates
  inheritance: number
  royalInfluence: number
  relations: ShiJiaNowRelation[]
  army: ArmyStrength
}
