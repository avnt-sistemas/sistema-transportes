import { TFunction } from 'i18next'
import { ReactNode } from 'react'

export interface BaseColumnProps {
  t: TFunction<'translation', undefined, 'translation'>
  name: string
  headerName?: string
  translateHeaderName?: boolean
  flex?: number
  width?: number
  minWidth?: number
  maxWidth?: number
  formatValue?: (row: any) => ReactNode | string
}
