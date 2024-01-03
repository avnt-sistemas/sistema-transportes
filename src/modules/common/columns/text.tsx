import { GridColDef } from '@mui/x-data-grid'
import { BaseColumnProps } from './interfaces/base-column-props'
import { prepareLabel } from '../fields/interfaces/fieldProps'

export default function TextColumn(props: BaseColumnProps): GridColDef {
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
    renderCell: ({ row }) => (props.formatValue ? props.formatValue(row) : row[props.name])
  }
}
