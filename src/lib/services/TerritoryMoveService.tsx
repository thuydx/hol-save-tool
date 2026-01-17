import {CunNowRepository} from '@/repositories/CunNow'
import {ZhenNowRepository} from '@/repositories/ZhenNow'
import {JunYingNowRepository} from '@/repositories/JunYingNow'

export type TerritoryType = 'cun' | 'zhen' | 'junying'

/**
 * Repository singletons
 */
const cunRepo = new CunNowRepository()
const zhenRepo = new ZhenNowRepository()
const junRepo = new JunYingNowRepository()

// const REPO_MAP: Record<
//   TerritoryType,
//   {
//     getGroupRows: (fengdiIndex: number) => Promise<string[][]>
//     removeRowByKey: (
//       fengdiIndex: number,
//       key: string
//     ) => Promise<string[] | null>
//     appendRowToGroup: (
//       fengdiIndex: number,
//       row: string[]
//     ) => Promise<void>
//   }
// > = {
//   cun: cunRepo,
//   zhen: zhenRepo,
//   junying: junRepo
// }

const REPO_MAP = {
  cun: cunRepo,
  zhen: zhenRepo,
  junying: junRepo
} as const

/* =========================================================
 * TRANSFORM HELPERS
 * =======================================================*/

/**
 * Cun / Zhen -> JunYing
 */
function toJunYingRow(
  source: string[],
  campName: string
): string[] {
  const area = Number(source[1] ?? 0)

  const row: string[] = []
  row[0] = source[0]               // coordinates
  row[1] = source[1]               // area
  row[2] = source[2]               // soldiers <- population
  row[3] = String(area * 10)       // combat
  row[4] = source[3]               // loyalty <- happy
  row[5] = source[4]               // lowEquip <- business
  row[6] = source[5]               // highEquip <- agriculture
  row[7] = campName                // campName (popup)
  row[8] = '500'                   // salary (static)

  return row
}

/**
 * JunYing -> Cun / Zhen
 */
function fromJunYingRow(
  source: string[]
): string[] {
  const row: string[] = []
  row[0] = source[0]               // coordinates
  row[1] = source[1]               // area
  row[2] = source[2]               // population <- soldiers
  row[3] = source[4]               // happy <- loyalty
  row[4] = source[5]               // business <- lowEquip
  row[5] = source[6]               // agriculture <- highEquip
  row[6] = '0'                     // unknow (default)
  row[7] = '14'                    // unknow (default)

  return row
}

function validateToJunYing(
  source: string[],
  campName?: string
) {
  if (!campName || !campName.trim()) {
    throw new Error('campName is required')
  }

  const area = Number(source[1])
  if (Number.isNaN(area) || area <= 0) {
    throw new Error('Invalid area value')
  }
}

export class TerritoryMoveService {
  static async moveRecord(opts: {
    from: TerritoryType
    to: TerritoryType
    fengdiIndex: number
    key: string
    campName?: string
  }): Promise<void> {
    const {from, to, fengdiIndex, key, campName} = opts

    if (from === to) return

    const fromRepo = REPO_MAP[from]
    const toRepo = REPO_MAP[to]

    const removedRow =
      await fromRepo.removeRowByKey(
        fengdiIndex,
        key
      )

    if (!removedRow) return

    let targetRow = removedRow

    // ✅ VALIDATE + TRANSFORM
    if (to === 'junying' && from !== 'junying') {
      validateToJunYing(removedRow, campName)

      targetRow = toJunYingRow(
        removedRow,
        campName!
      )
    }

    if (from === 'junying' && to !== 'junying') {
      targetRow = fromJunYingRow(removedRow)
    }

    await toRepo.appendRowToGroup(
      fengdiIndex,
      targetRow
    )
  }
}

//
// /**
//  * TerritoryMoveService
//  *
//  * - MOVE = CUT & PASTE
//  * - Invariant (49) là global rule, không enforce per operation
//  */
// export class TerritoryMoveService {
//   // /**
//   //  * MOVE record giữa các bảng
//   //  */
//   // static async moveRecord(opts: {
//   //   from: TerritoryType
//   //   to: TerritoryType
//   //   fengdiIndex: number
//   //   key: string
//   // }): Promise<void> {
//   //   const { from, to, fengdiIndex, key } = opts
//   //
//   //   if (from === to) return
//   //
//   //   const fromRepo = REPO_MAP[from]
//   //   const toRepo = REPO_MAP[to]
//   //
//   //   // CUT
//   //   const removedRow = await fromRepo.removeRowByKey(
//   //     fengdiIndex,
//   //     key
//   //   )
//   //
//   //   if (!removedRow) {
//   //     console.warn(
//   //       '[TerritoryMoveService] Record not found',
//   //       { from, key }
//   //     )
//   //     return
//   //   }
//   //
//   //   // PASTE
//   //   await toRepo.appendRowToGroup(
//   //     fengdiIndex,
//   //     removedRow
//   //   )
//   // }
//
//   /**
//    * MOVE record giữa các bảng
//    * Có transform schema nếu cần
//    */
//   static async moveRecord(opts: {
//     from: TerritoryType
//     to: TerritoryType
//     fengdiIndex: number
//     key: string              // coordinates
//     campName?: string        // chỉ cần khi move -> JunYing
//   }): Promise<void> {
//     const { from, to, fengdiIndex, key, campName } = opts
//
//     if (from === to) return
//
//     const fromRepo = REPO_MAP[from]
//     const toRepo = REPO_MAP[to]
//
//     /* ---------- CUT ---------- */
//     const removedRow =
//       await fromRepo.removeRowByKey(
//         fengdiIndex,
//         key
//       )
//
//     if (!removedRow) return
//
//     /* ---------- TRANSFORM ---------- */
//     let targetRow: string[] = removedRow
//
//     if (to === 'junying' && from !== 'junying') {
//       targetRow = toJunYingRow(
//         removedRow,
//         campName ?? 'Unknown Camp'
//       )
//     }
//
//     if (from === 'junying' && to !== 'junying') {
//       targetRow = fromJunYingRow(removedRow)
//     }
//
//     /* ---------- PASTE ---------- */
//     await toRepo.appendRowToGroup(
//       fengdiIndex,
//       targetRow
//     )
//   }
//
//   /**
//    * Chủ động check tổng record (debug / dev)
//    */
//   static async assertTotalRecords(
//     fengdiIndex: number,
//     expected = 49
//   ): Promise<boolean> {
//     const [cun, zhen, jun] = await Promise.all([
//       cunRepo.getGroupRows(fengdiIndex),
//       zhenRepo.getGroupRows(fengdiIndex),
//       junRepo.getGroupRows(fengdiIndex)
//     ])
//
//     const total =
//       cun.length + zhen.length + jun.length
//
//     if (total !== expected) {
//       console.error(
//         '[TerritoryMoveService] ❌ Total record mismatch',
//         {
//           fengdiIndex,
//           expected,
//           actual: total,
//           breakdown: {
//             cun: cun.length,
//             zhen: zhen.length,
//             junying: jun.length
//           }
//         }
//       )
//       return false
//     }
//
//     return true
//   }
//
//   /**
//    * Lấy tổng record (UI / debug)
//    */
//   static async getTotalRecords(
//     fengdiIndex: number
//   ): Promise<number> {
//     const [cun, zhen, jun] = await Promise.all([
//       cunRepo.getGroupRows(fengdiIndex),
//       zhenRepo.getGroupRows(fengdiIndex),
//       junRepo.getGroupRows(fengdiIndex)
//     ])
//
//     return cun.length + zhen.length + jun.length
//   }
// }
