'use client'

import React, {useEffect, useMemo, useState} from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CToast,
  CToastBody,
  CToastHeader,
} from '@coreui/react'

import {useI18nClient} from '@/lib/i18nClient'
import {getRows} from '@/lib/gameData.model'
import {useHorseHave} from '@/hooks/horseHave'
import {DEFAULT_HORSE_HAVE_ROW, HorseHaveRow,} from '@/models/horseHave'
import {GuideLineData, useGuideLine} from "@/providers/GuideLine";
import {renderI18nWithHighlight} from "@/components/guide/renderI18nWithHighlight";
import {ItemIcon} from "@/components/item/ItemIcon";
import {DropdownCell} from "@/components/table/DropdownCell";

// type I18nSchema = {
//   stable: {
//     title: string
//     attribute: {
//       color: string
//       yearAge: string
//       lifespan: string
//       power: string
//       speed: string
//       smart: string
//       owner: string
//     }
//     colors: Record<string, string>
//     add: string
//     delete: string
//   }
//   uploader: {
//     toastTitle: string
//   },
//   guide: {
//     title: string
//     stable: {
//       description: string
//       section_1: {
//         title: string
//         content: string
//       }
//       section_2: {
//         title: string
//         content: string
//       }
//       add: string
//       remove: string
//       owner: string
//     }
//   }
// }

