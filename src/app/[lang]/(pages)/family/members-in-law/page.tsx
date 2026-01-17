'use client'

import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useI18nClient} from '@/lib/i18nClient'

import {TableEditor} from '@/components/table/TableEditor'
import {InputCell} from '@/components/table/InputCell'
import {MaxAttributeButton} from '@//components/button/MaxAttributeButton'

import {buildMemberQuColumns} from '@/columns/memberQu'
import {useMemberQu, useMembersQu} from '@/lib/hooks/memberQu'

import {MemberQuRepository} from '@/lib/repositories/MemberQu'
import {MemberQuParsed} from '@/lib/models/memberQu'
import {CCard, CCardBody, CCardTitle, CCol, CRow, CTableDataCell, CTableRow} from "@coreui/react";
import {ColumnSchema} from "@/columns/buildBaseColumns";
import {GuideLineData, useGuideLine} from "@/providers/GuideLine";
import {renderI18nWithHighlight} from "@/components/guide/renderI18nWithHighlight";

/* =========================================================
 * Row
 * ========================================================= */

function MemberQuRow({index, dataVersion, registerReload, unregisterReload,}: Readonly<{
  index: number
  dataVersion: number
  registerReload: (index: number, fn: () => void) => void
  unregisterReload: (index: number) => void
}>) {
  const {t} = useI18nClient<any>()
  const {row: member, update, load, loading} = useMemberQu(index)
  const columns = useMemo(() => buildMemberQuColumns(t), [t])

  /* register reload */
  useEffect(() => {
    registerReload(index, load)
    return () => {
      unregisterReload(index)
    }
  }, [index, load, registerReload, unregisterReload])

  /* initial load */
  useEffect(() => {
    void load()
  }, [load, dataVersion])

  if (loading || !member) {
    return null
  }

  return (
    <CTableRow>
      <CTableDataCell>{member.id}</CTableDataCell>
      {columns.map(col => (
        <CTableDataCell key={col.key}>
          {col.render ? (
            col.render(member, update, t)
          ) : (
            <InputCell
              value={col.get(member)}
              type={col.input}
              onChange={v => update(m => col.set(m, v))}
            />
          )}
        </CTableDataCell>
      ))}
    </CTableRow>
  )
}

/* =========================================================
 * Page
 * ========================================================= */
export default function MemberQuPage() {
  const {t} = useI18nClient<any>()
  const repo = useMemo(() => new MemberQuRepository(), [])
  const columns = useMemo<ColumnSchema<MemberQuParsed>>(
    () => buildMemberQuColumns(t),
    [t],
  )
  const {indexes, load, forceReload} = useMembersQu()
  const [dataVersion, setDataVersion] = useState(0)

  const rowReloaders = useRef(new Map<number, () => void>())
  useEffect(() => {
    void load()
  }, [load])

  const guideLineData = useMemo<GuideLineData>(() => ({
    title: t.guide.title,
    description: t.guide.memberQu.description,
    content: (
      <>
        <CRow>
          <CCol xs="8">
            <CCard style={{border: "none"}}>
              <CCardTitle>{t.guide.memberQu.section_1.title}</CCardTitle>
              <CCardBody>
                {renderI18nWithHighlight(
                  t.guide.memberQu.section_1.content,
                  {
                    pregnancy: {
                      text: t.guide.memberQu.section_1.pregnancy,
                      className: "text-success"
                    },
                    pregMonth: {
                      text: t.guide.memberQu.section_1.pregMonth,
                      className: "text-success"
                    }
                  }
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    ),
  }), [t])

  const { setGuideData } = useGuideLine()
  useEffect(() => {
    setGuideData(guideLineData)
    return () => setGuideData(null)
  }, [setGuideData, guideLineData])


  return (
    <TableEditor<MemberQuParsed>
      title={t.memberQu?.title ?? 'Members In Law'}
      columns={columns}
      indexes={indexes}
      renderHeaderAction={() => (
        <div
          style={{display: 'flex', gap: 8, flexWrap: 'nowrap', alignItems: 'center', }}
        >
          <MaxAttributeButton
            label={t.member?.batch?.upHalf ?? 'Up Half'}
            onClick={async () => {
              await repo.batchUpdate(row => columns.upHalf(row))
              setDataVersion(v => v + 1)
            }}
          />

          <MaxAttributeButton
            label={t.member?.batch?.maxAll ?? 'Max All'}
            onClick={async () => {
              await repo.batchUpdate(row => columns.maxAll(row))
              setDataVersion(v => v + 1)
            }}
          />
        </div>
      )}
      renderRowAction={(index, helpers) => (
        <MemberQuRow
          key={`${index}-${dataVersion}`}
          index={index}
          dataVersion={dataVersion}
          registerReload={helpers.registerReload}
          unregisterReload={helpers.unregisterReload}
        />
      )}
    />
  )
}
/**
 * Data example
 * "Member_qu": {
 *         "value": [
 *             [
 *                 "M102", // ID = 0,
 *                 "16|17|2|0", // APPEARANCE = 1 compound Back Hair|Body|Face Shape|Front Hair
 *                 "Nhan Khả Hàm|2|2|100|0|68|2|100|8|M199|4|M97", // PERSON_DATA = 2 compound Character Name|Clan|Talent|Talent Potential|Gender|Life Span|Skill|Luck|Trait|Marry to #|Hobby|?
 *                 "M234|M372|M373",  // CHILDREN = 3
 *                 "1|LTB22816|null|5",  // HOUSING = 4
 *                 "43",  // AGE = 5,
 *                 "100",  // MARTIAL = 6
 *                 "100",  // LITERARY = 7
 *                 "100",  // BUSINESS = 8
 *                 "100",  // ART = 9
 *                 "100",  // MOOD = 10
 *                 "0",    // MERITS = 11
 *                 "100",  // REPUTATION = 12 Renown
 *                 "1",    // MARITAL_STATUS = 13
 *                 "null|null|null",  // EQUIPMENT = 14
 *                 "93",   // CHARM = 15 Charisma
 *                 "100",  // HEALTH = 16
 *                 "null",  // COL_17
 *                 "-1",    // Pregnancy Months (10 Being just Pregnant,must change the # on Row 25 also)
 *                 "100",  // STRATEGY = 19
 *                 "5",    // STAMINA = 20
 *                 "0|0|0|0.06|0.06|0.06|0.06",  // MONTHLY_INCREMENT = 21
 *                 "5|9|0|0|0|0",  // GROWTH_BONUS = 22
 *                 "100",  // SKILL_POINT = 23
 *                 "0",  // COL_24
 *                 "0",  // Pregnancy Status = 25 (1 = Pregnant; 0 = Not Pregnant)
 *                 "21@-1@null@null|21@82@Tộc Ta@Ðinh Đạt Kiến|19@85@Ðinh Khánh Nhượng@null|22@85@Ðinh Sơn Tín@null|22@86@Ðinh Phương Điệp@null|28@69@Tộc Ta@Xuân Nghiệp Ðinh",
 *                 "null",  // Traits = 27
 *                 "null",  // COL_28/
 *                 "1",     // COL_29
 *                 "0@0@0@-1@-1|0",  // COL_30/
 *                 "100|100",  // WORK_PLACE = 31 compound x|y
 *                 "7|5|0"  // TASK = 32 (JOB/WORK in Family) 3|30000|0 TASK_ID | Money |
 *             ],
 */
