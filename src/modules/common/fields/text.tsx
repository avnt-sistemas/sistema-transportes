import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { prepareErrorMessage } from 'src/@core/utils/errors'
import FieldProps, { prepareLabel } from './interfaces/fieldProps'

export default function TextField({
  field: { value, onChange, name },
  fieldState,
  label,
  type,
  required = false,
  translateLabel = false,
  beforeChange,
  afterChange,
  setValue,
  onBlur
}: FieldProps) {
  const { t } = useTranslation()

  label = prepareLabel(t, name, label, translateLabel)

  return type !== 'hidden' ? (
    <CustomTextField
      fullWidth
      required={required}
      value={value}
      label={label}
      type={type}
      onChange={event => {
        if (beforeChange) beforeChange(fieldState || null, setValue!, event)
        onChange(event)
        if (afterChange) afterChange(fieldState || null, setValue!, event)
      }}
      onBlur={params => {
        if (onBlur) onBlur(params, setValue!)
      }}
      error={fieldState && Boolean(fieldState.error!)}
      {...(fieldState &&
        fieldState.error && {
          helperText: prepareErrorMessage(name, label, fieldState.error!.message as string)
        })}
    />
  ) : (
    <input type='hidden' value={value} />
  )
}
