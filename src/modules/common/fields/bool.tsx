import { FormControlLabel, Switch } from '@mui/material'
import { useTranslation } from 'react-i18next'
import FieldProps, { prepareLabel } from './interfaces/fieldProps'

export default function BoolField({ field: { value, onChange, name }, label, translateLabel = false }: FieldProps) {
  const { t } = useTranslation()

  label = prepareLabel(t, name, label, translateLabel)

  return <FormControlLabel label={label} control={<Switch checked={value} onChange={onChange} />} />
}
