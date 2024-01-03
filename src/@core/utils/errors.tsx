import { capitalize } from '@mui/material'
import Typography from '@mui/material/Typography'

export const prepareErrorMessage = (field: string, translatedField: string, message: string): React.ReactNode => (
  <Typography
    variant='body2'
    color='error'
    dangerouslySetInnerHTML={{ __html: message.replaceAll(field, `<b>${capitalize(translatedField)}</b>`) + '!' }}
  />
)
