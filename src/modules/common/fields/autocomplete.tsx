import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { prepareErrorMessage } from 'src/@core/utils/errors'
import FieldProps, { prepareLabel } from './interfaces/fieldProps'
import IconifyIcon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'

export interface AutocompleteFieldProps extends FieldProps {
  options: any[]
  limitTags?: number
  translateLabel?: boolean
  multiple?: boolean
  disableClearable?: boolean
  max?: number
  title: string
  subtitle?: string
  icon?: string
  valueTag?: string
  customChange?: (value: any) => void
}

export default function AutocompleteField<T>({
  field: { value, onChange, name },
  fieldState,
  label,
  options,
  limitTags,
  multiple = false,
  translateLabel = false,
  max,
  title,
  subtitle,
  icon,
  valueTag,
  customChange,
  disableClearable = false
}: AutocompleteFieldProps) {
  const theme = useTheme()
  const { t } = useTranslation()
  const [_value, setValue] = useState<T | T[] | null>(multiple ? [] : null)

  label = prepareLabel(t, name, label, translateLabel)

  const filterOptions = (options: T[], { inputValue }: { inputValue: string }) => {
    return options.filter((option: any) => {
      return Object.values(option).some(field =>
        typeof field === 'string' ? field.toLowerCase().includes(inputValue.toLowerCase()) : false
      )
    })
  }

  useEffect(() => {
    if (options.length === 0) return

    if (!value) setValue(multiple ? [] : null)
    else if (!valueTag) setValue(value)
    else if (multiple) setValue(options.filter(m => (value as string[]).includes((m as any)[valueTag])) as T[])
    else setValue((options.find((m: any) => m[valueTag] === (value as string)) as T) || null)
  }, [valueTag, multiple, value, options])

  return (
    <CustomAutocomplete
      autoHighlight
      fullWidth
      disableClearable={disableClearable}
      filterOptions={filterOptions}
      options={options}
      value={_value}
      limitTags={limitTags}
      onChange={(event, val) => {
        if (!multiple) onChange(valueTag && val ? (val as any)[valueTag] : val)
        else {
          const _v = val as any[]
          if (!max || _v.length <= max) onChange(valueTag && _v ? _v.map((i: any) => i[valueTag]) : _v)
          else toast.error(t('max_count'))
        }

        if (customChange) customChange(val)
      }}
      multiple={multiple}
      getOptionLabel={option => (option as any)[title] || ''}
      renderInput={params => (
        <CustomTextField
          {...params}
          label={label}
          error={Boolean(fieldState && fieldState.error!)}
          {...(fieldState &&
            fieldState.error && {
              helperText: prepareErrorMessage(name, label!, fieldState.error.message as string)
            })}
        />
      )}
      renderOption={(props, value) => (
        <ListItem {...props}>
          <ListItemIcon>
            {icon ? (
              typeof (value as any)[icon] === 'string' ? (
                <IconifyIcon
                  icon={(value as any)[icon]}
                  color={value === _value ? 'white' : theme.palette.primary.light}
                />
              ) : (
                (value as any)[icon]
              )
            ) : (
              <IconifyIcon
                icon='ph:dot-outline-duotone'
                color={value === _value ? 'white' : theme.palette.primary.light}
              />
            )}
          </ListItemIcon>
          <ListItemText
            sx={{ m: 0 }}
            primary={(value as any)[title]}
            secondary={subtitle && (value as any)[subtitle]}
          />
        </ListItem>
      )}
    />
  )
}
