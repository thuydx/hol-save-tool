import {getRows, updateValueByIndex} from '@/lib/gameData.model'

export class CGNumRepository {
  private sectionKey = 'CGNum'

  async get() {
    const rows = await getRows(this.sectionKey)

    return {
      silver: String(rows[0] ?? '0'),
      gold: String(rows[1] ?? '0'),
      row2: String(rows[2] ?? '0'),
      row3: String(rows[3] ?? '0'),
    }
  }

  async updateSilver(value: string) {
    await updateValueByIndex(this.sectionKey, 0, value)
  }

  async updateGold(value: string) {
    await updateValueByIndex(this.sectionKey, 1, value)
  }
}
