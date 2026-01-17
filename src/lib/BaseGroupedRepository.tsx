import {BaseRepository} from '@/lib/baseRepository'

export abstract class BaseGroupedRepository<T extends any[]>
  extends BaseRepository {

  /** READ rows of ONE group */
  async getGroupRows(
    fengdiIndex: number
  ): Promise<T[]> {
    const groups = await this.getValue<T[][]>()
    return groups?.[fengdiIndex] ?? []
  }

  /** WRITE rows of ONE group */
  async setGroupRows(
    fengdiIndex: number,
    rows: T[]
  ) {
    const groups = await this.getValue<T[][]>()
    groups[fengdiIndex] = rows
    await this.setValue(groups)
  }

  async removeRowByKey(
    fengdiIndex: number,
    key: string
  ): Promise<string[] | null> {
    const rows = await this.getGroupRows(fengdiIndex)
    const index = rows.findIndex(r => r[0] === key)
    if (index === -1) return null

    const [removed] = rows.splice(index, 1)
    await this.setGroupRows(fengdiIndex, rows)
    return removed
  }

  async appendRowToGroup(
    fengdiIndex: number,
    row: string[]
  ): Promise<void> {
    const rows = await this.getGroupRows(fengdiIndex)
    rows.push(row as T)
    await this.setGroupRows(fengdiIndex, rows)
  }

}
