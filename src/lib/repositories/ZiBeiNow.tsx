import {BaseRepository} from '@/lib/baseRepository'

export type ZiBeiItem = {
  name: string
  level: string
  position: string
}

export class ZiBeiNowRepository extends BaseRepository {
  protected sectionKey = 'ZiBei_Now'

  async getData(): Promise<ZiBeiItem[]> {
    const raw = localStorage.getItem('uploadedJson')
    if (!raw) return []

    const json = JSON.parse(raw)
    const value = json?.[this.sectionKey]?.value

    if (!Array.isArray(value)) return []

    // value: string[]
    return (value as string[]).map((row) => {
      const [name = '', level = '', position = ''] = row.split('|')
      return {name, level, position}
    })
  }

  async updateZibei(index: number, value: string) {
    const rows = await this.getData()
    const item = rows[index]
    if (!item) return

    item.name = value
    await this.saveAt(index, item)
  }

  async updateZibeiLevel(index: number, value: string) {
    const rows = await this.getData()
    const item = rows[index]
    if (!item) return

    item.level = value
    await this.saveAt(index, item)
  }

  async updateZibeiPosition(index: number, value: string) {
    const rows = await this.getData()
    const item = rows[index]
    if (!item) return

    item.position = value
    await this.saveAt(index, item)
  }

  async create(item: ZiBeiItem) {
    const raw = localStorage.getItem('uploadedJson')
    if (!raw) return

    const json = JSON.parse(raw)
    json[this.sectionKey].value.push(
      `${item.name}|${item.level}|${item.position}`
    )

    localStorage.setItem('uploadedJson', JSON.stringify(json))
  }

  async delete(index: number) {
    const raw = localStorage.getItem('uploadedJson')
    if (!raw) return

    const json = JSON.parse(raw)
    json[this.sectionKey].value.splice(index, 1)

    localStorage.setItem('uploadedJson', JSON.stringify(json))
  }

  private async saveAt(
    index: number,
    item: ZiBeiItem
  ): Promise<void> {
    const raw = localStorage.getItem('uploadedJson')
    if (!raw) return

    const json = JSON.parse(raw)
    const value = json?.[this.sectionKey]?.value

    if (!Array.isArray(value)) return

    value[index] = `${item.name}|${item.level}|${item.position}`

    json[this.sectionKey].value = value
    localStorage.setItem('uploadedJson', JSON.stringify(json))
  }
}
