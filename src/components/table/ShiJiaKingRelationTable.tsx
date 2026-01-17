import {CTable, CTableBody, CTableDataCell, CTableRow,} from '@coreui/react'

import {ShiJiaKingRelation} from '@/types/ShiJiaKing'
import {buildFamilyTitle} from '@/lib/services/buildTitle'

type Props = {
  relations: ShiJiaKingRelation[]
  otherFamilies: any[]
  t: any
}

export function ShiJiaKingRelationTable({
                                          relations,
                                          otherFamilies,
                                          t,
                                        }: Props) {
  if (!relations.length) return <>—</>

  return (
    <CTable small bordered>
      <CTableBody>
        {relations.map(r => {
          const family = otherFamilies[r.familyId]
          if (!family) return null

          const title = buildFamilyTitle(
            family.coordinates,
            family.name,
            t,
          )

          return (
            <CTableRow key={r.familyId}>
              <CTableDataCell width={30}>
                {title}
              </CTableDataCell>
              <CTableDataCell style={{width: 80}}>
                {r.value}%
              </CTableDataCell>
            </CTableRow>
          )
        })}
      </CTableBody>
    </CTable>
  )
}
