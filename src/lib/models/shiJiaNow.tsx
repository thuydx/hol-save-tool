import {ShiJiaNowParsed, ShiJiaNowRelation} from '@/types/ShiJiaNow'
import {ShiJiaNowColumn} from '@/columns/ShiJiaNow'

export class ShiJiaNowModel {
  static deserialize(row: string[], id: number): ShiJiaNowParsed {
    const relations: ShiJiaNowRelation[] = row[
      ShiJiaNowColumn.OTHER_RELATIONS
      ]
      .split('|')
      .filter(Boolean)
      .map(item => {
        const [familyId, value] = item.split('@')
        return {
          familyId: Number(familyId),
          value: Number(value),
        }
      })

    const [privateArmy, militaryPower] =
      row[ShiJiaNowColumn.ARMY_STRENGTH].split('|')

    return {
      id,
      name: row[ShiJiaNowColumn.NAME],
      level: Number(row[ShiJiaNowColumn.LEVEL]),
      relationshipIndex: Number(row[ShiJiaNowColumn.RELATIONSHIP_INDEX]),
      coordinates: row[ShiJiaNowColumn.COORDINATES] as any,
      inheritance: Number(row[ShiJiaNowColumn.INHERITANCE]),
      royalInfluence: Number(row[ShiJiaNowColumn.ROYAL_INFLUENCE]),
      relations,
      army: {
        privateArmy: Number(privateArmy),
        militaryPower: Number(militaryPower),
      },
    }
  }

  static serialize(data: ShiJiaNowParsed): string[] {
    const row = new Array(13).fill('0')

    row[ShiJiaNowColumn.NAME] = data.name
    row[ShiJiaNowColumn.LEVEL] = String(data.level)
    row[ShiJiaNowColumn.RELATIONSHIP_INDEX] = String(data.relationshipIndex)
    row[ShiJiaNowColumn.COORDINATES] = data.coordinates
    row[ShiJiaNowColumn.INHERITANCE] = String(data.inheritance)
    row[ShiJiaNowColumn.ROYAL_INFLUENCE] = String(data.royalInfluence)
    row[ShiJiaNowColumn.OTHER_RELATIONS] = data.relations
      .map(r => `${r.familyId}@${r.value}`)
      .join('|')
    row[ShiJiaNowColumn.ARMY_STRENGTH] = `${data.army.privateArmy}|${data.army.militaryPower}`

    return row
  }
}
