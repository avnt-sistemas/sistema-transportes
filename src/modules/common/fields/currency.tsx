//@ts-nocheck

import { useTranslation } from 'react-i18next'
import { CurrencyInput } from 'react-currency-mask'
import CustomTextField from 'src/@core/components/mui/text-field'
import { prepareErrorMessage } from 'src/@core/utils/errors'
import FieldProps, { prepareLabel } from './interfaces/fieldProps'

export default function CurrencyField({
  field: { value, onChange, name },
  fieldState,
  label,
  translateLabel = false,
  required = false,
  beforeChange,
  afterChange,
  setValue
}: FieldProps) {
  const { t } = useTranslation()

  label = prepareLabel(t, name, label, translateLabel)

  return (
    <CurrencyInput
      value={value}
      onChangeValue={(event, value) => {
        if (beforeChange) beforeChange(fieldState, setValue!, value)
        onChange(value)
        if (afterChange) afterChange(fieldState, setValue!, value)
      }}
      InputElement={
        <CustomTextField
          label={label}
          required={required}
          id={name}
          fullWidth
          value={value}
          error={Boolean(fieldState.error!)}
          {...(fieldState.error && {
            helperText: prepareErrorMessage(name, label, fieldState.error!.message as string)
          })}
        />
      }
    />
  )
}
