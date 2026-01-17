import {BaseRepository} from '@/lib/baseRepository'
import {ShiJiaKingParsed} from "@/types/ShiJiaKing";
import {ShiJiaKingModel} from "@/models/shiJiaKing";

export class ShiJiaKingRepository extends BaseRepository {
  protected sectionKey = 'ShiJia_king'

  async get(): Promise<ShiJiaKingParsed> {
    const row = await this.getValue<string[]>()
    if (!Array.isArray(row)) {
      throw new Error('ShiJia_king data is invalid')
    }
    return ShiJiaKingModel.deserialize(row)
  }

  async save(data: ShiJiaKingParsed): Promise<void> {
    const row = ShiJiaKingModel.serialize(data)
    await this.setValue(row)
  }
}

