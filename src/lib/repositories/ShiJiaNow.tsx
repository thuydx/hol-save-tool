import {BaseRepository} from '@/lib/baseRepository'
import {ShiJiaNowParsed} from '@/types/ShiJiaNow'
import {ShiJiaNowModel} from '@/models/shiJiaNow'

export class ShiJiaNowRepository extends BaseRepository {
  protected sectionKey = 'ShiJia_Now'

  async getAll(): Promise<ShiJiaNowParsed[]> {
    const rows = await this.getValue<string[][]>()

    if (!Array.isArray(rows)) return []

    return rows.map(
      (row: string[], index: number): ShiJiaNowParsed =>
        ShiJiaNowModel.deserialize(row, index),
    )
  }

  async update(
    id: number,
    updater: (m: ShiJiaNowParsed) => ShiJiaNowParsed,
  ): Promise<void> {
    const rows = await this.getValue<string[][]>()
    if (!rows?.[id]) return

    const current = ShiJiaNowModel.deserialize(rows[id], id)
    const updated = updater(current)

    rows[id] = ShiJiaNowModel.serialize(updated)
    await this.setValue(rows)
  }

  async create(data: ShiJiaNowParsed): Promise<void> {
    const row = ShiJiaNowModel.serialize(data)
    await this.createRow(row)
  }

  async delete(id: number): Promise<void> {
    await this.deleteWhere((_, index) => index === id)
  }

}
