//@ts-nocheck

import { useTranslation } from 'react-i18next'
import ReactInputMask, { Props } from 'react-input-mask'
import CustomTextField from 'src/@core/components/mui/text-field'
import { prepareErrorMessage } from 'src/@core/utils/errors'
import FieldProps, { prepareLabel } from './interfaces/fieldProps'
import { FocusEvent } from 'react'
import { clearString } from 'src/@core/utils/format'

export interface MaskedFieldProps extends FieldProps {
  mask: string
  saveMasked?: boolean
}

export default function MaskedField({
  field: { value, onChange, name },
  fieldState,
  mask,
  label,
  translateLabel = false,
  required = false,
  saveMasked = false,
  beforeChange,
  afterChange,
  setValue,
  onBlur
}: MaskedFieldProps) {
  const { t } = useTranslation()

  function InputMaskChildren(inputProps: Props) {
    label = prepareLabel(t, name, label, translateLabel)

    return (
      <CustomTextField
        {...(inputProps as unknown as any)}
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
    )
  }

  return (
    <ReactInputMask
      mask={mask}
      value={value}
      disabled={false}
      maskChar=' '
      onChange={(event: any) => {
        if (beforeChange) beforeChange(fieldState, setValue!, event)
        onChange(event)
        if (afterChange) afterChange(fieldState, setValue!, event)
      }}
      onBlur={(params: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
        setValue(name, saveMasked ? clearString(params.target.value) : params.target.value)
        if (onBlur) onBlur(params, setValue!)
      }}
    >
      {InputMaskChildren}
    </ReactInputMask>
  )
}
