import { GridColDef } from '@mui/x-data-grid'
import { timestampToDate } from 'src/@core/utils/format'
import { BaseColumnProps } from './interfaces/base-column-props'
import { prepareLabel } from '../fields/interfaces/fieldProps'
import { Timestamp } from 'firebase/firestore/lite'

export interface DatetimeColumnProps extends BaseColumnProps {
  hiddenTime?: boolean
}

export default function DatetimeColumn(props: DatetimeColumnProps): GridColDef {
  props.headerName = prepareLabel(props.t, props.name, props.headerName, props.translateHeaderName)
  if (props.width) {
    props.minWidth = props.width
    props.maxWidth = props.width
  }

  return {
    flex: props.flex || 0.1,
    field: props.name,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,
    headerName: props.headerName,
    renderCell: ({ row }) => {
      if (!row[props.name]) return ''

      const date = row[props.name] instanceof Timestamp ? timestampToDate(row[props.name]) : (row[props.name] as Date)

      return !props.hiddenTime
        ? date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        : date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
    }
  }
}
