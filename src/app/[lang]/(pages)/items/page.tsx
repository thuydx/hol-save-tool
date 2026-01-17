'use client'

import {useMemo, useState} from 'react'
import {useI18nClient} from '@/lib/i18nClient'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'

type I18nSchema = {
  menu: {
    items: string
  }
  common: {
    all: string
  }
  items: Record<string, string>
  'group-item-options': Record<string, string>
  'group-items': Array<Record<string, Record<string, string>>>
}

const ALL_KEY = '__ALL__'

const Items = () => {
  const {t} = useI18nClient<I18nSchema>()
  const [selectedGroup, setSelectedGroup] = useState<string>(ALL_KEY)

  // Extract to simple expressions so Hook deps are valid/stable
  const itemsDict = t.items
  const groupItemsRaw = t['group-items']
  const groupOptionsDict = t['group-item-options']

  const allItems = useMemo(() => itemsDict ?? {}, [itemsDict])

  const groupItems = useMemo<Record<string, Record<string, string>>>(
    () => groupItemsRaw?.[0] ?? {},
    [groupItemsRaw],
  )

  const groupOptions = useMemo(() => groupOptionsDict ?? {}, [groupOptionsDict])

  const tableData = useMemo(() => {
    if (selectedGroup === ALL_KEY) return allItems
    return groupItems[selectedGroup] ?? {}
  }, [selectedGroup, allItems, groupItems])

  const titleLabel =
    selectedGroup === ALL_KEY ? t.menu.items : groupOptions[selectedGroup] ?? selectedGroup

  return (
    <>
      <h1>{t.menu.items}</h1>

      <CRow>
        {/* SINGLE CARD — FILTER + TABLE */}
        <CCol md={6}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <CCardTitle>{titleLabel}</CCardTitle>

              <CDropdown alignment="end">
                <CDropdownToggle color="primary">
                  {titleLabel}
                </CDropdownToggle>
                <CDropdownMenu
                  style={{
                    maxHeight: 'calc(20 * 31px)',
                    overflowY: 'auto'
                  }}
                >

                  {/* ALL OPTION */}
                  <CDropdownItem
                    active={selectedGroup === ALL_KEY}
                    onClick={() => setSelectedGroup(ALL_KEY)}
                  >
                    {t.common.all}
                  </CDropdownItem>

                  {Object.keys(groupItems).map(groupKey => (
                    <CDropdownItem
                      key={groupKey}
                      active={selectedGroup === groupKey}
                      onClick={() => setSelectedGroup(groupKey)}
                    >
                      {groupOptions[groupKey] ?? groupKey}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
            </CCardHeader>

            <CCardBody>
              <CTable striped hover small>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{width: '30%'}}>
                      ID
                    </CTableHeaderCell>
                    <CTableHeaderCell>
                      Name
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {Object.entries(tableData).map(([id, name]) => (
                    <CTableRow key={id}>
                      <CTableDataCell className="text-start">
                        {id}
                      </CTableDataCell>
                      <CTableDataCell className="text-start">
                        {name}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Items
