'use client'

import {useEffect, useState} from 'react'
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

import {InputCell} from '@/components/table/InputCell'
import {DropdownCell} from '@/components/table/DropdownCell'
import {ShiJiaNowRelationMatrix} from '@/components/table/ShiJiaNowRelationMatrix'

import {useShiJiaNow} from '@/hooks/useShiJiaNow'
import {useI18nClient} from '@/lib/i18nClient'
import {ShiJiaNowColumn} from '@/columns/ShiJiaNow'
import {INHERITANCE_OPTIONS} from '@/constants/options'
import type {ShiJiaNowParsed} from '@/types/ShiJiaNow'
import {countTotalClanMembers} from "@/lib/services/shiJiaNowMemberCount";
import {buildFamilyTitle} from "@/lib/services/buildTitle";

/* ========================
 * Row component (CoreUI)
 * ======================== */
function ShiJiaNowRow({
                        family,
                        t,
                        memberCount,
                        updateColumn,
                        updateSubColumn,
                      }: Readonly<{
  family: ShiJiaNowParsed
  memberCount: number
  t: any
  updateColumn: (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => Promise<void>
  updateSubColumn: (
    rowId: string,
    colKey: number,
    subKey: string,
    value: string,
  ) => Promise<void>
}>) {
  const [row, setRow] = useState(family)

  return (
    <CTableRow>
      {/* ID */}
      <CTableDataCell>{row.id}</CTableDataCell>

      {/* TITLE */}
      <CTableDataCell>
        {buildFamilyTitle(row.coordinates, row.name, t)}
      </CTableDataCell>
      {/* COORDINATES (read-only) */}
      <CTableDataCell>{row.coordinates}</CTableDataCell>
      {/* MEMBERS (Tộc nhân) */}
      <CTableDataCell>{memberCount}</CTableDataCell>
      {/* LEVEL */}
      <CTableDataCell>
        <InputCell
          type="number"
          value={row.level}
          disabled={false}
          onChange={v => setRow({...row, level: v})}
          onBlur={() =>
            updateColumn(
              row.id,
              ShiJiaNowColumn.LEVEL,
              String(row.level),
            )
          }
        />
      </CTableDataCell>

      {/* RELATIONSHIP INDEX */}
      <CTableDataCell>
        <InputCell
          type="number"
          value={row.relationshipIndex}
          disabled={false}
          onChange={v =>
            setRow({...row, relationshipIndex: v})
          }
          onBlur={() =>
            updateColumn(
              row.id,
              ShiJiaNowColumn.RELATIONSHIP_INDEX,
              String(row.relationshipIndex),
            )
          }
        />
      </CTableDataCell>

      {/* INHERITANCE */}
      <CTableDataCell>
        <DropdownCell
          value={row.inheritance}
          options={INHERITANCE_OPTIONS}
          labels={t.inheritance_option}
          onChange={v => {
            setRow({...row, inheritance: v})
            updateColumn(
              row.id,
              ShiJiaNowColumn.INHERITANCE,
              String(v),
            )
          }}
        />
      </CTableDataCell>

      {/* ROYAL INFLUENCE */}
      <CTableDataCell>
        <InputCell
          type="number"
          value={row.royalInfluence}
          disabled={false}
          onChange={v =>
            setRow({...row, royalInfluence: v})
          }
          onBlur={() =>
            updateColumn(
              row.id,
              ShiJiaNowColumn.ROYAL_INFLUENCE,
              String(row.royalInfluence),
            )
          }
        />
      </CTableDataCell>

      {/* PRIVATE ARMY */}
      <CTableDataCell>
        <InputCell
          type="number"
          value={row.army.privateArmy}
          disabled={false}
          onChange={v =>
            setRow({
              ...row,
              army: {...row.army, privateArmy: v},
            })
          }
          onBlur={() =>
            updateSubColumn(
              String(row.id),
              ShiJiaNowColumn.ARMY_STRENGTH,
              '0',
              String(row.army.privateArmy),
            )
          }
        />
      </CTableDataCell>

      {/* MILITARY POWER */}
      <CTableDataCell>
        <InputCell
          type="number"
          value={row.army.militaryPower}
          disabled={false}
          onChange={v =>
            setRow({
              ...row,
              army: {
                ...row.army,
                militaryPower: v,
              },
            })
          }
          onBlur={() =>
            updateSubColumn(
              String(row.id),
              ShiJiaNowColumn.ARMY_STRENGTH,
              '1',
              String(row.army.militaryPower),
            )
          }
        />
      </CTableDataCell>
    </CTableRow>
  )
}

/* ========================
 * Page
 * ======================== */

export default function ShiJiaNowPage() {
  const {
    data,
    loading,
    updateColumn,
    updateSubColumn,
  } = useShiJiaNow()

  const {t} = useI18nClient<any>()
  const [memberCount, setMemberCount] = useState<Record<number, number>>({})

  useEffect(() => {
    const load = async () => {
      const result: Record<number, number> = {}

      for (const family of data) {
        result[family.id] = await countTotalClanMembers(
          family.id,
        )
      }

      setMemberCount(result)
    }

    void load()
  }, [data])

  if (loading) return <div>Loading…</div>

  return (
    <>
      <CCard>
        <CCardHeader>
          <strong>{t.menu.shiJiaNow}</strong>
        </CCardHeader>
        <CCardBody style={{overflowX: 'auto'}}>
          <CTable striped small hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{width: 60}}>
                  ID
                </CTableHeaderCell>
                <CTableHeaderCell>
                  {t.shiJiaNow.title}
                </CTableHeaderCell>
                <CTableHeaderCell style={{width: 90}}>
                  {t.shiJiaNow.coordinates}
                </CTableHeaderCell>
                <CTableHeaderCell>
                  {t.shiJiaNow.members}
                </CTableHeaderCell>
                <CTableHeaderCell style={{width: 80}}>
                  {t.shiJiaNow.level}
                </CTableHeaderCell>
                <CTableHeaderCell style={{width: 140}}>
                  {t.shiJiaNow.relationshipIndex}
                </CTableHeaderCell>
                <CTableHeaderCell style={{width: 180}}>
                  {t.shiJiaNow.inheritance}
                </CTableHeaderCell>
                <CTableHeaderCell style={{width: 160}}>
                  {t.shiJiaNow.royalInfluence}
                </CTableHeaderCell>
                <CTableHeaderCell style={{width: 110}}>
                  {t.shiJiaNow.army.privateArmy}
                </CTableHeaderCell>
                <CTableHeaderCell style={{width: 110}}>
                  {t.shiJiaNow.army.militaryPower}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {data.map((family, index) => (
                <ShiJiaNowRow
                  key={family.id}
                  family={family}
                  memberCount={memberCount[family.id] ?? 0}
                  t={t}
                  updateColumn={updateColumn}
                  updateSubColumn={updateSubColumn}
                />
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* RELATIONSHIP MATRIX */}
      <ShiJiaNowRelationMatrix families={data}/>
    </>
  )
}
