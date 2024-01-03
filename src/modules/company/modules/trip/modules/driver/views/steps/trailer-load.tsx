import { Button, Divider, Grid } from '@mui/material'
import Trip from '../../../../interfaces/trip'
import { StepCard } from './components/step-card'

export interface TrailerLoadStepProps {
  trip: Trip
}
export default function TrailerLoadStep({ trip }: TrailerLoadStepProps) {
  return (
    <StepCard trip={trip}>
      <Grid spacing={2} container mt={6}>
        <Grid item xs={12}>
          <Button fullWidth variant='tonal' color='info'>
            Informar Quilometragem(KM) atual do Caminhão
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant='tonal' color='info'>
            Informar Nota fiscal da carga
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant='tonal' color='error'>
            Realizar pausa
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant='tonal' color='primary'>
            Carga carregada! Seguir viagem
          </Button>
        </Grid>
      </Grid>
    </StepCard>
  )
}
