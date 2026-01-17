import React, {JSX} from 'react'
import Link from 'next/link'
import {useDispatch} from 'react-redux'
import {useTypedSelector} from '@/store'
import {CCloseButton, CHeaderText, CSidebar, CSidebarBrand, CSidebarHeader, CSidebarToggler,} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import AppSidebarNav from '@/components/dashboard/AppSidebarNav'
import {sygnet} from '@/public/brand/sygnet'

// sidebar nav config
import navigation from '@/components/dashboard/_nav'

const AppSidebar = (): JSX.Element => {
  const dispatch = useDispatch()
  const unfoldable = useTypedSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useTypedSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({type: 'set', sidebarShow: visible})
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand as={Link} href="/">
          {/*<CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />*/}
          <CHeaderText className="sidebar-brand-full"> DASHBOARD </CHeaderText>
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32}/>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({type: 'set', sidebarShow: false})}
        />
        <CSidebarToggler
          onClick={() => dispatch({type: 'set', sidebarUnfoldable: !unfoldable})}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation}/>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
