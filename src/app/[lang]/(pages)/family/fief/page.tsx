'use client'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'

import {useI18nClient} from '@/lib/i18nClient'
import {MemberNowRepository} from '@/repositories/MemberNow'
import {CunNowRepository} from '@/repositories/CunNow'
import {ZhenNowRepository} from '@/repositories/ZhenNow'
import {JunYingNowRepository} from '@/repositories/JunYingNow'
import {TerritoryMoveService} from '@/lib/services/TerritoryMoveService'

import React, {useEffect, useMemo, useState} from 'react'
import type {MemberParsed} from '@/models/members'
import {GuideLineData, useGuideLine} from "@/providers/GuideLine";
import {renderI18nWithHighlight} from "@/components/guide/renderI18nWithHighlight";
import Image from "next/image";

/* ======================================================
 * CONSTANTS
 * ====================================================*/
const AREA_OPTIONS = ['4', '6', '9', '16']

const AREA_LIMIT: Record<string, number> = {
  '4': 800,
  '6': 1200,
  '9': 1800,
  '16': 3200
}

const SALARY_OPTIONS = ['100', '200', '300', '400', '500']

type Row = string[]

/* ======================================================
 * COLUMN DEFINITIONS
 * ====================================================*/
const CUN_ZHEN_COLUMNS = [
  {key: 'coordinates', index: 0, type: 'readonly'},
  {key: 'area', index: 1, type: 'area'},
  {key: 'population', index: 2, type: 'population'},
  {key: 'happy', index: 3, type: 'percent'},
  {key: 'business', index: 4, type: 'percent'},
  {key: 'agriculture', index: 5, type: 'percent'}
]

const JUNYING_COLUMNS = [
  {key: 'coordinates', index: 0, type: 'readonly'},
  {key: 'area', index: 1, type: 'area'},
  {key: 'soldiers', index: 2, type: 'population'},
  {key: 'combat', index: 3, type: 'percent'},
  {key: 'loyalty', index: 4, type: 'percent'},
  {key: 'lowEquip', index: 5, type: 'percent'},
  {key: 'highEquip', index: 6, type: 'percent'},
  {key: 'campName', index: 7, type: 'text'},
  {key: 'salary', index: 8, type: 'salary'}
]

/* ======================================================
 * PAGE
 * ====================================================*/
