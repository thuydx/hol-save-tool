import {BaseRepository} from '@/lib/baseRepository'

export class HorseHaveRepository extends BaseRepository {
  protected sectionKey = 'Horse_Have'

  /* ---------- Row level ---------- */

  async create(row: any[]): Promise<void> {
    return super.createRow(row)
  }

  async deleteByIndexes(indexes: Set<number>): Promise<void> {
    return super.deleteWhere((_, index) => indexes.has(index))
  }

  /* ---------- Cell level (SAFE) ---------- */

  async updateByIndex(
    rowIndex: number,
    colIndex: number,
    value: string
  ): Promise<void> {
    await this.updateColumnByIndex(rowIndex, colIndex, value)
  }
}
