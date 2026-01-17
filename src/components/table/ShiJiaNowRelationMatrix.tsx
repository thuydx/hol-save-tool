import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {buildRelationMatrix, RELATION_NA} from '@/lib/services/buildRelationMatrix'
import type {ShiJiaNowParsed} from '@/types/ShiJiaNow'

type Props = {
  families: ShiJiaNowParsed[]
}

export function ShiJiaNowRelationMatrix({families}: Props) {
  const matrix = buildRelationMatrix(families)

  return (
    <CCard className="mt-4">
      <CCardHeader>Ma trận quan hệ gia tộc</CCardHeader>

      <CCardBody style={{overflowX: 'auto'}}>
        <CTable small bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Tộc thị</CTableHeaderCell>
              {families.map(f => (
                <CTableHeaderCell
                  key={f.id}
                  className="text-center"
                >
                  {f.name}
                </CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {matrix.map((row, i) => (
              <CTableRow key={i}>
                {/* Row header */}
                <CTableHeaderCell>
                  {families[i].name}
                </CTableHeaderCell>

                {row.map((val, j) => {
                  // 🔻 lower-left triangle → empty
                  if (j < i) {
                    return (
                      <CTableDataCell
                        key={j}
                        className="bg-light"
                      />
                    )
                  }

                  // 🔸 diagonal
                  if (i === j) {
                    return (
                      <CTableDataCell
                        key={j}
                        className="text-center text-muted"
                      >
                        —
                      </CTableDataCell>
                    )
                  }

                  // 🔺 upper-right triangle
                  return (
                    <CTableDataCell
                      key={j}
                      className="text-center"
                    >
                      {val === RELATION_NA ? '0%' : `${val}%`}
                    </CTableDataCell>
                  )
                })}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}
