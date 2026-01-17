import {BaseRepository} from '@/lib/baseRepository'
import {deserializeRow, MemberQuParsed, MemberQuRawRow, serializeRow,} from '@/lib/models/memberQu'

/**
 * Repository quản lý Member_qu (dâu / rể)
 * Tuân thủ CHÍNH XÁC BaseRepository hiện tại
 */
export class MemberQuRepository extends BaseRepository {
  protected sectionKey = 'Member_qu'

  /* =======================
   * READ
   * ======================= */

  async getAllParsed(): Promise<MemberQuParsed[]> {
    const rows = await this.getRows<MemberQuRawRow[]>()
    if (!Array.isArray(rows)) return []
    return rows.map(r => deserializeRow(r))
  }

  async getParsed(index: number): Promise<MemberQuParsed | null> {
    const rows = await this.getRows<MemberQuRawRow[]>()
    if (!rows?.[index]) return null
    return deserializeRow(rows[index])
  }

  /* =======================
   * UPDATE – SINGLE RECORD
   * ======================= */

  async updateParsed(
    index: number,
    updater: (m: MemberQuParsed) => MemberQuParsed,
  ): Promise<void> {
    const rows = await this.getRows<MemberQuRawRow[]>()
    if (!rows?.[index]) return

    const next = updater(deserializeRow(rows[index]))
    rows[index] = serializeRow(next, rows[index])

    await this.setValue(rows)
  }

  /* =======================
   * UPDATE – MULTI RECORDS
   * ======================= */

  async batchUpdate(
    updater: (m: MemberQuParsed, index: number) => MemberQuParsed | null,
  ): Promise<void> {
    const rows = await this.getRows<MemberQuRawRow[]>()
    if (!rows) return

    let changed = false

    rows.forEach((row, i) => {
      const parsed = deserializeRow(row)
      const next = updater(parsed, i)
      if (next) {
        rows[i] = serializeRow(next, row)
        changed = true
      }
    })

    if (changed) {
      await this.setValue(rows)
    }
  }
}

