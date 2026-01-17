import {FengdiCompound, FengdiState, KingCityDataParsed,} from '@/types/KingCityData'
import {KING_CITY_COLUMN_COUNT, KingCityDataColumn,} from '@/columns/KingCityData'

export class KingCityDataModel {
  /* ---------- helpers ---------- */

  static deserialize(row: string[]): KingCityDataParsed {
    const fengdi: FengdiCompound[] = []

    for (
      let i = KingCityDataColumn.FENGDI_START;
      i <= KingCityDataColumn.FENGDI_END;
      i++
    ) {
      fengdi.push(
        this.parseFengdi(
          row[i],
          i - KingCityDataColumn.FENGDI_START,
        ),
      )
    }

    return {
      capital: this.parseCapital(
        row[KingCityDataColumn.CAPITAL],
      ),
      fengdi,
      treasury: Number(row[KingCityDataColumn.TREASURY]),
      unknown14:
        row[KingCityDataColumn.UNKNOWN_COL14] === 'null'
          ? null
          : row[KingCityDataColumn.UNKNOWN_COL14],
      unknown15: row[KingCityDataColumn.UNKNOWN_COL15],
    }
  }

  static serialize(data: KingCityDataParsed): string[] {
    const row = new Array(KING_CITY_COLUMN_COUNT).fill('null')

    row[KingCityDataColumn.CAPITAL] =
      `${data.capital.troop}|${data.capital.loyalty}`

    data.fengdi.forEach(f => {
      row[
        KingCityDataColumn.FENGDI_START
        ] = this.serializeFengdi(f)
    })

    row[KingCityDataColumn.TREASURY] =
      String(data.treasury)

    row[KingCityDataColumn.UNKNOWN_COL14] =
      data.unknown14 ?? 'null'

    row[KingCityDataColumn.UNKNOWN_COL15] =
      String(data.unknown15)

    return row
  }

  private static parseCapital(value: string) {
    const [troop, loyalty] = value.split('|')
    return {
      troop: Number(troop),
      loyalty: Number(loyalty),
    }
  }

  /* ---------- public ---------- */

  private static parseFengdi(
    raw: string,
    index: number,
  ): FengdiCompound {
    const [stateRaw, memberRaw] = raw.split('|')

    return {
      index,
      state: Number(stateRaw) as FengdiState,
      memberRef: memberRaw === 'null' ? null : memberRaw,
    }
  }

  private static serializeFengdi(f: FengdiCompound): string {
    return `${f.state}|${f.memberRef ?? 'null'}`
  }
}
