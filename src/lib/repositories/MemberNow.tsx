import {BaseRepository, MemberRepository} from '@/lib/baseRepository'
import {
  deserializeAll,
  MemberColumn,
  MemberOfficialTitle,
  MemberParsed,
  MemberRawRow,
  serializeAll,
  serializeOfficialTitle,
} from '@/models/members'

/**
 * HOW TO USE
 * const repo = useMemo(() => new Member_nowRepository(), [])
 *
 * useEffect(() => {
 *   repo.getParsed(0).then(setMember)
 * }, [])
 *
 * const onChangeAge = async () => {
 *   await repo.updateParsed(0, m => ({
 *     ...m,
 *     age: m.age + 1,
 *   }))
 * }
 */
export class MemberNowRepository extends BaseRepository implements MemberRepository<MemberParsed> {
  protected sectionKey = 'Member_now'

  async findMemberById(memberId: string): Promise<MemberParsed | null> {
    const members = await this.getParsedAll()
    for (const member of members) {
      if (member.id === memberId) {
        return member
      }
    }
    return null
  }

  /* =======================
   * RAW ACCESS
   * ======================= */

  async getRawRow(index: number): Promise<MemberRawRow | null> {
    const rows = await this.getRows<MemberRawRow[]>()
    return rows?.[index] ?? null
  }

  async setRawCell(
    rowIndex: number,
    column: MemberColumn,
    value: string,
  ): Promise<void> {
    const rows = await this.getRows<MemberRawRow[]>()
    if (!rows) return
    rows[rowIndex][column] = value
    await this.setValue(rows)
  }

  /* =======================
   * PARSE
   * ======================= */
  async getParsed(rowIndex: number): Promise<MemberParsed | null> {
    const rows = await this.getRows<MemberRawRow[]>()
    if (!rows?.[rowIndex]) return null

    return deserializeAll(rows[rowIndex])
  }

  async getParsedAll(): Promise<MemberParsed[]> {
    const rows = await this.getRows<MemberRawRow[]>()
    if (!rows || !Array.isArray(rows)) return []
    return rows
      .map((row) => deserializeAll(row))
      .filter(Boolean)
  }


  /* =======================
   * UPDATE (COMPLETE)
   * ======================= */

  async updateParsed(
    rowIndex: number,
    updater: (m: MemberParsed) => MemberParsed,
  ): Promise<void> {
    const rows = await this.getRows<MemberRawRow[]>()
    if (!rows?.[rowIndex]) return

    const current = deserializeAll(rows[rowIndex])
    const next = updater(current)

    rows[rowIndex] = serializeAll(next, rows[rowIndex])

    await this.setValue(rows) // 🔥 1 lần writeAll
  }

  /**
   * Batch update (N rows – 1 writeAll)
   * @param updater
   *
   * How to use
   * await repo.batchUpdate(m => ({
   *   ...m,
   *   age: m.age + 1,
   * }))
   */
  async batchUpdate(
    updater: (m: MemberParsed, rowIndex: number) => MemberParsed | null,
  ): Promise<void> {
    const rows = await this.getRows<MemberRawRow[]>()
    if (!rows) return

    let changed = false

    rows.forEach((row, index) => {
      const parsed = deserializeAll(row)
      const next = updater(parsed, index)

      if (next) {
        rows[index] = serializeAll(next, row)
        changed = true
      }
    })

    if (changed) {
      await this.setValue(rows) // 🔥 chỉ 1 lần
    }
  }

  async batchUpdateByIndexes(
    indexes: number[],
    updater: (m: MemberParsed) => MemberParsed,
  ): Promise<void> {
    const rows = await this.getRows<MemberRawRow[]>()
    if (!rows) return

    indexes.forEach(i => {
      if (!rows[i]) return
      const parsed = deserializeAll(rows[i])
      rows[i] = serializeAll(updater(parsed), rows[i])
    })

    await this.setValue(rows)
  }

  async getChiefMember() {
    const rows = await this.getRows<MemberRawRow[]>()
    if (!Array.isArray(rows)) {
      return undefined
    }
    for (const row of rows) {
      const parsed = deserializeAll(row)
      if (parsed.isHeadOfFamily) {
        return parsed
      }
    }
    return undefined
  }

  async updateTitleFengdi(
    level: number,
    prefectureId: number
  ): Promise<void> {
    const index = await this.findChiefIndex()
    if (index === null) return

    const serialized = `${level}|${prefectureId}`

    await this.updateColumnByIndex(
      index,
      MemberColumn.TITLE_FENGDI,
      serialized
    )
  }

  async updateOfficialTitle(abcKey: string): Promise<void> {
    const index = await this.findChiefIndex()
    if (index === null) return

    // 🔥 VALIDATE
    if (!/^\d+@\d+@\d+$/.test(abcKey)) {
      console.error('Invalid abcKey:', abcKey)
      return
    }

    const [a, b, c] = abcKey.split('@').map(v => Number(v))

    if ([a, b, c].some(n => Number.isNaN(n))) {
      console.error('NaN official title:', abcKey)
      return
    }

    const rows = await this.getRows<MemberRawRow[]>()
    const parsed = deserializeAll(rows[index])

    const next: MemberOfficialTitle = {
      identity: a,
      rank: b,
      position: c,
      prefectureId: parsed.officialTitle?.prefectureId ?? -1,
      countyId: parsed.officialTitle?.countyId ?? -1,
      politicalAchievement:
        parsed.officialTitle?.politicalAchievement ?? 0,
      i18nKey: `${a}@${b}@${c}`,
    }

    const serialized = serializeOfficialTitle(next)

    await this.updateColumnByIndex(
      index,
      MemberColumn.OFFICIAL_TITLE,
      serialized
    )
  }

  private async findChiefIndex(): Promise<number | null> {
    const rows = await this.getRows<MemberRawRow[]>()

    for (let i = 0; i < rows.length; i++) {
      const parsed = deserializeAll(rows[i])
      if (parsed.isHeadOfFamily) {
        return i
      }
    }

    return null
  }

}
