import {BaseRepository} from '@/lib/baseRepository'
import {deserializeMenKeNow, MenKeNowParsed, MenKeNowRawRow, serializeMenKeNow,} from '@/models/menKeNow'

export class MenKeNowRepository extends BaseRepository {
  protected sectionKey = 'MenKe_Now'

  /* =======================
   * READ
   * ======================= */
  async getParsed(index: number): Promise<MenKeNowParsed | null> {
    const rows = await this.getRows<MenKeNowRawRow[]>()
    if (!rows?.[index]) return null
    return deserializeMenKeNow(rows[index])
  }

  async updateParsed(
    index: number,
    updater: (m: MenKeNowParsed) => MenKeNowParsed,
  ): Promise<void> {
    const rows = await this.getRows<MenKeNowRawRow[]>()
    if (!rows?.[index]) return

    const next = updater(deserializeMenKeNow(rows[index]))
    rows[index] = serializeMenKeNow(next, rows[index])

    await this.setValue(rows)
  }

  /* =======================
   * UPDATE – SINGLE RECORD
   * ======================= */

  /* =======================
   * UPDATE – MULTI RECORDS
   * ======================= */
  async batchUpdate(
    updater: (m: MenKeNowParsed, index: number) => MenKeNowParsed | null,
  ): Promise<void> {
    const rows = await this.getRows<MenKeNowRawRow[]>()
    if (!rows) return

    let changed = false

    rows.forEach((row, i) => {
      const parsed = deserializeMenKeNow(row)
      const next = updater(parsed, i)
      if (next) {
        rows[i] = serializeMenKeNow(next, row)
        changed = true
      }
    })

    if (changed) {
      await this.setValue(rows)
    }
  }

  protected parseRow(row: MenKeNowRawRow): MenKeNowParsed {
    return deserializeMenKeNow(row)
  }
}
