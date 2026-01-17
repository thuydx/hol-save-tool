import {BaseRepository} from '@/lib/baseRepository'

export class FamilyDataRepository extends BaseRepository {
  protected sectionKey = 'FamilyData'

  async getData() {
    const row = await this.getSingleRow()

    if (!row) {
      return {
        coordinates: '0|0',
        name: '',
        level: '0',
        renown: '0',
        influence: '0',
        capacity: '0',
        stableCapacity: 0,
      }
    }

    return {
      coordinates: row[0],
      name: row[1],
      level: row[2],
      renown: row[3],
      influence: row[4],
      capacity: row[5],
      stableCapacity: row[6],
    }
  }

  async updateName(v: string) {
    await this.updateSingleCell(1, v)
  }

  async updateLevel(v: string) {
    await this.updateSingleCell(2, v)
  }

  async updateRenown(v: string) {
    await this.updateSingleCell(3, v)
  }

  async updateInfluence(v: string) {
    await this.updateSingleCell(4, v)
  }

  async updateCapacity(v: string) {
    await this.updateSingleCell(5, v)
  }

  async updateStableCapacity(v: string) {
    await this.updateSingleCell(6, v)
  }
}
