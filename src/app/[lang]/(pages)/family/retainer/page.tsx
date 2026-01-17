'use client'

import {useEffect, useMemo, useState} from "react";
import {CTableDataCell, CTableRow} from "@coreui/react";
import {useI18nClient} from '@/lib/i18nClient'
import {MenKeNowParsed} from "@/models/menKeNow";
import {MenKeNowRepository} from "@/repositories/MenKeNow";
import {useMenKeNow, useMenKesNow} from '@/hooks/useMenKeNow'
import {buildMenKeNowColumns} from '@/columns/menKeNow'
import {ColumnSchema} from "@/columns/buildBaseColumns";
import {InputCell} from "@/components/table/InputCell";
import {TableEditor} from '@/components/table/TableEditor'
import {MaxAttributeButton} from "@/components/button/MaxAttributeButton";


function MenKeNowRow({index, dataVersion, registerReload, unregisterReload,}: Readonly<{
  index: number
  dataVersion: number
  registerReload: (index: number, fn: () => void) => void
  unregisterReload: (index: number) => void
}>) {
  const {t} = useI18nClient<any>()
  const {row: member, update, load, loading} = useMenKeNow(index)
  const columns = useMemo(() => buildMenKeNowColumns(t), [t])

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
      {/*<CTableDataCell>{member.id}</CTableDataCell>*/}
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
export default function RetainerPage() {
  const {t} = useI18nClient<any>()
  const repo = useMemo(() => new MenKeNowRepository(), [])
  const columns = useMemo<ColumnSchema<MenKeNowParsed>>(
    () => buildMenKeNowColumns(t),
    [t]
  )
  const {indexes, load, forceReload} = useMenKesNow()
  const [dataVersion, setDataVersion] = useState(0)
  useEffect(() => {
    void load()
  }, [load, dataVersion]);

  return (
    <TableEditor<MenKeNowParsed>
      showIdColumn={false}
      title={t.retainer?.title ?? 'Retainers'}
      columns={columns}
      indexes={indexes}
      renderHeaderAction={() => (
        <div style={{display: 'flex', gap: 8, flexWrap: 'nowrap', alignItems: 'center', }}
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
        <MenKeNowRow
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
 * "MenKe_Now": {
 *         "value": [
 *             [
 *                 "M13400699116884270645", // ID = 0
 *                 "7|10|2|2", // APPEARANCE = 1 compound Back Hair|Body|Face Shape|Front Hair
 *                 "Phòng Tố Bình|4|0|0|0|75|2|1|9|null", // PERSON_DATA = 2 compound Character Name | ?? | talentType (None: 0, WR:1, MI:2, BU:3, AR:4) | talentValue | SexID(Female:0, Male: 1) | Lifespan | Skill | Luck | Trait | Hobby? Null for retainers
 *                 "24", // AGE = 3
 *                 "26",  // LITERARY = 4
 *                 "4",  // MARTIAL = 5
 *                 "21", // BUSINESS = 6
 *                 "6",  // ART = 7
 *                 "90",  // MOOD = 8
 *                 "8|CBI1010|null", // LOCATION = 9 compound Job_ID | BuildID (ID of the building they are in) | Student MemberID
 *                 "18",  // STATUS = 10 (状态) Label on top of avatar, 17 = Doing gigs, 18 = Street trading, 19 = Collecting intel, 20 = Spreading rumor, 21 = Private teacher, 22 = Stage actor, 23 = Clan teacher, 24 = Training coach,
 *                 "15.25",  // REPUTATION = 11 Renown
 *                 "1",  // UNKNOW_COL = 12 null|0 = yes, 1 = no
 *                 "6",  //  CHARM = 13 Charisma
 *                 "100", // HEALTH = 14
 *                 "25", // SCHEMES = 15
 *                 "3",  // SKILL_POINT = 16
 *                 "-1",  // PREGNANCY_MONTHS = 17
 *                 "1140",  // SALARY = 18
 *                 "24",  // STAMINA = 19
 *                 "0",  // UNKNOW_COL = 20
 *                 "null" // TAGS = 21
 *             ],
 *       ]}
 */

