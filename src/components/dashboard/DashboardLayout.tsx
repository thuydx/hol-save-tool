import {AppAside, AppFooter, AppHeader, AppSidebar} from '@/components/dashboard/index'
import {CContainer} from '@coreui/react'

function DefaultLayout({children}: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar/>
      <div className="wrapper d-flex flex-column min-vh-100 bg-dark dark:bg-transparent">
        <AppHeader/>
        <div className="body flex-grow-1 px-3">
          <CContainer fluid >{children}</CContainer>
        </div>
        <AppFooter/>
      </div>
      <AppAside/>
    </>
  )
}

export default DefaultLayout
