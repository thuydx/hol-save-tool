import {BaseRepository} from '@/lib/baseRepository'
import {FarmRawRow} from "@/models/farms";

export class NongZNowRepository extends BaseRepository {
  protected sectionKey = 'NongZ_now'

  /**
   * value structure:
   * value[0] = FarmRawRow[]
   */
  async getAllRows(): Promise<FarmRawRow[]> {
    const value = await this.getValue<FarmRawRow[][]>()

    return Array.isArray(value) && Array.isArray(value[0])
      ? value[0]
      : []
  }

  /**
   * Update the whole row by index
   * (row already serialized by Farm models)
   */
  async updateRowByIndex(
    rowIndex: number,
    row: FarmRawRow
  ): Promise<void> {
    const value = await this.getValue<FarmRawRow[][]>()

    if (!Array.isArray(value) || !Array.isArray(value[0])) return
    if (!value[0][rowIndex]) return

    value[0][rowIndex] = row

    await this.setValue(value)
  }
}