export default function FiefPage() {
  const {t} = useI18nClient<any>()

  const [fengdiIndex, setFengdiIndex] = useState<number>()
  const [cunRows, setCunRows] = useState<Row[]>([])
  const [zhenRows, setZhenRows] = useState<Row[]>([])
  const [junRows, setJunRows] = useState<Row[]>([])

  /* ===== Modal ===== */
  const [showModal, setShowModal] = useState(false)
  const [campName, setCampName] = useState('')
  const [pendingMove, setPendingMove] = useState<{
    from: 'cun' | 'zhen'
    key: string
  } | null>(null)

  const memberRepo = new MemberNowRepository()
  const cunRepo = new CunNowRepository()
  const zhenRepo = new ZhenNowRepository()
  const junRepo = new JunYingNowRepository()

  const guideLineData = useMemo<GuideLineData>(() => ({
    title: t.guide.title,
    description: t.guide.fief.description,
    content: (
      <>
        <CRow>
          <CCol xs="4">
            <CCard style={{border: "none"}}>
              <CCardTitle>{t.guide.fief.section_1.title}</CCardTitle>
              <CCardBody>
                {renderI18nWithHighlight(
                  t.guide.fief.section_1.content,
                  {
                    village: {
                      text: t.guide.fief.village,
                      // style: { color: '#51cc8a', fontWeight: 600 },
                      className: "text-primary"
                    },
                    town: {
                      text: t.guide.fief.town,
                      // style: { color: '#51cc8a', fontWeight: 600 },
                      className: "text-primary"
                    },
                    military: {
                      text: t.guide.fief.military,
                      className: "text-primary"
                    },
                    area: {
                      text: t.guide.fief.area,
                      className: "text-primary"
                    },
                    popular: {
                      text: t.guide.fief.popular,
                      className: "text-primary"
                    },
                    troop: {
                      text: t.guide.fief.troop,
                      className: "text-primary"
                    }
                  }
                )}
              </CCardBody>
            </CCard>
            <CCard style={{border: "none"}}>
              <CCardTitle>{t.guide.fief.section_3.title}</CCardTitle>
              <CCardBody>{renderI18nWithHighlight(
                t.guide.fief.section_3.content,
                {
                  area: {
                    text: t.guide.fief.area,
                    className: "text-primary"
                  },
                  popular: {
                    text: t.guide.fief.popular,
                    className: "text-primary"
                  },
                  troop: {
                    text: t.guide.fief.troop,
                    className: "text-primary"
                  }
                }
              )}</CCardBody>
            </CCard>
          </CCol>
          <CCol xs={3}>

          </CCol>
          <CCol xs="5">
            <CCard style={{border: "none"}}>
              <CCardTitle>{t.guide.fief.section_2.title}</CCardTitle>
              <CCardBody>{renderI18nWithHighlight(
                t.guide.fief.section_2.content,
                {
                  village: {
                    text: t.guide.fief.village,
                    // style: { color: '#51cc8a', fontWeight: 600 },
                    className: "text-primary"
                  },
                  town: {
                    text: t.guide.fief.town,
                    // style: { color: '#51cc8a', fontWeight: 600 },
                    className: "text-primary"
                  },
                  military: {
                    text: t.guide.fief.military,
                    className: "text-primary"
                  },
                  area: {
                    text: t.guide.fief.area,
                    className: "text-primary"
                  },
                  popular: {
                    text: t.guide.fief.popular,
                    className: "text-primary"
                  },
                  troop: {
                    text: t.guide.fief.troop,
                    className: "text-primary"
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

  const {setGuideData} = useGuideLine()
  useEffect(() => {
    setGuideData(guideLineData)
    return () => setGuideData(null)
  }, [setGuideData, guideLineData])

  /* ======================================================
   * LOAD CONTEXT
   * ====================================================*/
  useEffect(() => {
    (async () => {
      const member: undefined | MemberParsed = await memberRepo.getChiefMember()

      const idx = member?.titleFengdi.prefectureId ?? 0
      setFengdiIndex(idx)

      const [cun, zhen, jun] = await Promise.all([
        cunRepo.getGroupRows(idx),
        zhenRepo.getGroupRows(idx),
        junRepo.getGroupRows(idx)
      ])

      setCunRows(cun)
      setZhenRows(zhen)
      setJunRows(jun)
    })()
  }, [])

  if (fengdiIndex === undefined) return null

  /* ======================================================
   * HELPERS
   * ====================================================*/
  const updateRows = async (
    repo: any,
    rows: Row[],
    setRows: (r: Row[]) => void
  ) => {
    setRows(rows)
    await repo.setGroupRows(fengdiIndex!, rows)
  }

  const updateCell = async (
    repo: any,
    rows: Row[],
    setRows: any,
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const next = rows.map((r, i) => {
      if (i !== rowIndex) return r
      const copy = [...r]
      copy[colIndex] = value
      return copy
    })
    await updateRows(repo, next, setRows)
  }

  /* ======================================================
   * MAX ATTRIBUTE
   * ====================================================*/
  const maxAttribute = async (
    repo: any,
    rows: Row[],
    setRows: any,
    columns: any[]
  ) => {
    const next = rows.map(row => {
      const copy = [...row]
      const area = copy[1]

      columns.forEach(col => {
        if (col.type === 'population') {
          copy[col.index] =
            String(AREA_LIMIT[area] ?? 0)
        }

        if (col.type === 'percent') {
          copy[col.index] = '100'
        }

        if (col.type === 'salary') {
          copy[col.index] = '500'
        }
      })

      return copy
    })

    await updateRows(repo, next, setRows)
  }

  /* ======================================================
   * MOVE
   * ====================================================*/
  const move = async (
    from: 'cun' | 'zhen' | 'junying',
    to: 'cun' | 'zhen' | 'junying',
    key: string
  ) => {
    if (to === 'junying' && from !== 'junying') {
      setPendingMove({from, key})
      setCampName('')
      setShowModal(true)
      return
    }

    await TerritoryMoveService.moveRecord({
      from,
      to,
      fengdiIndex,
      key
    })
    reload()
  }

  const confirmMoveToJunYing = async () => {
    if (!pendingMove) return

    await TerritoryMoveService.moveRecord({
      from: pendingMove.from,
      to: 'junying',
      fengdiIndex,
      key: pendingMove.key,
      campName
    })

    setShowModal(false)
    reload()
  }

  const reload = async () => {
    const [cun, zhen, jun] = await Promise.all([
      cunRepo.getGroupRows(fengdiIndex!),
      zhenRepo.getGroupRows(fengdiIndex!),
      junRepo.getGroupRows(fengdiIndex!)
    ])
    setCunRows(cun)
    setZhenRows(zhen)
    setJunRows(jun)
  }

  /* ======================================================
   * CELL RENDER
   * ====================================================*/
  const renderCell = (
    row: Row,
    rowIndex: number,
    col: any,
    repo: any,
    rows: Row[],
    setRows: any
  ) => {
    const value = row[col.index]

    /* ===== READ ONLY ===== */
    if (col.type === 'readonly') {
      return <span>{value}</span>
    }

    /* ===== AREA ===== */
    if (col.type === 'area') {
      return (
        <CFormSelect
          size="sm"
          value={value}
          onChange={async e => {
            const newArea = e.target.value
            const newLimit = AREA_LIMIT[newArea] ?? 0

            const next = rows.map((r, i) => {
              if (i !== rowIndex) return r

              const copy = [...r]

              // update area
              copy[col.index] = newArea

              // population / soldiers index = 2
              const currentPop = Number(copy[2] ?? 0)
              if (currentPop > newLimit) {
                copy[2] = String(newLimit)
              }

              return copy
            })

            // update local + persist
            setRows(next)
            await repo.setGroupRows(fengdiIndex!, next)
          }}
        >
          {AREA_OPTIONS.map(v => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </CFormSelect>
      )
    }

    /* ===== SALARY ===== */
    if (col.type === 'salary') {
      return (
        <CFormSelect
          size="sm"
          value={value || '100'}
          onChange={e =>
            updateCell(
              repo,
              rows,
              setRows,
              rowIndex,
              col.index,
              e.target.value
            )
          }
        >
          {SALARY_OPTIONS.map(v => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </CFormSelect>
      )
    }

    /* =====================================================
     * TEXT INPUT (campName, others)
     * ===================================================*/
    if (col.type === 'text') {
      return (
        <CFormInput
          size="sm"
          type="text"
          value={value}
          onChange={e => {
            const next = rows.map((r, i) => {
              if (i !== rowIndex) return r
              const copy = [...r]
              copy[col.index] = e.target.value
              return copy
            })
            setRows(next)
          }}
          onBlur={e =>
            updateCell(
              repo,
              rows,
              setRows,
              rowIndex,
              col.index,
              e.target.value
            )
          }
        />
      )
    }

    /* =====================================================
     * NUMBER INPUT (population / percent / combat / etc.)
     * ===================================================*/
    return (
      <CFormInput
        size="sm"
        type="number"
        value={value}
        min={0}
        max={
          col.type === 'population'
            ? AREA_LIMIT[row[1]] ?? 0
            : 100
        }

        /* allow typing */
        onChange={e => {
          const next = rows.map((r, i) => {
            if (i !== rowIndex) return r
            const copy = [...r]
            copy[col.index] = e.target.value
            return copy
          })
          setRows(next)
        }}

        /* clamp + persist */
        onBlur={e => {
          let v = Number(e.target.value)

          if (Number.isNaN(v)) v = 0

          if (col.type === 'population') {
            const max = AREA_LIMIT[row[1]] ?? 0
            v = Math.min(Math.max(v, 0), max)
          } else {
            v = Math.min(Math.max(v, 0), 100)
          }

          updateCell(
            repo,
            rows,
            setRows,
            rowIndex,
            col.index,
            String(v)
          )
        }}
      />
    )
  }

  const getTitleImage = (from: 'cun' | 'zhen' | 'junying') => {
    switch (from) {
      case 'cun':
        return '/assets/fengdi/DX_CunLuo.png'
      case 'zhen':
        return '/assets/fengdi/DX_ChengZ.png'
      case 'junying':
        return '/assets/fengdi/DX_JunYing.png'
      default:
        return ''
    }
  }

  /* ======================================================
   * TABLE
   * ====================================================*/
  const renderTable = (
    title: string,
    rows: Row[],
    setRows: any,
    repo: any,
    columns: any[],
    from: 'cun' | 'zhen' | 'junying',
    targets: ('cun' | 'zhen' | 'junying')[]
  ) => (
    <CRow>
      <CCol xs={2} className="pt-3">
        <Image
          src={getTitleImage(from)}
          alt=""
          width={300}
          height={150}
          style={{
            objectFit: 'contain',
          }}
        />
      </CCol>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div className="d-inline-flex align-items-center gap-2">
              {title}
            </div>
            <CButton
              size="sm"
              color="warning"
              onClick={() =>
                maxAttribute(
                  repo,
                  rows,
                  setRows,
                  columns
                )
              }
            >
              {t.common.maxAll ?? 'Max Attribute'}
            </CButton>
          </CCardHeader>

          <CCardBody>
            <CTable hover small>
              <CTableHead>
                <CTableRow>
                  {columns.map(col => (
                    <CTableHeaderCell key={col.key}>
                      {t.fengdi[col.key] ?? col.key}
                    </CTableHeaderCell>
                  ))}
                  <CTableHeaderCell>
                    {t.common.action ?? 'Actions'}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {rows.map((row, rowIndex) => (
                  <CTableRow key={rowIndex}>
                    {columns.map(col => (
                      <CTableDataCell key={col.key}>
                        {renderCell(
                          row,
                          rowIndex,
                          col,
                          repo,
                          rows,
                          setRows
                        )}
                      </CTableDataCell>
                    ))}

                    <CTableDataCell>
                      <CDropdown>
                        <CDropdownToggle size="sm">
                          {t.common.move ?? 'Move'}
                        </CDropdownToggle>
                        <CDropdownMenu>
                          {targets.map(tg => (
                            <CDropdownItem
                              key={tg}
                              onClick={() =>
                                move(from, tg, row[0])
                              }
                            >
                              {t.fengdi[from]} → {t.fengdi[tg]}
                            </CDropdownItem>
                          ))}
                        </CDropdownMenu>
                      </CDropdown>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

  )

  /* ======================================================
   * RENDER
   * ====================================================*/
  return (
    <>
      {renderTable(
        t.fengdi?.cun ?? 'Village',
        cunRows,
        setCunRows,
        cunRepo,
        CUN_ZHEN_COLUMNS,
        'cun',
        ['zhen', 'junying']
      )}

      {renderTable(
        t.fengdi?.zhen ?? 'Town',
        zhenRows,
        setZhenRows,
        zhenRepo,
        CUN_ZHEN_COLUMNS,
        'zhen',
        ['cun', 'junying']
      )}

      {renderTable(
        t.fengdi?.junying ?? 'Military',
        junRows,
        setJunRows,
        junRepo,
        JUNYING_COLUMNS,
        'junying',
        ['cun', 'zhen']
      )}

      {/* ===== CAMP NAME MODAL ===== */}
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <CModalHeader>
          <CModalTitle>
            {t.fengdi?.enterCampName ??
              'Enter Camp Name'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CFormInput
            value={campName}
            onChange={e => setCampName(e.target.value)}
          />
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowModal(false)}
          >
            {t.common.cancel ?? 'Cancel'}
          </CButton>
          <CButton
            color="primary"
            onClick={confirmMoveToJunYing}
          >
            {t.common.confirm ?? 'Confirm'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
