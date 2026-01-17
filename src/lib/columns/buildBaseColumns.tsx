import {ColumnDef} from "@/types/table";

export type ColumnSchema<T> = ColumnDef<T>[] & {
  maxAll: (row: T) => T
  upHalf: (row: T) => T
}

export function buildBaseColumns<T>(
  defs: ColumnDef<T>[],
): ColumnSchema<T> {
  const schema = defs as ColumnSchema<T>
  schema.maxAll = (row: T): T => {
    let next = row

    for (const col of schema) {
      if (col.maxValue === undefined) continue

      const max =
        typeof col.maxValue === 'function'
          ? col.maxValue(next)
          : col.maxValue

      next = col.set(next, max)
    }

    return next
  }
  schema.upHalf = (row: T): T => {
    let next = row

    for (const col of schema) {
      if (col.maxValue === undefined) continue

      const target = 50   // giá trị upHalf cố định

      next = col.set(next, target)
    }

    return next
  }
  return schema
}
