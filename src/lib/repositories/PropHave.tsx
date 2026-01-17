import {BaseRepository} from '@/lib/baseRepository'

export class PropHaveRepository extends BaseRepository {
  protected sectionKey = 'Prop_have'

  async updateQuantity(id: string, value: string): Promise<void> {
    await this.updateColumn(id, 'COL_1', value)
  }
}
