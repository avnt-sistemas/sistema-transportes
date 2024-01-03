import { useTranslation } from 'react-i18next'
import FieldProps, { prepareLabel } from './interfaces/fieldProps'
import TextField from './text'
import MaskedField from './masked'
import { Grid, capitalize } from '@mui/material'
import AutocompleteField from './autocomplete'
import { useState } from 'react'

export interface TypeFieldProps<T> extends FieldProps {
  options: any[]
  title: string
  valueTag: string
  canOtherValue?: boolean
  otherValue?: T
  typeFieldName?: string
  getMaskByType: (type: T) => string
}

export default function TypeField<T>(props: TypeFieldProps<T>) {
  const { t } = useTranslation()
  const label = prepareLabel(t, props.field.name, props.label, props.translateLabel)
  const { canOtherValue = true, otherValue = 'other', typeFieldName = 'type' } = props

  const getValueOfType = (type: string): T => {
    try {
      return type as unknown as T
    } catch (err) {
      return otherValue as unknown as T
    }
  }

  const [type, setType] = useState<T | undefined>(getValueOfType(props.field.value))
  const [typeValue, setTypeValue] = useState<string>(props.field.value)

  return (
    <Grid container spacing={6} sx={{ pl: 6, pt: 6 }}>
      <Grid sx={{ mb: 4 }} xs={12}>
        <AutocompleteField
          field={{
            name: typeFieldName,
            value: type ? (props.options.find(o => o.type === type) ? type : otherValue) : type,
            onChange: value => {
              setType(getValueOfType(value))
              props.setValue!(props.field.name, '')
              props.setValue!(typeFieldName, value)
            }
          }}
          options={props.options}
          title={props.title}
          valueTag={props.valueTag}
        />
      </Grid>
      {canOtherValue && type === 'other' && (
        <Grid xs={12} sx={{ mb: 4 }}>
          <TextField
            field={{
              name: typeFieldName,
              value: typeValue,
              onChange: event => {
                setTypeValue(capitalize(event.target.value))
                props.setValue!(typeFieldName, event.target.value)
              }
            }}
            label={capitalize(t('other_value_type'))}
            value={typeValue}
          />
        </Grid>
      )}
      {type !== undefined && (
        <Grid xs={12}>
          {props.getMaskByType(type) !== '' ? (
            <MaskedField {...props} label={label} mask={props.getMaskByType(type)} />
          ) : (
            <TextField {...props} label={label} />
          )}
        </Grid>
      )}
    </Grid>
  )
}
