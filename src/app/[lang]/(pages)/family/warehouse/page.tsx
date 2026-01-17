'use client'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CToast,
  CToastBody,
  CToastHeader
} from '@coreui/react'
import React, {useEffect, useMemo, useState} from 'react'
import {useI18nClient} from '@/lib/i18nClient'
import {useWarehouse} from '@/lib/hooks/warehouse'
import {ALL_KEY} from '@/lib/models/warehouse'
import {GuideLineData, useGuideLine} from "@/providers/GuideLine";
import {renderI18nWithHighlight} from "@/components/guide/renderI18nWithHighlight";
import {ItemIcon} from "@/components/item/ItemIcon";

const WarehousePage = () => {
  const {t} = useI18nClient<any>()
  const [toast, setToast] = useState<string | null>(null)
  const [bulkProgress, setBulkProgress] = useState<{
    visible: boolean
    current: number
    total: number
    done: boolean
  }>({
    visible: false,
    current: 0,
    total: 0,
    done: false,
  })
  const ids = Array.from({ length: 285 }, (_, i) => String(i))
  const items = t.items ?? {}
  const groupItems = t['group-items']?.[0] ?? {}
  const groupOptions = t['group-item-options'] ?? {}
  const {
    warehouse,
    rightTableData,
    selectedGroup,
    setSelectedGroup,

    selectedLeft,
    selectedRight,

    toggleLeft,
    toggleRight,
    toggleSelectAllLeft,
    toggleSelectAllRight,

    isAllLeftSelected,
    isAllRightSelected,

    addToWarehouse,
    deleteFromWarehouse,
    updateQuantity,
  } = useWarehouse(items, groupItems)

  const canBulkAction = selectedLeft.size > 0

  const increaseQuantity = async (amount: number, ids: string[]) => {
    for (const id of ids) {
      const row = warehouse.find(w => w.id === id)
      if (!row) continue

      const current = parseInt(row.quantity || '0', 10)
      const next = current + amount

      await updateQuantity(id, String(next))
    }
  }

  const bulkIncreaseQuantity = async (amount: number) => {
    const ids = Array.from(selectedLeft)
    const total = ids.length

    setBulkProgress({
      visible: true,
      current: 0,
      total,
      done: false,
    })

    // clone warehouse data
    const map = new Map(warehouse.map(w => [w.id, Number(w.quantity || 0)]))

    const CHUNK_SIZE = 15
    let processed = 0

    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      const chunk = ids.slice(i, i + CHUNK_SIZE)

      // update local data
      for (const id of chunk) {
        map.set(id, (map.get(id) ?? 0) + amount)
      }

      // persist chunk (repository)
      for (const id of chunk) {
        await updateQuantity(id, String(map.get(id)))
      }

      processed += chunk.length

      setBulkProgress(p => ({
        ...p,
        current: processed,
      }))

      // yield main thread
      await new Promise(r => setTimeout(r, 0))
    }

    setBulkProgress(p => ({
      ...p,
      current: total,
      done: true,
    }))

    // auto close after 5s
    setTimeout(() => {
      setBulkProgress(p => ({...p, visible: false}))
    }, 5000)
  }

  const rightTitle = selectedGroup === ALL_KEY ? t.menu.items : groupOptions[selectedGroup] ?? selectedGroup
  {/* INFO */}
  const guideLineData = useMemo<GuideLineData>(() => ({
    title: t.guide.title,
    description: t.guide.warehouse.description,
    content: (
      <>
        <CRow>
          <CCol xs="4">
            <CCard style={{border: "none"}}>
              <CCardTitle>{t.guide.warehouse.section_1.title}</CCardTitle>
              <CCardBody>
                {renderI18nWithHighlight(
                  t.guide.warehouse.section_1.content,
                  {
                    right: {
                      text: t.guide.warehouse.section_1.right,
                      // style: { color: '#51cc8a', fontWeight: 600 },
                      className: "text-success"
                    },
                    left: {
                      text: t.guide.warehouse.section_1.left,
                      // style: { color: '#51cc8a', fontWeight: 600 },
                      className: "text-success"
                    },
                    add: {
                      text: t.guide.warehouse.section_1.add,
                      className: "btn btn-primary btn-sm"
                    },
                    remove: {
                      text: t.guide.warehouse.section_1.remove,
                      className: "btn btn-danger btn-sm"
                    }
                  }
                )}
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs="4">
            <CCard style={{border: "none"}}>
              <CCardTitle>{t.guide.warehouse.section_2.title}</CCardTitle>
              <CCardBody>{renderI18nWithHighlight(
                t.guide.warehouse.section_2.content,
                {
                  button10: {
                    text: t.guide.warehouse.section_2.button10,
                    className: "btn btn-outline-success btn-sm"
                  },
                  button100: {
                    text: t.guide.warehouse.section_2.button100,
                    className: "btn btn-outline-primary btn-sm"
                  },
                  button1000: {
                    text: t.guide.warehouse.section_2.button1000,
                    className: "btn btn-outline-warning btn-sm"
                  },
                  button10000: {
                    text: t.guide.warehouse.section_2.button10000,
                    className: "btn btn-outline-danger btn-sm"
                  }
                }
              )}</CCardBody>
            </CCard>
          </CCol>
          <CCol xs="4">
            <CCard style={{border: "none"}}>
              <CCardTitle>{t.guide.warehouse.section_3.title}</CCardTitle>
              <CCardBody>{renderI18nWithHighlight(
                t.guide.warehouse.section_3.content,
                {
                  button: {
                    text: t.guide.warehouse.section_3.button,
                    className: "btn dropdown-toggle btn-primary btn-sm"
                  }
                }
              )}</CCardBody>
            </CCard>
          </CCol>
        </CRow>
        {/*<h6>{t.guide.upload.section_1.content} </h6>*/}
        {/*  <p> </p>*/}
      </>
    ),
  }), [t])

  const { setGuideData } = useGuideLine()
  useEffect(() => {
    setGuideData(guideLineData)
    return () => setGuideData(null)
  }, [setGuideData, guideLineData])

  return (
    <>
      {/* TOAST */}
      {toast && (
        <CToast visible autohide delay={3000} color="success" onClose={() => setToast(null)}>
          <CToastHeader closeButton>
            <strong className="me-auto">
              {t.uploader.toastTitle}
            </strong>
          </CToastHeader>
          <CToastBody>{toast}</CToastBody>
        </CToast>
      )}
      <CRow className="mt-3">

        {/* LEFT — WAREHOUSE */}
        <CCol md={6}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <CCardTitle className="d-inline-flex align-items-center gap-2"><ItemIcon id="warehouse" iconSet="main" /> {t.warehouse.title}</CCardTitle>
              <div className="d-flex gap-1">
                <CButton color="success" variant="outline" size="sm"
                         disabled={!canBulkAction}
                         onClick={() => bulkIncreaseQuantity(10)}
                >
                  {t.common.plus10}
                </CButton>

                <CButton color="primary" variant="outline" size="sm"
                         disabled={!canBulkAction}
                         onClick={() => bulkIncreaseQuantity(100)}
                >
                  {t.common.plus100}
                </CButton>

                <CButton color="warning" variant="outline" size="sm"
                         disabled={!canBulkAction}
                         onClick={() => bulkIncreaseQuantity(1000)}
                >
                  {t.common.plus1000}
                </CButton>

                <CButton color="danger" variant="outline" size="sm"
                         disabled={!canBulkAction}
                         onClick={() => bulkIncreaseQuantity(1000)}
                >
                  {t.common.plus10000}
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <CTable striped hover small>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>
                      <input
                        type="checkbox"
                        checked={isAllLeftSelected}
                        onChange={toggleSelectAllLeft}
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell>{t.warehouse.id}</CTableHeaderCell>
                    <CTableHeaderCell colSpan={2}>{t.warehouse.name}</CTableHeaderCell>
                    <CTableHeaderCell>{t.warehouse.quantity}</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">{t.common.action}</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {warehouse.map(row => (
                    <CTableRow key={row.id} active={selectedLeft.has(row.id)}>
                      <CTableDataCell>
                        <input
                          type="checkbox"
                          checked={selectedLeft.has(row.id)}
                          onChange={() => toggleLeft(row.id)}
                        />
                      </CTableDataCell>
                      <CTableDataCell role="button" onClick={() => toggleLeft(row.id)}>
                        {row.id}
                      </CTableDataCell>
                      <CTableDataCell role="button" onClick={() => toggleLeft(row.id)}>
                        <div className="d-flex align-items-center gap-2">
                          <ItemIcon id={row.id} size={32} />
                        </div>
                      </CTableDataCell>
                      <CTableDataCell role="button" onClick={() => toggleLeft(row.id)}>
                        {items[row.id]}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          size="sm"
                          value={row.quantity}
                          onChange={e => updateQuantity(row.id, e.target.value)}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-end gap-1">
                          <CButton color="success" variant="outline" size="sm"
                                   onClick={() => increaseQuantity(10, [row.id])}
                          >
                            {t.common.plus10}
                          </CButton>
                          <CButton color="primary" variant="outline" size="sm"
                                   onClick={() => increaseQuantity(100, [row.id])}
                          >
                            {t.common.plus100}
                          </CButton>
                          <CButton color="warning" variant="outline" size="sm"
                                   onClick={() => increaseQuantity(1000, [row.id])}
                          >
                            {t.common.plus1000}
                          </CButton>
                          <CButton color="danger" variant="outline" size="sm"
                                   onClick={() => increaseQuantity(10000, [row.id])}
                          >
                            {t.common.plus10000}
                          </CButton>
                        </div>
                      </CTableDataCell>

                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* ACTIONS */}
        <CCol md={2}>
          <div style={{position: 'sticky', top: 80}}>
            <CCard>
              <CCardHeader>
                <CCardTitle>{t.warehouse.actions}</CCardTitle>
              </CCardHeader>
              <CCardBody className="d-grid gap-2">
                <CButton color="primary" onClick={addToWarehouse}>
                  {t.warehouse.add}
                </CButton>
                <CButton color="danger" onClick={deleteFromWarehouse}>
                  {t.warehouse.delete}
                </CButton>
              </CCardBody>
            </CCard>
          </div>
        </CCol>
        {/* RIGHT — ALL ITEMS */}
        <CCol md={4}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <CCardTitle>{rightTitle}</CCardTitle>

              <CDropdown alignment="end">
                <CDropdownToggle color="primary">
                  {rightTitle}
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
                    <CTableHeaderCell>
                      <input
                        type="checkbox"
                        checked={isAllRightSelected}
                        onChange={toggleSelectAllRight}
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell>{t.warehouse.id}</CTableHeaderCell>
                    <CTableHeaderCell>{t.warehouse.name}</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {Object.entries(rightTableData).map(([id, name]) => (
                    <CTableRow key={id} active={selectedRight.has(id)}>
                      <CTableDataCell>
                        <input
                          type="checkbox"
                          checked={selectedRight.has(id)}
                          onChange={() => toggleRight(id)}
                        />
                      </CTableDataCell>
                      <CTableDataCell role="button" onClick={() => toggleRight(id)}>
                        {id}
                      </CTableDataCell>
                      <CTableDataCell role="button" onClick={() => toggleRight(id)}>
                        <div className="d-flex align-items-center gap-2">
                          <ItemIcon id={id} size={32} />
                          <span>{name}</span>
                        </div>
                        {/*<ItemIcon id={id} size={32} />{name}*/}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* PROGRESS MODAL */}
      {bulkProgress.visible && (
        <CModal visible backdrop="static">
          <CModalHeader>
            <CModalTitle>{t.common.processing}</CModalTitle>
          </CModalHeader>

          <CModalBody>
            <CProgress value={(bulkProgress.current / bulkProgress.total) * 100}/>
            <div className="mt-2 text-center">
              {bulkProgress.current} / {bulkProgress.total}
            </div>
          </CModalBody>

          <CModalFooter>
            {bulkProgress.done && (
              <CButton
                color="secondary"
                onClick={() =>
                  setBulkProgress(p => ({...p, visible: false}))
                }
              >
                {t.common.close}
              </CButton>
            )}
          </CModalFooter>
        </CModal>
      )}

    </>
  )
}

export default WarehousePage
