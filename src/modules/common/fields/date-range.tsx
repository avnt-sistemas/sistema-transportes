import format from 'date-fns/format'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Ref, forwardRef, useEffect, useState } from 'react'
import { Locale } from 'date-fns'
import br from 'date-fns/locale/pt-BR'
import en from 'date-fns/locale/en-US'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Box } from '@mui/system'
import FieldProps, { prepareLabel } from './interfaces/fieldProps'
import { timestampToDate } from 'src/@core/utils/format'
import { Timestamp } from 'firebase/firestore/lite'

const langObj: { [key: string]: Locale } = { br, en }

interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
}

export type DateType = Date | null | undefined

interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
}

export interface DateRangePickerProps extends FieldProps {
  startDate: DateType
  endDate: DateType
  handleOnChange: (dates: any) => void
}

const DateRangePicker = ({
  field: { name },
  label,
  translateLabel = false,
  startDate,
  endDate,
  handleOnChange
}: DateRangePickerProps) => {
  const { i18n, t } = useTranslation()

  const [dateFormat, setDateFormat] = useState<string>('MM/dd/yyyy')

  label = prepareLabel(t, name, label, translateLabel)

  if (startDate instanceof Timestamp) startDate = timestampToDate(startDate)
  if (endDate instanceof Timestamp) endDate = timestampToDate(endDate)

  useEffect(() => {
    switch (i18n.language) {
      case 'pt-BR':
        registerLocale(i18n.language, br)
        setDateFormat('dd/MM/yyyy')
        break
      default:
        registerLocale(i18n.language, langObj[i18n.language])
    }
  }, [i18n.language])

  const CustomInput = forwardRef((props: PickerProps, ref: Ref<any>) => {
    const startDate = props.start !== null ? format(props.start, dateFormat) : ''
    const endDate = props.end !== null ? ` - ${format(props.end, dateFormat)}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    //@ts-ignore
    props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null

    //@ts-ignore
    const updatedProps = { ...props }

    //@ts-ignore
    delete updatedProps.setDates

    return <CustomTextField fullWidth inputRef={ref} {...updatedProps} label={props.label!} value={value} />
  })

  return (
    <Box sx={{ width: '100%' }}>
      <DatePickerWrapper>
        <Box sx={{ width: '100%' }}>
          <DatePicker
            locale={i18n.language}
            selectsRange
            monthsShown={2}
            endDate={endDate}
            selected={startDate}
            startDate={startDate}
            id='date-range-picker'
            onChange={handleOnChange}
            customInput={
              <CustomInput label={label} start={startDate as Date | number} end={endDate as Date | number} />
            }
          />
        </Box>
      </DatePickerWrapper>
    </Box>
  )
}

export default DateRangePicker
