import React from "react";

export type ColumnDef<T> = {
  key: string
  labelKey: string
  width?: number | string
  input?: 'text' | 'number'
  get: (row: T) => any
  set: (row: T, value: any) => T
  render?: (
    row: T,
    update: (fn: (r: T) => T) => void,
    t: any,
  ) => React.ReactNode
  maxValue?: number | ((row: T) => number)
}
