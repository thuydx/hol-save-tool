'use client'

import React, {JSX, useEffect, useRef, useState} from 'react'
import {useParams, usePathname, useRouter} from 'next/navigation'
import langOptions, {Lang} from '@/lib/i18n'
import viDict from '@/lang/vi.json'
import {useDispatch} from 'react-redux'

import {
  CButton,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import {useTypedSelector} from '@/store'

const AppHeader = (): JSX.Element => {
  const headerRef = useRef<HTMLDivElement>(null)
  const {lang} = useParams<{ lang: Lang }>()
  const [t, setT] = useState<any>(viDict.menu ?? {})

  const pathname = usePathname()
  const router = useRouter()

  const switchLang = (newLang: string) => {
    if (!pathname) return

    const segments = pathname.split('/').filter(Boolean)

    // remove current lang
    if (segments[0] === lang) {
      segments.shift()
    }

    const newPath = `/${newLang}/${segments.join('/')}`
    router.push(newPath)
  }
  // const {colorMode, setColorMode} = useColorModes('zgs-theme-modern')

  // const dispatch = useDispatch()
  // const sidebarShow = useTypedSelector((state) => state.sidebarShow)
  // const asideShow = useTypedSelector((state) => state.asideShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
      headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    });
    import(`@/lang/${lang}.json`).then((m) => setT(m.default.menu ?? viDict.menu));
  }, [lang])
  const lhref = (path: string) => `/${lang}${path}`


  return (
    <CHeader position="sticky" className="mb-2 p-0">
      <CContainer fluid>
        <CHeaderNav className="me-2">
          <CButton href={lhref('/')} className="btn-primary btn-dark">{t.home}</CButton>
        </CHeaderNav>
        <CHeaderNav className="me-2">
          <CDropdown>
            <CDropdownToggle href={lhref('/family')} color="primary"
                             className="btn-primary btn-dark">{t.family}</CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href={lhref('/family')}>{t.familyInfo}</CDropdownItem>
              <CDropdownItem href={lhref('/family/members')}>{t.members}</CDropdownItem>
              <CDropdownItem href={lhref('/family/members-in-law')}>{t.membersInLaw}</CDropdownItem>
              <CDropdownItem href={lhref('/family/retainer')}>{t.retainer}</CDropdownItem>
              <CDropdownItem href={lhref('/family/warehouse')}>{t.warehouse}</CDropdownItem>
              <CDropdownItem href={lhref('/family/stable')}>{t.stable}</CDropdownItem>
              <CDropdownItem href={lhref('/family/farm')}>{t.farm}</CDropdownItem>
              <CDropdownItem href={lhref('/family/fief')}>{t.fief}</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
        {/* Relationship */}
        <CHeaderNav className="me-2">
          <CDropdown>
            <CDropdownToggle href={lhref('/relationship')} className="btn-primary btn-dark">
              {t.relationship}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href={lhref('/relationship/king')}>{t.king}</CDropdownItem>
              <CDropdownItem href={lhref('/relationship/other-family')}>
                {t.shiJiaNow}
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>


        {/* Things */}
        {/*<CHeaderNav className="me-2">*/}
        {/*  <CButton href={lhref('/items')} className="btn-primary btn-dark">{t.items}</CButton>*/}
        {/*  <CButton href={lhref('/tools')} className="btn-primary btn-dark">{t.tools}</CButton>*/}
        {/*</CHeaderNav>*/}
        {/* Search */}
        {/*<CHeaderNav className="ms-auto">*/}
        {/*<CForm className="d-none d-sm-flex">*/}
        {/*  <CInputGroup>*/}
        {/*    <CInputGroupText id="search-addon" className="border-0 px-1">*/}
        {/*      <CIcon icon={cilSearch} size="lg" className="my-1 mx-2"/>*/}
        {/*    </CInputGroupText>*/}
        {/*    <CFormInput*/}
        {/*      id="searchInput"*/}
        {/*      placeholder={t.search}*/}
        {/*      aria-label={t.search}*/}
        {/*      aria-describedby="search-addon"*/}
        {/*      className="bg-body-secondary border-0"*/}
        {/*    />*/}
        {/*  </CInputGroup>*/}
        {/*</CForm>*/}
        {/*<AppHeaderDropdownNotif />*/}
        {/*<AppHeaderDropdownTasks />*/}
        {/*<AppHeaderDropdownMssg />*/}
        {/*</CHeaderNav>*/}
        {/* Language Switcher */}
        <CHeaderNav className="ms-auto">
          <CDropdown variant="nav-item">
            <CDropdownToggle caret={false} className="py-0">
              <span style={{fontSize: '1.25rem'}}>
                <CIcon icon={langOptions.find((l) => l.code === lang)?.flag} size='lg'/>
              </span>
            </CDropdownToggle>

            <CDropdownMenu>
              {langOptions.map((l) => (
                <CDropdownItem
                  key={l.code}
                  active={l.code === lang}
                  onClick={() => switchLang(l.code)}
                  className="d-flex align-items-center gap-2"
                >
                  <CIcon icon={l.flag} size='lg'/>
                  <span>{l.label}</span>
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
        {/*<CHeaderToggler*/}
        {/*  className={classNames('d-lg-none', {*/}
        {/*    'prevent-hide': !sidebarShow,*/}
        {/*  })}*/}
        {/*  onClick={() => dispatch({type: 'set', sidebarShow: !sidebarShow})}*/}
        {/*  style={{marginInlineStart: '-14px'}}*/}
        {/*>*/}
        {/*  <CIcon icon={cilMenu} size="lg"/>*/}
        {/*</CHeaderToggler>*/}
        {/*<CHeaderNav className="ms-auto ms-md-0">*/}
        {/*  <AppHeaderDropdown/>*/}
        {/*</CHeaderNav>*/}
        {/*<CHeaderToggler*/}
        {/*  onClick={() => dispatch({type: 'set', asideShow: !asideShow})}*/}
        {/*  style={{marginInlineEnd: '-12px'}}*/}
        {/*>*/}
        {/*  <CIcon icon={cilApplicationsSettings} size="lg"/>*/}
        {/*</CHeaderToggler>*/}
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
