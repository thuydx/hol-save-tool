import type {ShiJiaNowRelation} from '@/types/ShiJiaNow'

export type RelationMap = Record<number, number>

/**
 * Convert relation array to lookup map
 * [{familyId: 1, value: 7.6}] -> { 1: 7.6 }
 */
export function buildRelationMap(
  relations: ShiJiaNowRelation[] | undefined,
): RelationMap {
  if (!Array.isArray(relations)) return {}

  return relations.reduce((acc, r) => {
    acc[r.familyId] = r.value
    return acc
  }, {} as RelationMap)
}
