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
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, {useEffect, useMemo, useState} from 'react'
import {useI18nClient} from '@/lib/i18nClient'
import {FamilyDataRepository} from '@/repositories/FamilyData'
import {ZiBeiItem, ZiBeiNowRepository} from "@/repositories/ZiBeiNow";
import {CGNumRepository} from '@/repositories/CGNum'
import {NuLiNumRepository} from '@/repositories/NuLiNum'
import {MemberNowRepository} from "@/repositories/MemberNow";
import {MemberParsed, MemberTitleFengdi} from "@/models/members";
import {useParams} from "next/navigation";
import {MemberQuRepository} from "@/repositories/MemberQu";
import {MenKeNowRepository} from "@/repositories/MenKeNow";
import {ShiJiaNowRepository} from "@/repositories/ShiJiaNow";
import {ShiJiaNowParsed} from "@/types/ShiJiaNow";
import {ItemIcon} from "@/components/item/ItemIcon";

/**
 * Family Data
 * "FamilyData": {
 *   "__type": "System.Collections.Generic.List`1[[System.String, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]],mscorlib",
 *     "value": [
 *     "5|4",  // coordinates latitude|longitude
 *     "Ðinh", // Family Name
 *     "44",   // Family Level
 *     "829",  // Renown
 *     "14.1", // Influence to kingdom
 *     "35960749", // Family warehouse capacity
 *     "241",
 *     "0",
 *     "null",
 *     "0"
 *   ]
 * },
 *
 */

type FamilyData = {
  coordinates: string
  name: string
  level: string
  renown: string
  influence: string
  capacity: string
  stableCapacity: string
  col_7: string
  col_8: string
  col_9: string
}

type I18nSchema = {
  family: {
    title: string
    description: string
    instruction: string
    coordinates: string
    name: string
    level: string
    renown: string
    influence: string
    capacity: string
    stableCapacity: string
    zibeiTitle: string,
    zibeiListTitle: string,
    zibei: string,
    zibeiLevel: string,
    zibeiPosition: string,
    zibeiPositionOption1: string,
    zibeiPositionOption2: string,
    zibeiLevelError: string
    memberNowCount: string
    memberQuCount: string
    menKeCount: string
    headman: {
      title: string
      name: string
      officialTitle: string
      fengdiTitle: string
    }
    shiJiaNow: {
      title: string,
      name: string,
      relationship: string,
    }
  }
  official_title: Record<string, string>
  city_name: Record<string, string>
  fief_level: Record<string, string>
  fief_name: Record<string, string>
  clan_name: string
  place_name: Record<string, string>
  treasury: {
    title: string
    description: string
    instruction: string
    gold: string
    silver: string
  }
  slave: {
    title: string
    description: string
    count: string
  }
  menu: {
    treasury: string
  }
  items: Record<string, string>
  common: {
    action: string,
    add: string,
    delete: string
  }
  uploader: {
    toastTitle: string
  }
}
const repo = new FamilyDataRepository()
const zibeiRepo = new ZiBeiNowRepository()
const cgNumRepo = new CGNumRepository()
const nuLiNumRepo = new NuLiNumRepository()
const memberRepo = new MemberNowRepository()
const memberQuRepo = new MemberQuRepository()
const menKeNowRepo = new MenKeNowRepository()
const shiJiaNowRepo = new ShiJiaNowRepository()

