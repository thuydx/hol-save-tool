import {getRows, getRowsLevel2, updateCell, updateCellByIndex, updateSubCell} from '@/lib/gameData.model'
import type {GameData} from '@/lib/gameData.model'

const STORAGE_KEY = 'uploadedJson'

export interface MemberRepository<T> {
  findMemberById(memberId: string): Promise<T | null>
}

async function readAll(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('Client only')
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : {}
}

async function writeAll(data: any): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Client only')
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export abstract class BaseRepository {
  protected abstract sectionKey: string

  /* =======================
   * READ
   * ======================= */
  async all(): Promise<any[][]> {
    return getRows(this.sectionKey)
  }

  /* =======================
   * UPDATE (CELL LEVEL)
   * ======================= */
  async updateColumn(
    rowId: string,
    colKey: string,
    value: string
  ) {
    await updateCell(this.sectionKey, rowId, colKey, value)
  }

  async updateSubColumn(
    rowId: string,
    colKey: string,
    subKey: string,
    value: string
  ) {
    await updateSubCell(
      this.sectionKey,
      rowId,
      colKey,
      subKey,
      value
    )
  }

  async updateColumnByIndex(
    rowIndex: number,
    colIndex: number,
    value: string
  ) {
    await updateCellByIndex(
      this.sectionKey,
      rowIndex,
      colIndex,
      value
    )
  }

  /* =======================
   * CREATE (ROW LEVEL)
   * ======================= */
  async createRow(row: any[]): Promise<void> {
    const data = await readAll()

    if (!data[this.sectionKey]) {
      data[this.sectionKey] = {value: []}
    }

    if (!Array.isArray(data[this.sectionKey].value)) {
      data[this.sectionKey].value = []
    }

    data[this.sectionKey].value.push(row)
    await writeAll(data)
  }

  /* =======================
   * DELETE (ROW LEVEL)
   * ======================= */
  async deleteWhere(
    predicate: (row: any[], index: number) => boolean
  ): Promise<void> {
    const data = await readAll()
    const rows = data?.[this.sectionKey]?.value

    if (!Array.isArray(rows)) return

    data[this.sectionKey].value = rows.filter(
      (row: any[], index: number) => !predicate(row, index)
    )

    await writeAll(data)
  }

  async allLevel2(): Promise<string[][]> {
    return getRowsLevel2(this.sectionKey)
  }

  protected async getRows<T = any[]>(): Promise<T> {
    return await this.getValue<T>()
  }

  /* =======================
  * READ – SINGLE ROW
  * ======================= */
  protected async getSingleRow(): Promise<any[] | null> {
    const data = await readAll()
    const section = data?.[this.sectionKey]

    if (!section || !Array.isArray(section.value)) return null

    if (section.value.length && !Array.isArray(section.value[0])) {
      return section.value
    }

    return null
  }

  /* =======================
   * UPDATE – SINGLE ROW BY INDEX
   * ======================= */
  protected async updateSingleCell(
    colIndex: number,
    value: string
  ): Promise<void> {
    const data = await readAll()
    const section = data?.[this.sectionKey]

    if (!section || !Array.isArray(section.value)) return

    if (Array.isArray(section.value[0])) {
      throw new Error(
        `${this.sectionKey} is not a single-row section`
      )
    }

    section.value[colIndex] = value
    await writeAll(data)
  }

  /* =======================
 * READ / WRITE – RAW DATA
 * ======================= */

  protected async getAllData(): Promise<GameData> {
    return await readAll()
  }

  /* =======================
   * READ / WRITE – SECTION VALUE
   * ======================= */

  protected async getValue<T = any>(): Promise<T> {
    const data = await this.getAllData()
    return data?.[this.sectionKey]?.value as T
  }

  protected async setValue<T = any>(value: T): Promise<void> {
    const data = await this.getAllData()

    if (!data[this.sectionKey]) {
      data[this.sectionKey] = {value}
    } else {
      data[this.sectionKey].value = value
    }

    await writeAll(data)
  }
}