const StablePage = () => {
  const {t} = useI18nClient<any>()
  const {rows, selected, add, removeSelected, updateCell, toggleRow} =
    useHorseHave()

  const [members, setMembers] = useState<any[][]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [form, setForm] = useState<HorseHaveRow>(
    DEFAULT_HORSE_HAVE_ROW
  )
  const horseColorKeys = Object.keys(t.stable.colors)

// index -> key
  const horseColorIndexToKey = (index: number) =>
    horseColorKeys[index]

// key -> index
  const horseColorKeyToIndex = (key: string) =>
    Math.max(0, horseColorKeys.indexOf(key))

  const guideLineData = useMemo<GuideLineData>(() => ({
    title: t.guide.title,
    description: t.guide.stable.description,
    content: (
      <>
        <CRow>
          <CCol xs="4">
            <CCard style={{border: "none"}}>
              <CCardTitle>{t.guide.stable.section_1.title}</CCardTitle>
              <CCardBody>
                {renderI18nWithHighlight(
                  t.guide.stable.section_1.content,
                  {
                    add: {
                      text: t.guide.stable.add,
                      className: "btn btn-outline-primary btn-sm"
                    },
                    remove: {
                      text: t.guide.stable.remove,
                      className: "btn btn-danger btn-sm"
                    }
                  }
                )}
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs="3">
          </CCol>
          <CCol xs="5">
            <CCard style={{border: "none"}}>
              <CCardTitle>{t.guide.stable.section_2.title}</CCardTitle>
              <CCardBody>{renderI18nWithHighlight(
                t.guide.stable.section_2.content,
                {
                  owner: {
                    text: t.guide.stable.owner,
                    // style: { color: '#51cc8a', fontWeight: 600 },
                    className: "text-success"
                  }
                }
              )}</CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    ),
  }), [t])

  const {setGuideData} = useGuideLine()
  useEffect(() => {
    setGuideData(guideLineData)
    return () => setGuideData(null)
  }, [setGuideData, guideLineData])

  useEffect(() => {
    let mounted = true

    ;(async () => {
      const data = await getRows('Member_now')
      if (mounted) {
        setMembers(data)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])
  /* ---------- Owner helpers ---------- */

  const allOwners = useMemo(() => {
    return members
      .map(row => ({
        id: row[0],
        name: typeof row[4] === 'string' ? row[4].split('|')[0] : '',
      }))
      .filter(o => o.id && o.name)
  }, [members])

  const getAvailableOwnersForRow = (rowIndex: number) => {
    const currentOwner = rows[rowIndex]?.[6]
    const usedByOtherRows = new Set(
      rows
        .map((r, i) => (i !== rowIndex ? r[6] : null))
        .filter(v => v && v !== 'null')
    )

    return allOwners.filter(
      o => o.id === currentOwner || !usedByOtherRows.has(o.id)
    )
  }

  /* ---------- Render ---------- */
  const horseAttributeKeys = [
    'color',     // index 0
    'yearAge',   // index 1
    'lifespan',  // index 2
    'power',     // index 3
    'speed',     // index 4
    'smart',     // index 5
    'owner',     // index 6
  ] as const

  return (
    <>
      {toast && (
        <div style={{position: 'fixed', top: 16, right: 16}}>
          <CToast visible autohide delay={3000} onClose={() => setToast(null)}>
            <CToastHeader closeButton>
              <strong>{t.uploader.toastTitle}</strong>
            </CToastHeader>
            <CToastBody>{toast}</CToastBody>
          </CToast>
        </div>
      )}

      <CRow>
        {/* LEFT TABLE */}
        <CCol md={8}>
          <CCard>
            <CCardHeader>
              <CCardTitle className="d-inline-flex align-items-center gap-2"><ItemIcon id="stable"
                                                                                       iconSet="main"/> {t.stable.title}
              </CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CTable striped hover small>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell/>
                    {(Object.values(t.stable.attribute) as string[]).map(label => (
                      <CTableHeaderCell key={label}>{label}</CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {rows.map((row, rowIndex) => (
                    <CTableRow
                      key={rowIndex}
                      active={selected.has(rowIndex)}
                    >
                      {/* CHECKBOX */}
                      <CTableDataCell>
                        <input
                          type="checkbox"
                          checked={selected.has(rowIndex)}
                          onChange={() => toggleRow(rowIndex)}
                        />
                      </CTableDataCell>

                      {/* COLOR (HORSE ICON DROPDOWN) */}
                      <CTableDataCell>
                        <div className="horse-dropdown">
                          <DropdownCell
                            value={horseColorKeyToIndex(row[0])}
                            options={Object.fromEntries(
                              horseColorKeys.map((_, i) => [i, String(i)])
                            )}
                            onChange={i =>
                              updateCell(rowIndex, 0, horseColorIndexToKey(i))
                            }
                            renderValue={i => (
                              <ItemIcon
                                iconSet="horse"
                                id={horseColorIndexToKey(i)}
                                size={28}
                              />
                            )}
                            renderOption={i => {
                              const key = horseColorIndexToKey(i)
                              return (
                                <div className="d-flex align-items-center gap-2">
                                  <ItemIcon iconSet="horse" id={key} size={28}/>
                                  <span>{t.stable.colors[key]}</span>
                                </div>
                              )
                            }}
                            hoverLabel={t.stable.colors[row[0]]}
                            maxWidth={120}
                          />
                        </div>
                      </CTableDataCell>
                      {/* YEAR AGE */}
                      <CTableDataCell>
                        <CFormInput
                          size="sm"
                          type="number"
                          min={1}
                          max={100}
                          value={row[1] ?? ''}
                          onChange={e =>
                            updateCell(rowIndex, 1, e.target.value)
                          }
                        />
                      </CTableDataCell>

                      {/* LIFESPAN */}
                      <CTableDataCell>
                        <CFormInput
                          size="sm"
                          type="number"
                          min={0}
                          max={100}
                          value={row[2] ?? ''}
                          onChange={e =>
                            updateCell(rowIndex, 2, e.target.value)
                          }
                        />
                      </CTableDataCell>

                      {/* POWER */}
                      <CTableDataCell>
                        <CFormInput
                          size="sm"
                          type="number"
                          min={0}
                          max={100}
                          value={row[3] ?? ''}
                          onChange={e =>
                            updateCell(rowIndex, 3, e.target.value)
                          }
                        />
                      </CTableDataCell>

                      {/* SPEED */}
                      <CTableDataCell>
                        <CFormInput
                          size="sm"
                          type="number"
                          min={0}
                          max={100}
                          value={row[4] ?? ''}
                          onChange={e =>
                            updateCell(rowIndex, 4, e.target.value)
                          }
                        />
                      </CTableDataCell>

                      {/* SMART */}
                      <CTableDataCell>
                        <CFormInput
                          size="sm"
                          type="number"
                          min={0}
                          max={100}
                          value={row[5] ?? ''}
                          onChange={e =>
                            updateCell(rowIndex, 5, e.target.value)
                          }
                        />
                      </CTableDataCell>

                      {/* OWNER */}
                      <CTableDataCell>
                        <CFormSelect
                          size="sm"
                          value={row[6]}
                          onChange={e =>
                            updateCell(rowIndex, 6, e.target.value)
                          }
                        >
                          <option value="null">—</option>
                          {getAvailableOwnersForRow(rowIndex).map(o => (
                            <option key={o.id} value={o.id}>
                              {o.name}
                            </option>
                          ))}
                        </CFormSelect>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <CButton color="danger" onClick={removeSelected}>
                {t.stable.delete}
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>

        {/* RIGHT FORM */}
        <CCol md={4}>
          <CCard>
            <CCardHeader>
              <CCardTitle>{t.stable.add}</CCardTitle>
            </CCardHeader>
            <CCardBody>
              {/* index 0 - Color (select) */}
              <CRow className="mb-2">
                <CCol xs={2}>
                  {t.stable.attribute.color}
                </CCol>
                <CCol xs={10}>
                  <div className="horse-dropdown">
                    <DropdownCell
                      value={horseColorKeyToIndex(form[0])}
                      options={Object.fromEntries(
                        horseColorKeys.map((_, i) => [i, String(i)])
                      )}
                      onChange={i => {
                        const next = [...form] as HorseHaveRow
                        next[0] = horseColorIndexToKey(i)
                        setForm(next)
                      }}
                      renderValue={i => (
                        <ItemIcon
                          iconSet="horse"
                          id={horseColorIndexToKey(i)}
                          size={28}
                        />
                      )}
                      renderOption={i => {
                        const key = horseColorIndexToKey(i)
                        return (
                          <div className="d-flex align-items-center gap-2">
                            <ItemIcon iconSet="horse" id={key} size={28}/>
                            <span>{t.stable.colors[key]}</span>
                          </div>
                        )
                      }}
                      hoverLabel={t.stable.colors[form[0]]}
                      maxWidth={140}
                    />
                  </div>
                </CCol>
              </CRow>
              {/* index 1 to 5 other fields (number) */}
              {form.map((v, i) =>
                i > 0 && i < 6 ? (
                  <CRow key={i} className="mb-2">
                    <CCol xs={2}>
                      {t.stable.attribute[horseAttributeKeys[i]]}
                    </CCol>
                    <CCol xs={10}>
                      <CFormInput
                        size="sm"
                        type="number"
                        min={i === 1 ? 1 : 0}
                        max={100}
                        value={v ?? ''}
                        onChange={e => {
                          const next = [...form] as HorseHaveRow
                          next[i] = e.target.value
                          setForm(next)
                        }}
                      />
                    </CCol>
                  </CRow>
                ) : null
              )}
              {/* index 6 - Owner (select) */}
              <CRow className="mb-2">
                <CCol xs={2}>
                  {t.stable.attribute.owner}
                </CCol>
                <CCol xs={10}>
                  <CFormSelect
                    size="sm"
                    value={form[6]}
                    onChange={e => {
                      const next = [...form] as HorseHaveRow
                      next[6] = e.target.value
                      setForm(next)
                    }}
                  >
                    <option value="null">—</option>
                    {allOwners.map(o => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              <CButton
                className="btn-outline-primary btn-sm mt-2"
                // size="sm"
                onClick={() => {
                  void add(form)
                  setToast(t.stable.add)
                }}
              >
                {t.stable.add}
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default StablePage
