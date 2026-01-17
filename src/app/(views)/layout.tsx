'use client'
import {ReactNode} from 'react'
import {AppAside, AppBreadcrumb, AppFooter, AppHeader} from '@/components'
import {CContainer} from '@coreui/react'
import GuideLine from "@/components/guide/GuideLine";
import {GuideLineProvider} from '@/lib/providers/GuideLine'
import {Provider} from 'react-redux'
import store from '@/store'

export default function Layout({children}: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <GuideLineProvider>
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader/>
          <div className="body flex-grow-1">
            <CContainer fluid className="px-4">
              <AppBreadcrumb/>
              <GuideLine/>
              {children}
            </CContainer>
          </div>
          <AppFooter/>
        </div>
        <AppAside/>
      </GuideLineProvider>
    </Provider>
  )
}
