import { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import LoginPage from 'src/modules/company/modules/trip/modules/driver/views/login'

const DriverLoginPage = () => {
  return <LoginPage />
}

DriverLoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

DriverLoginPage.guestGuard = true

export default DriverLoginPage
