const STORAGE_KEY = 'uploadedJson'

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

export class NuLiNumRepository {
  private sectionKey = 'NuLiNum'

  async get(): Promise<number> {
    const data = await readAll()
    const value = data?.[this.sectionKey]?.value

    return typeof value === 'number' ? value : 0
  }

  async update(value: number): Promise<void> {
    const data = await readAll()

    if (!data[this.sectionKey]) {
      data[this.sectionKey] = {__type: 'System.Int32,mscorlib'}
    }

    data[this.sectionKey].value = value
    await writeAll(data)
  }
}
