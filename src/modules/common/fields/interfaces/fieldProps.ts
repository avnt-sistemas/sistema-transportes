import { InputProps, capitalize } from '@mui/material'
import { TFunction } from 'i18next'
import { FocusEvent } from 'react'
import { ControllerFieldState, ControllerRenderProps, UseFormSetValue } from 'react-hook-form'

export interface UncontrolledFieldProps {
  onChange: (...event: any[]) => void
  value: any
  name: string
}

export default interface FieldProps extends InputProps {
  field: ControllerRenderProps<any, any> | UncontrolledFieldProps
  fieldState?: ControllerFieldState
  label?: string
  translateLabel?: boolean
  type?: React.InputHTMLAttributes<unknown>['type']
  required?: boolean
  setValue?: UseFormSetValue<any>
  beforeChange?: (fieldState: ControllerFieldState | null, setValue?: UseFormSetValue<any>, ...event: any[]) => boolean
  afterChange?: (fieldState: ControllerFieldState | null, setValue?: UseFormSetValue<any>, ...event: any[]) => void
  onBlur?: (
    params: FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>,
    setValue?: UseFormSetValue<any>
  ) => void
}

export function prepareLabel(
  t: TFunction<'translation', undefined, 'translation'>,
  name: string,
  label?: string,
  translateLabel?: boolean
): string {
  if (!label) label = capitalize(t('fields.' + name))
  else if (translateLabel) label = capitalize(t(label))

  return label
}
