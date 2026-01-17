import {buildRelationMap} from '@/services/shiJiaNowRelationship'
import {ShiJiaNowParsed} from "@/types/ShiJiaNow";

export const RELATION_NA = -1

export function buildRelationMatrix(
  families: ShiJiaNowParsed[],
): number[][] {
  return families.map((familyA, i) => {
    const map = buildRelationMap(familyA.relations)

    return families.map((_, j) => {
      if (i === j) return RELATION_NA   // cùng gia tộc
      return map[j] ?? 0               // khác gia tộc → 0%
    })
  })
}