const Family = () => {
  const params = useParams()
  const {t} = useI18nClient<I18nSchema>()
  const [familyData, setFamilyData] = useState<FamilyData | null>(null)
  const [zibeiList, setZibeiList] = useState<ZiBeiItem[]>([])
  const [zibeiLevelError, setZibeiLevelError] = useState<string | null>(null)
  const [newZibei, setNewZibei] = useState<ZiBeiItem>({
    name: '',
    level: '',
    position: '',
  })
  const ZIBEI_POSITION_OPTIONS = [
    {value: '0', label: t.family.zibeiPositionOption1},
    {value: '1', label: t.family.zibeiPositionOption2},
  ]
  const [silver, setSilver] = useState('')
  const [gold, setGold] = useState('')
  const [value, setValue] = useState<number>(0)
  const [headman, setHeadman] = useState<MemberParsed | null>()
  const [memberNowCount, setMemberNowCount] = useState(0)
  const [memberQuCount, setMemberQuCount] = useState(0)
  const [menKeCount, setMenKeCount] = useState(0)
  const [shiJiaNow, setShiJiaNow] = useState<ShiJiaNowParsed[]>([])
  /* -------------------------------
  * Load from LocalStorage
  * ------------------------------- */
  useEffect(() => {
    cgNumRepo.get().then(data => {
      setSilver(data.silver)
      setGold(data.gold)
    })
    nuLiNumRepo.get().then(setValue)
  }, [])
  useEffect(() => {
    const loadCounts = async () => {
      const memberNow = await memberRepo.all()
      const memberQu = await memberQuRepo.all()
      const menKeNow = await menKeNowRepo.all()
      const shiJiaNow = await shiJiaNowRepo.getAll()
      setMemberNowCount(memberNow.length)
      setMemberQuCount(memberQu.length)
      setMenKeCount(menKeNow.length)
      setShiJiaNow(shiJiaNow)
    }
    void loadCounts()
  }, [memberNowCount, memberQuCount, menKeCount])

  const getPositionLabel = (value?: string) =>
    ZIBEI_POSITION_OPTIONS.find(o => o.value === value)?.label ?? t.family.zibeiPositionOption1

  useEffect(() => {
    const load = async () => {
      const data = await repo.getData()
      setFamilyData({
        ...data,
        col_7: '',
        col_8: '',
        col_9: '',
      })

      setZibeiList(await zibeiRepo.getData())
      setHeadman(await memberRepo.getChiefMember())
    }

    void load()
  }, []) // 🔥 CHỈ CHẠY 1 LẦN


  const suggestedLevel = useMemo(() => {
    if (zibeiList.length === 0) return '1'
    const maxLevel = Math.max(...zibeiList.map(z => Number(z.level)))
    return String(maxLevel + 1)
  }, [zibeiList])

  const isValidLevel = (
    value: string,
    list: ZiBeiItem[],
    editingIndex?: number
  ) => {
    // 1. phải là số nguyên
    if (!/^\d+$/.test(value)) return false

    const levelNum = Number(value)
    if (levelNum <= 0) return false

    // 2. unique (bỏ qua row đang edit)
    return !list.some((item, idx) =>
      idx !== editingIndex && item.level === value
    )
  }

  function formatTemplate(
    template: string,
    vars: Record<string, string>
  ) {
    return template.replace(
      /\{(\w+)\}/g,
      (_, key) => vars[key] ?? ''
    )
  }

  function getFamilyTitle(
    t: I18nSchema,
    familyData: FamilyData | null
  ): string {
    if (!familyData) return t.family.title

    const place =
      t.place_name[familyData.coordinates] ??
      familyData.coordinates

    const clan = formatTemplate(t.clan_name, {
      name: familyData.name,
    })

    // Ví dụ:
    // EN: Xiangfan · Clan of Đinh
    // VI: Tương Phàn · Đinh Thị
    // CN: 襄樊 · Đinh氏宗族
    return `${place} · ${clan}`
  }

  function buildShiJiaNowTitle(
    t: I18nSchema,
    coordinates: string,
    name: string,
  ) {
    const place =
      t.place_name[coordinates] ?? coordinates

    const clan = formatTemplate(t.clan_name, {
      name,
    })

    // Ví dụ:
    // VI: Yến Lăng · Đinh Thị
    // EN: Yeanlan · Clan of Dinh
    return `${place} · ${clan}`
  }

  const OFFICIAL_TITLE_OPTIONS = useMemo(
    () =>
      Object.entries(t.official_title).map(([key, label]) => ({
        key,
        label,
      })),
    [t.official_title]
  )

  const FIEF_LEVEL_OPTIONS = useMemo(
    () =>
      Object.entries(t.fief_level).map(([value, label]) => ({
        value: Number(value),
        label,
      })),
    [t.fief_level]
  )

  const FIEF_CITY_OPTIONS = useMemo(
    () =>
      Object.entries(t.fief_name)
        .filter(([k]) => k !== '0')
        .map(([value, label]) => ({
          value: Number(value),
          label,
        })),
    [t.fief_name]
  )


  const updateName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setFamilyData(p => (p ? {...p, name: v} : p))
    await repo.updateName(v)
  }

  const updateLevel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setFamilyData(p => (p ? {...p, level: v} : p))
    await repo.updateLevel(v)
  }

  const updateRenown = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setFamilyData(p => (p ? {...p, renown: v} : p))
    await repo.updateRenown(v)
  }

  const updateInfluence = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setFamilyData(p => (p ? {...p, influence: v} : p))
    await repo.updateInfluence(v)
  }

  const updateCapacity = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setFamilyData(p => (p ? {...p, capacity: v} : p))
    await repo.updateCapacity(v)
  }

  const updateStableCapacity = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setFamilyData(p => (p ? {...p, stableCapacity: v} : p))
    await repo.updateStableCapacity(v)
  }

  /* -------------------------------
   * Handlers (auto save)
   * ------------------------------- */
  const onSilverChange = async (value: string) => {
    setSilver(value)
    await cgNumRepo.updateSilver(value)
  }

  const onGoldChange = async (value: string) => {
    setGold(value)
    await cgNumRepo.updateGold(value)
  }

  const onChange = async (v: string) => {
    const num = Number(v)
    if (Number.isNaN(num)) return

    setValue(num)
    await nuLiNumRepo.update(num)
  }
  return (
    <CRow>
      <CCol xs={4}>
        <CCard className="mb-3">
          <CCardHeader>
            <CCardTitle>
              {getFamilyTitle(t, familyData)}
            </CCardTitle>
          </CCardHeader>

          <CCardBody>
            {/* COORDINATES */}
            <CRow className="align-items-center mb-2">
              <CCol xs={7}>
                <label className="form-label mb-0">
                  {t.family.coordinates}
                </label>
              </CCol>
              <CCol xs={5}>
                {familyData?.coordinates ?? '0|0'}{' '}
                · {t.place_name[familyData?.coordinates ?? '0|0'] ?? ''}
              </CCol>
            </CRow>

            {/* NAME */}
            <CRow className="align-items-center">
              <CCol xs={7}>
                <label className="form-label mb-0">
                  {t.family.name}
                </label>
              </CCol>
              <CCol xs={5}>
                <CFormInput
                  size="sm"
                  type="text"
                  value={familyData?.name ?? ''}
                  onChange={updateName}
                />
              </CCol>
            </CRow>
            <CRow className="align-items-center">
              <CCol xs={7}>
                <label className="form-label mb-0">
                  {t.family.level}
                </label>
              </CCol>
              <CCol xs={5}>
                <CFormInput
                  size="sm"
                  type="number"
                  min={0}
                  max={99}
                  value={familyData?.level ?? ''}
                  onChange={updateLevel}
                />
              </CCol>
            </CRow>
            <CRow className="align-items-center">
              <CCol xs={7}>
                <label className="form-label mb-0">
                  {t.family.renown}
                </label>
              </CCol>
              <CCol xs={5}>
                <CFormInput
                  size="sm"
                  type="number"
                  min={0}
                  value={familyData?.renown ?? ''}
                  onChange={updateRenown}
                />
              </CCol>
            </CRow>
            <CRow className="align-items-center">
              <CCol xs={7}>
                <label className="form-label mb-0">
                  {t.family.influence}
                </label>
              </CCol>
              <CCol xs={5}>
                <CFormInput
                  size="sm"
                  type="number"
                  min={0}
                  max={100}
                  value={familyData?.influence ?? ''}
                  onChange={updateInfluence}
                />
              </CCol>
            </CRow>
            <CRow className="align-items-center">
              <CCol xs={7}>
                <label className="form-label mb-0">
                  {t.family.capacity}
                </label>
              </CCol>
              <CCol xs={5}>
                <CFormInput
                  size="sm"
                  type="number"
                  min={0}
                  value={familyData?.capacity ?? ''}
                  onChange={updateCapacity}
                />
              </CCol>
            </CRow>
            <CRow className="align-items-center">
              <CCol xs={7}>
                <label className="form-label mb-0">
                  {t.family.stableCapacity}
                </label>
              </CCol>
              <CCol xs={5}>
                <CFormInput
                  size="sm"
                  type="number"
                  min={0}
                  value={familyData?.stableCapacity ?? ''}
                  onChange={updateStableCapacity}
                />
              </CCol>
            </CRow>
            {/* MEMBER COUNTS */}
            <CRow className="align-items-center">
              <CCol xs={7}>
                <label className="form-label mb-0">
                  {t.family.memberNowCount}
                </label>
              </CCol>
              <CCol xs={5}>
                {memberNowCount}
              </CCol>
            </CRow>

            <CRow className="align-items-center">
              <CCol xs={7}>
                <label className="form-label mb-0">
                  {t.family.memberQuCount}
                </label>
              </CCol>
              <CCol xs={5}>
                {memberQuCount}
              </CCol>
            </CRow>

            <CRow className="align-items-center">
              <CCol xs={7}>
                <label className="form-label mb-0">
                  {t.family.menKeCount}
                </label>
              </CCol>
              <CCol xs={5}>
                {menKeCount}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        {/** Chief - Headman **/}
        <CCard className="mb-3">
          <CCardHeader>
            <CCardTitle>{t.family.headman.title}</CCardTitle>
          </CCardHeader>

          <CCardBody>
            {/* NAME */}
            <CRow className="align-items-center mb-2">
              <CCol xs={5}>
                <label className="form-label mb-0">
                  {t.family.headman.name}
                </label>
              </CCol>
              <CCol xs={7}>
                {headman?.person.name ?? ''}
              </CCol>
            </CRow>
            {/* FENDI_TITLE */}
            {/*<CRow className="align-items-center mb-2">*/}
            {/*  <CCol xs={5}>*/}
            {/*    <label className="form-label mb-0">*/}
            {/*      {t.family.headman.fengdiTitle}*/}
            {/*    </label>*/}
            {/*  </CCol>*/}
            {/*  <CCol xs={7}>*/}
            {/*    {headman?.titleFengdi*/}
            {/*      ? getFengdiLabel(t, headman.titleFengdi, lang)*/}
            {/*      : t.fief_level['0']}*/}
            {/*    /!*{headman?.titleFengdi?.level ?? ''}@{headman?.titleFengdi?.prefectureId ?? ''}*!/*/}
            {/*  </CCol>*/}
            {/*</CRow>*/}
            {/* FENGDI LEVEL */}
            <CRow className="align-items-center mb-2">
              <CCol xs={5}>
                <label className="form-label mb-0">
                  {t.family.headman.fengdiTitle}
                </label>
              </CCol>

              <CCol xs={7}>
                <CDropdown style={{paddingRight: '0.5rem'}}>
                  <CDropdownToggle size="sm" color="secondary">
                    {t.fief_name[
                      String(headman?.titleFengdi?.prefectureId ?? 0)
                      ]}
                  </CDropdownToggle>

                  <CDropdownMenu style={{maxHeight: 240, overflowY: 'auto'}}>
                    {FIEF_CITY_OPTIONS.map(opt => (
                      <CDropdownItem
                        key={opt.value}
                        onClick={() => {
                          if (!headman?.titleFengdi) return

                          const level = headman.titleFengdi.level
                          const prefectureId = opt.value

                          void (async () => {
                            await memberRepo.updateTitleFengdi(level, prefectureId)
                            setHeadman(await memberRepo.getChiefMember())
                          })()
                        }}
                      >
                        {opt.label}
                      </CDropdownItem>
                    ))}
                  </CDropdownMenu>
                </CDropdown>
                <CDropdown>
                  <CDropdownToggle size="sm" color="secondary">
                    {t.fief_level[String(headman?.titleFengdi?.level ?? 0)]}
                  </CDropdownToggle>

                  <CDropdownMenu>
                    {FIEF_LEVEL_OPTIONS.map(opt => (
                      <CDropdownItem
                        key={opt.value}
                        onClick={() => {
                          if (!headman?.titleFengdi) return

                          const level = opt.value
                          const prefectureId = headman.titleFengdi.prefectureId

                          void (async () => {
                            await memberRepo.updateTitleFengdi(level, prefectureId)
                            setHeadman(await memberRepo.getChiefMember())
                          })()
                        }}
                      >
                        {opt.label}
                      </CDropdownItem>
                    ))}
                  </CDropdownMenu>
                </CDropdown>
              </CCol>
            </CRow>
            <CRow className="align-items-center mb-2">
              <CCol xs={5}>
                <label className="form-label mb-0">
                  {t.family.headman.officialTitle}
                </label>
              </CCol>

              <CCol xs={7}>
                <CDropdown>
                  <CDropdownToggle size="sm" color="secondary">
                    {t.official_title[
                    headman?.officialTitle?.i18nKey ?? '0@0@0'
                      ]}
                  </CDropdownToggle>

                  <CDropdownMenu style={{maxHeight: 240, overflowY: 'auto'}}>
                    {OFFICIAL_TITLE_OPTIONS.map(opt => (
                      <CDropdownItem
                        key={opt.key}
                        onClick={() => {
                          // opt.key MUST be "a@b@c"
                          const abcKey = opt.key
                          // HARD GUARD
                          if (!/^\d+@\d+@\d+$/.test(abcKey)) {
                            console.error('Invalid official title key:', abcKey)
                            return
                          }
                          void (async () => {
                            await memberRepo.updateOfficialTitle(abcKey)
                            setHeadman(await memberRepo.getChiefMember())
                          })()
                        }}
                      >
                        {opt.label}
                      </CDropdownItem>
                    ))}
                  </CDropdownMenu>
                </CDropdown>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={5}>
        <CCard className="mb-3">
          <CCardHeader>
            <CCardTitle  className="d-inline-flex align-items-center gap-2"><ItemIcon id="zibei" iconSet="main" /> {t.family.zibeiTitle}</CCardTitle>
          </CCardHeader>
          <CCardBody className="p-0">
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>{t.family.zibei}</CTableHeaderCell>
                  <CTableHeaderCell>{t.family.zibeiLevel}</CTableHeaderCell>
                  <CTableHeaderCell>{t.family.zibeiPosition}</CTableHeaderCell>
                  <CTableHeaderCell>{t.common.action}</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>
                    <CFormInput
                      size="sm"
                      value={newZibei.name}
                      onChange={e => setNewZibei(p => ({...p, name: e.target.value}))}
                    />
                  </CTableDataCell>
                  <CTableDataCell width={100}>
                    <CFormInput
                      size="sm"
                      type="number"
                      min={1}
                      value={newZibei.level}
                      invalid={!!zibeiLevelError}
                      onChange={e => {
                        const v = e.target.value
                        setNewZibei(p => ({...p, level: v}))
                        if (!isValidLevel(v, zibeiList)) {
                          setZibeiLevelError(t.family.zibeiLevelError)
                        } else {
                          setZibeiLevelError(null)
                        }
                      }}
                    />
                    {zibeiLevelError && (
                      <div className="text-danger small mt-1">
                        {zibeiLevelError}
                      </div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell width={80}>
                    <CDropdown>
                      <CDropdownToggle color="secondary" size="sm">
                        {getPositionLabel(newZibei.position)}
                      </CDropdownToggle>
                      <CDropdownMenu>
                        {ZIBEI_POSITION_OPTIONS.map(opt => (
                          <CDropdownItem
                            key={opt.value}
                            onClick={async () => {
                              // update UI state nếu có
                              setNewZibei(p => ({...p, position: opt.value}))
                              // await zibeiRepo.updateZibeiPosition(opt.value)
                            }}
                          >
                            {opt.label}
                          </CDropdownItem>
                        ))}
                      </CDropdownMenu>
                    </CDropdown>

                  </CTableDataCell>
                  <CTableDataCell width={100}>
                    <CButton
                      color="primary"
                      size="sm"
                      style={{width: '60px'}}
                      disabled={
                        !newZibei.name ||
                        !isValidLevel(newZibei.level || suggestedLevel, zibeiList)
                      }
                      onClick={async () => {
                        await zibeiRepo.create(newZibei)
                        setZibeiList(await zibeiRepo.getData())
                        setNewZibei({name: '', level: '', position: ''})
                        setZibeiLevelError(null)
                      }}
                    >
                      {t.common.add}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
        <CCard className="mb-3">
          <CCardHeader>
            <CCardTitle className="d-inline-flex align-items-center gap-2"><ItemIcon id="zibei" iconSet="main" /> {t.family.zibeiListTitle}</CCardTitle>
          </CCardHeader>
          <CCardBody className="p-0">
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>{t.family.zibei}</CTableHeaderCell>
                  <CTableHeaderCell>{t.family.zibeiLevel}</CTableHeaderCell>
                  <CTableHeaderCell>{t.family.zibeiPosition}</CTableHeaderCell>
                  <CTableHeaderCell>{t.common.action}</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {zibeiList.map((z, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>
                      <CFormInput
                        size="sm"
                        value={z.name}
                        onChange={async e => {
                          await zibeiRepo.updateZibei(i, e.target.value)
                          setZibeiList(await zibeiRepo.getData())
                        }}
                      />
                    </CTableDataCell>
                    <CTableDataCell width={100}>
                      <CFormInput
                        size="sm"
                        type="number"
                        min={1}
                        value={z.level}
                        invalid={!isValidLevel(z.level, zibeiList, i)}
                        onChange={async e => {
                          const v = e.target.value
                          // cập nhật UI trước
                          setZibeiList(list =>
                            list.map((item, idx) =>
                              idx === i ? {...item, level: v} : item
                            )
                          )
                          // validate
                          if (!isValidLevel(v, zibeiList, i)) return
                          // save
                          await zibeiRepo.updateZibeiLevel(i, v)
                          setZibeiList(await zibeiRepo.getData())
                        }}
                      />

                    </CTableDataCell>

                    <CTableDataCell width={80}>
                      <CDropdown>
                        <CDropdownToggle size="sm" color="secondary">
                          {getPositionLabel(z.position)}
                        </CDropdownToggle>
                        <CDropdownMenu>
                          {ZIBEI_POSITION_OPTIONS.map(opt => (
                            <CDropdownItem
                              key={opt.value}
                              onClick={async () => {
                                await zibeiRepo.updateZibeiPosition(i, opt.value)
                                setZibeiList(await zibeiRepo.getData())
                              }}
                            >
                              {opt.label}
                            </CDropdownItem>
                          ))}
                        </CDropdownMenu>
                      </CDropdown>
                    </CTableDataCell>
                    <CTableDataCell width={100}>
                      <CButton
                        size="sm"
                        color="danger"
                        style={{width: '60px'}}
                        onClick={async () => {
                          await zibeiRepo.delete(i)
                          setZibeiList(await zibeiRepo.getData())
                        }}
                      >
                        {t.common.delete}
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
        <CRow className="align-items-center">
          <CCol xs={6}>
            <CCard className="mb-0">
              <CCardHeader>
                <CCardTitle className="d-inline-flex align-items-center gap-2"><ItemIcon id="treasury" iconSet="main" /> {t.treasury.title}</CCardTitle>
              </CCardHeader>
              <CCardBody>
                {/* SILVER */}
                <CRow className="align-items-center mb-2">
                  <CCol xs={4}>
                    <ItemIcon id="silver" iconSet="main" />
                    {/*<label className="form-label mb-0">*/}
                    {/*  {t.treasury.silver}*/}
                    {/*</label>*/}
                  </CCol>
                  <CCol xs={8}>
                    <CFormInput
                      size="sm"
                      type="number"
                      min={0}
                      value={silver}
                      onChange={e => onSilverChange(e.target.value)}
                    />
                  </CCol>
                </CRow>
                {/* GOLD */}
                <CRow className="align-items-center">
                  <CCol xs={4}>
                      <ItemIcon id="gold" iconSet="main" />
                    {/*<label className="form-label mb-0">*/}
                      {/*{t.treasury.gold}*/}
                    {/*</label>*/}
                  </CCol>
                  <CCol xs={8}>
                    <CFormInput
                      size="sm"
                      type="number"
                      min={0}
                      value={gold}
                      onChange={e => onGoldChange(e.target.value)}
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={6}>
            <CCard className="mb-4">
              <CCardHeader>
                <CCardTitle className="d-inline-flex align-items-center gap-2"><ItemIcon id="slave" iconSet="main" /> {t.slave.title}</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CRow className="align-items-center">
                  <CCol xs={5}>
                    <label className="form-label mb-0">
                      {t.slave.count}
                    </label>
                  </CCol>
                  <CCol xs={7}>
                    <CFormInput
                      size="sm"
                      type="number"
                      min={0}
                      value={value}
                      onChange={e => onChange(e.target.value)}
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCol>
      <CCol xs={3}>
        <CCard className="mb-3">
          <CCardHeader>
            <CCardTitle>
              {t.family.shiJiaNow.title}
            </CCardTitle>
          </CCardHeader>
          <CCardBody className="p-2">
            <CTable small striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>
                    {t.family.shiJiaNow.name}
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{width: 120}}>
                    {t.family.shiJiaNow.relationship}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {shiJiaNow.length === 0 && (
                  <CTableRow>
                    <CTableDataCell colSpan={2} className="text-center text-muted">
                      —
                    </CTableDataCell>
                  </CTableRow>
                )}
                {shiJiaNow.map(of => (
                  <CTableRow key={of.id}>
                    <CTableDataCell>
                      {buildShiJiaNowTitle(
                        t,
                        of.coordinates,
                        of.name,
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      {of.relationshipIndex}%
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
export default Family
