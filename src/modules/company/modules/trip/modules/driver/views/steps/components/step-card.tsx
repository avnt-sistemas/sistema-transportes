import { Box, Card, CardContent, Chip, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'

import { TripStatus } from 'src/modules/company/modules/trip/interfaces/TripStatus'
import Trip, { getTripStatusItem } from 'src/modules/company/modules/trip/interfaces/trip'

export interface StepCardProps {
  title?: string
  trip: Trip
  children: ReactNode
}

export function StepCard({ title = 'Detalhes da viagem', trip, children }: StepCardProps) {
  const { t } = useTranslation()
  const statusItem = getTripStatusItem(t, trip.status as TripStatus)

  return (
    <Card>
      <CardContent>
        <Box width='100%' sx={{ display: 'flex', justifyContent: 'space-between', mb: 6 }}>
          <Typography variant='h4'>{title}</Typography>
          <Chip
            color={statusItem.color}
            icon={<IconifyIcon icon={statusItem.icon} color='#efefef' />}
            label={statusItem.name}
          />
        </Box>
        <Box width='100%' sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant='h5'>Local Carga</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {trip.start_location!.street}, {trip.start_location!.number}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {trip.start_location!.city} - {trip.start_location!.state}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {trip.start_location!.postalCode}
            </Typography>
          </Box>
        </Box>
        <Box width='100%' sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant='h5'>Local Descarga</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {trip.end_location!.street}, {trip.end_location!.number}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {trip.end_location!.city} - {trip.end_location!.state}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {trip.end_location!.postalCode}
            </Typography>
          </Box>
        </Box>
        {children}
      </CardContent>
    </Card>
  )
}
