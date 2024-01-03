import { Button } from '@mui/material'
import { StepCard } from './components/step-card'
import Trip from '../../../../interfaces/trip'
import TripEntity from '../../../../entities/trip-entity'
import { useTranslation } from 'react-i18next'

export interface WorkItemStepProps {
  title?: string
  trip: Trip
  afterSave(trip: Trip): void
}

export function WorkItemStep({ title, trip, afterSave }: WorkItemStepProps) {
  const { t } = useTranslation()
  const tripEntity = new TripEntity(t)

  function startTrip(trip: Trip) {
    tripEntity.setData(trip).goToNextStatus().save().then(afterSave)
  }

  return (
    <StepCard trip={trip} title={title}>
      <Button fullWidth size='large' variant='tonal' onClick={() => startTrip(trip)}>
        Iniciar corrida
      </Button>
    </StepCard>
  )
}
