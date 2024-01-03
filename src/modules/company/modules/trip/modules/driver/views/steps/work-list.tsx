import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DriverLayoutPage from 'src/@core/layouts/DriverLayout'
import EmployeeEntity from 'src/modules/company/modules/person/entities/employee-entity'
import Employee from 'src/modules/company/modules/person/interfaces/employee'
import Trip from 'src/modules/company/modules/trip/interfaces/trip'
import { WorkItemStep } from 'src/modules/company/modules/trip/modules/driver/views/steps/work-item'
import TripService from 'src/modules/company/modules/trip/services/trip-service'

const DriverHomePage = () => {
  const { t } = useTranslation()

  const employeeEntity = new EmployeeEntity(t)

  const router = useRouter()

  const [driver, setDriver] = useState<Employee>()
  const [trips, setTrips] = useState<Trip[]>([])

  useEffect(() => {
    if (router.isReady)
      employeeEntity.getLoggedEmployee().then(resp => {
        if (!resp || !driver || resp.id !== driver.id) setDriver(resp)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  useEffect(() => {
    if (driver && driver.id) getTrips()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driver])

  function getTrips() {
    if (driver && driver.id) {
      const service = new TripService()
      service.getDriverTrips(driver.id).then(resp => {
        setTrips(resp || [])
      })
    }
  }

  return (
    <Grid container spacing={6}>
      {trips.map((trip, index) => {
        return (
          <Grid key={trip.id} item xs={12} sm={6} md={4} lg={4} xl={3} m={2}>
            <WorkItemStep title={'Viagem ' + (index + 1)} trip={trip} afterSave={() => getTrips()} />
          </Grid>
        )
      })}
    </Grid>
  )
}

DriverHomePage.getLayout = (page: ReactNode) => <DriverLayoutPage>{page}</DriverLayoutPage>

export default DriverHomePage
