import {BaseRepository} from '@/lib/baseRepository'
import {KingCityDataParsed} from '@/types/KingCityData'
import {KingCityDataModel} from '@/models/kingCityData'

export class KingCityDataRepository extends BaseRepository {
  protected sectionKey = 'KingCityData_now'

  async get(): Promise<KingCityDataParsed> {
    const row = await this.getValue<string[]>()
    if (!Array.isArray(row)) {
      throw new Error('Invalid KingCityData_now')
    }
    return KingCityDataModel.deserialize(row)
  }

  async save(data: KingCityDataParsed): Promise<void> {
    const row = KingCityDataModel.serialize(data)
    await this.setValue(row)
  }
}
