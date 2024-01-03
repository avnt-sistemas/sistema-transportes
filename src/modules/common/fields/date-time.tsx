import DatePicker, { registerLocale } from 'react-datepicker'
import { Ref, forwardRef } from 'react'
import br from 'date-fns/locale/pt-BR'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Box } from '@mui/system'
import FieldProps, { prepareLabel } from './interfaces/fieldProps'
import { prepareErrorMessage } from 'src/@core/utils/errors'
import { useTranslation } from 'react-i18next'
import { Timestamp } from 'firebase/firestore/lite'
import { timestampToDate } from 'src/@core/utils/format'

interface PickerProps {
  label: string
  value: any
}

export type DateType = Date | null | undefined

interface DateTimePickerProps extends FieldProps {
  hideTime?: boolean
  onlyTime?: boolean
}

const DateTimePicker = ({
  field: { value, onChange, name },
  fieldState,
  label,
  translateLabel = false,
  required = false,
  hideTime = false,
  onlyTime = false,
  beforeChange,
  afterChange,
  setValue,
  onBlur
}: DateTimePickerProps) => {
  const { t } = useTranslation()

  registerLocale('pt-BR', br)

  label = prepareLabel(t, name, label, translateLabel)

  const formatDate = hideTime ? 'dd/MM/yyyy' : onlyTime ? 'H:i' : 'dd/MM/yyyy h:mm aa'

  if (value instanceof Timestamp) value = timestampToDate(value)

  const CustomInput = forwardRef((props: PickerProps, ref: Ref<any>) => {
    const d = props.value

    return (
      <CustomTextField
        {...props}
        fullWidth
        inputRef={ref}
        required={required}
        label={props.label}
        value={d}
        error={fieldState && Boolean(fieldState.error!)}
        {...(fieldState &&
          fieldState.error && {
            helperText: prepareErrorMessage(name, label!, fieldState.error!.message as string)
          })}
      />
    )
  })

  return (
    <Box sx={{ width: '100%' }}>
      <DatePickerWrapper>
        <Box sx={{ width: '100%' }}>
          <DatePicker
            locale='pt-BR'
            selected={value as DateType}
            showTimeSelect={!hideTime}
            showTimeSelectOnly={onlyTime}
            timeIntervals={15}
            monthsShown={1}
            dateFormat={formatDate}
            id='date-time-picker'
            onChange={event => {
              if (beforeChange) beforeChange(fieldState || null, setValue!, event)
              onChange(event)
              if (afterChange) afterChange(fieldState || null, setValue!, event)
            }}
            onBlur={params => {
              if (onBlur) onBlur(params, setValue!)
            }}
            customInput={<CustomInput label={label} value={value as Date | number} />}
          />
        </Box>
      </DatePickerWrapper>
    </Box>
  )
}

export default DateTimePicker
