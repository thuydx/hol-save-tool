'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import {useI18nClient} from '@/lib/i18nClient'

import {TableEditor} from '@/components/table/TableEditor'
import {InputCell} from '@/components/table/InputCell'
import {MaxAttributeButton} from '@/components/button/MaxAttributeButton'

import {buildMemberNowColumns} from '@/columns/memberNow'
import {useMember, useMembers} from '@/hooks/member'

import {MemberNowRepository} from '@/repositories/MemberNow'
import {MemberParsed} from '@/models/members'
import {ColumnSchema} from "@/columns/buildBaseColumns";
import {CTableDataCell, CTableRow} from "@coreui/react";

/* =========================================================
 * Row
 * ========================================================= */

function MemberNowRow({index, dataVersion, openAvatar}: Readonly<{
  index: number
  dataVersion: number
  openAvatar?: (member: MemberParsed) => void;
}>) {
  const {t} = useI18nClient<any>()
  const {row: member, update, load, loading} = useMember(index)
  const columns = useMemo(() => buildMemberNowColumns(t), [t])

  useEffect(() => {
    void load()
  }, [load])

  if (loading || !member) {
    return null
  }

  return (
    <CTableRow>
      <CTableDataCell>
            {member.id}
        </CTableDataCell>
      {columns.map(col => (
        <CTableDataCell key={col.key} style={col.width ? {width: col.width} : undefined}>
          { col.render ? (
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

export default function MemberNowPage() {
  const {t} = useI18nClient<any>()
  const repo = useMemo(() => new MemberNowRepository(), [])
  const columns = useMemo<ColumnSchema<MemberParsed>>(
    () => buildMemberNowColumns(t),
    [t],
  )
  const {indexes, load, forceReload} = useMembers()
  const [dataVersion, setDataVersion] = useState(0)

  useEffect(() => {
    void load()
  }, [load, dataVersion])

  return (
    <TableEditor<MemberParsed>
      showIdColumn={true}
      title={t.member?.title ?? 'Members'}
      columns={columns}
      indexes={indexes}
      renderHeaderAction={() => (
        <div style={{display: 'flex', gap: 8, flexWrap: 'nowrap', alignItems: 'center'}}>
          <MaxAttributeButton
            label={t.member?.batch?.upHalf ?? 'Up Half'}
            onClick={async () => {
              await repo.batchUpdate(row => columns.upHalf(row))
              setDataVersion(v => v + 1)
              forceReload()
              // rowReloaders.current.forEach(fn => fn())
            }}
          />
        <MaxAttributeButton
          label={t.member?.batch?.maxAll ?? 'Max All'}
          onClick={async () => {
            await repo.batchUpdate(row => columns.maxAll(row))
            setDataVersion(v => v + 1)
            forceReload()
            // rowReloaders.current.forEach(fn => {
            //   fn()
            // })
          }}
        />
        </div>
      )}
      renderRowAction={(index, helpers) => (
        <MemberNowRow
          key={`${index}-${dataVersion}`}
          index={index}
          dataVersion={dataVersion}
          // registerReload={helpers.registerReload}
          // unregisterReload={helpers.unregisterReload}
          // openAvatar={(member) => {
          //   setSelectedMember(member);
          //   setShowAvatar(true);
          // }}
        />
      )}
    />
  )
}
