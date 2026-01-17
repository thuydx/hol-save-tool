const STORAGE_KEY = 'uploadedJson'

/* -----------------------------------------
 * Low-level async storage
 * ----------------------------------------- */

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

export interface GameSection<T = any> {
  __type?: string
  value: T
}

export type GameData = Record<string, GameSection>


/* -----------------------------------------
 * Dynamic schema generation (RUNTIME)
 * ----------------------------------------- */

export async function getSchema() {
  const data = await readAll()
  const schema: any = {}

  Object.entries<any>(data).forEach(([sectionKey, section]) => {
    const columns: any = {}

    if (!Array.isArray(section?.value)) {
      schema[sectionKey] = columns
      return
    }

    // detect max column length
    let maxCols = 0
    section.value.forEach((row: any[]) => {
      if (Array.isArray(row)) {
        maxCols = Math.max(maxCols, row.length)
      }
    })

    for (let i = 0; i < maxCols; i++) {
      columns[`COL_${i}`] = {
        index: i,
        compound: false,
      }
    }

    // detect compound + subColumns
    section.value.forEach((row: any[]) => {
      if (!Array.isArray(row)) return

      row.forEach((cell, colIndex) => {
        if (typeof cell === 'string' && cell.includes('|')) {
          columns[`COL_${colIndex}`].compound = true

          const parts = cell.split('|')
          const sub = columns[`COL_${colIndex}`].subColumns ?? {}

          parts.forEach((_, i) => {
            sub[`SUB_${i}`] = i
          })

          columns[`COL_${colIndex}`].subColumns = sub
        }
      })
    })

    schema[sectionKey] = columns
  })

  return schema
}

export async function updateCellByIndex(
  sectionKey: string,
  rowIndex: number,
  colIndex: number,
  value: string
) {
  const data = await readAll()

  const rows = data?.[sectionKey]?.value
  if (!Array.isArray(rows)) return
  if (!rows[rowIndex]) return

  const next = [...rows[rowIndex]]
  next[colIndex] = value

  data[sectionKey].value = rows.map((r: any[], i: number) =>
    i === rowIndex ? next : r
  )

  await writeAll(data)
}

export async function updateValueByIndex(
  sectionKey: string,
  index: number,
  value: string
) {
  const data = await readAll()

  const arr = data?.[sectionKey]?.value
  if (!Array.isArray(arr)) return

  const next = [...arr]
  next[index] = value

  data[sectionKey].value = next
  await writeAll(data)
}


/* -----------------------------------------
 * CRUD primitives (schema aware)
 * ----------------------------------------- */

export async function getRows(sectionKey: string): Promise<any[][]> {
  const data = await readAll()
  return data?.[sectionKey]?.value ?? []
}

export async function updateCell(
  sectionKey: string,
  rowId: string,
  colKey: string,
  value: string
) {
  const data = await readAll()
  const schema = await getSchema()

  const colInfo = schema?.[sectionKey]?.[colKey]
  if (!colInfo) return

  const rows = data?.[sectionKey]?.value
  if (!Array.isArray(rows)) return

  data[sectionKey].value = rows.map((row: any[]) => {
    if (row[0] !== rowId) return row
    const next = [...row]
    next[colInfo.index] = value
    return next
  })

  await writeAll(data)
}

export async function updateSubCell(
  sectionKey: string,
  rowId: string,
  colKey: string,
  subKey: string,
  value: string
) {
  const data = await readAll()
  const schema = await getSchema()

  const colInfo = schema?.[sectionKey]?.[colKey]
  const subIndex = colInfo?.subColumns?.[subKey]

  if (!colInfo || subIndex === undefined) return

  const rows = data?.[sectionKey]?.value
  if (!Array.isArray(rows)) return

  data[sectionKey].value = rows.map((row: any[]) => {
    if (row[0] !== rowId) return row

    const next = [...row]
    const raw = next[colInfo.index]
    if (typeof raw !== 'string') return row

    const parts = raw.split('|')
    parts[subIndex] = value
    next[colInfo.index] = parts.join('|')

    return next
  })

  await writeAll(data)
}

export async function getRowsLevel2(
  sectionKey: string
): Promise<string[][]> {
  const data = await readAll()
  const value = data?.[sectionKey]?.value

  if (
    Array.isArray(value) &&
    Array.isArray(value[0]) &&
    Array.isArray(value[0][0])
  ) {
    // value[0][0] = LIST RECORDS
    return value[0] as string[][]
  }

  return []
}
