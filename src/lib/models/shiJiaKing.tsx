import {ShiJiaKingParsed} from '@/types/ShiJiaKing'
import {SHIJIA_KING_COLUMN_COUNT, ShiJiaKingColumn} from '@/columns/ShiJiaKing'

export class ShiJiaKingModel {
  static deserialize(row: string[]): ShiJiaKingParsed {
    const relations =
      row[ShiJiaKingColumn.OTHER_RELATIONS]?.length
        ? row[ShiJiaKingColumn.OTHER_RELATIONS]
          .split('|')
          .map(item => {
            const [familyId, value] = item.split('@')
            return {
              familyId: Number(familyId),
              value: Number(value),
            }
          })
        : []

    return {
      name: row[ShiJiaKingColumn.NAME],
      level: Number(row[ShiJiaKingColumn.LEVEL]),
      relationshipIndex: Number(row[ShiJiaKingColumn.RELATIONSHIP_INDEX]),
      unknownCol3: Number(row[ShiJiaKingColumn.UNKNOWN_3]),
      unknownCol4:
        row[ShiJiaKingColumn.UNKNOWN_4] === 'null'
          ? null
          : Number(row[ShiJiaKingColumn.UNKNOWN_4]),
      relations,
    }
  }

  static serialize(data: ShiJiaKingParsed): string[] {
    const row = new Array(SHIJIA_KING_COLUMN_COUNT).fill('null')

    row[ShiJiaKingColumn.NAME] = data.name
    row[ShiJiaKingColumn.LEVEL] = String(data.level)
    row[ShiJiaKingColumn.RELATIONSHIP_INDEX] =
      String(data.relationshipIndex)

    row[ShiJiaKingColumn.UNKNOWN_3] =
      data.unknownCol3 != null ? String(data.unknownCol3) : 'null'

    row[ShiJiaKingColumn.UNKNOWN_4] =
      data.unknownCol4 != null ? String(data.unknownCol4) : 'null'

    row[ShiJiaKingColumn.OTHER_RELATIONS] =
      data.relations
        .map(r => `${r.familyId}@${r.value}`)
        .join('|')

    return row
  }
}
