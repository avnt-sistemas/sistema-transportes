import { Chip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { BaseColumnProps } from './interfaces/base-column-props'
import { prepareLabel } from '../fields/interfaces/fieldProps'

export default function BoolColumn(props: BaseColumnProps): GridColDef {
  props.headerName = prepareLabel(props.t, props.name, props.headerName, props.translateHeaderName)
  if (props.width) {
    props.minWidth = props.width
    props.maxWidth = props.width
  } else if (!props.maxWidth && !props.minWidth) {
    props.minWidth = 120
    props.maxWidth = 120
  }

  return {
    flex: props.flex || 0.1,
    field: props.name,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,
    headerName: props.headerName,
    renderCell: ({ row }) => (
      <Chip
        size='small'
        label={row[props.name] ? props.t('switch.on') : props.t('switch.off')}
        color={row[props.name] ? 'success' : 'secondary'}
        sx={{
          mr: 2,
          height: 22,
          minWidth: 22,
          '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
        }}
      />
    )
  }
}
