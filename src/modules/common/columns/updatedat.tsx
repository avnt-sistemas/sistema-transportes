import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { GridColDef } from '@mui/x-data-grid'
import { Timestamp } from 'firebase/firestore/lite'
import { TFunction } from 'i18next'
import { ReactNode } from 'react'
import { timestampToDate } from 'src/@core/utils/format'

export interface TextColumnProps {
  t: TFunction<'translation', undefined, 'translation'>
  headerName?: string
  flex?: number
  width?: number
  minWidth?: number
  maxWidth?: number
  hiddenTime?: boolean
  formatValue?: (row: any) => ReactNode | string
}

export default function UpdatedAtColumn(props: TextColumnProps): GridColDef {
  if (!props.headerName) props.headerName = props.t('last_update') as unknown as string
  if (props.width) {
    props.minWidth = props.width
    props.maxWidth = props.width
  }

  return {
    flex: props.flex || 0.1,
    field: 'updated_at',
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,
    headerName: props.headerName,
    renderCell: ({ row }) => {
      const updated_at = (
        row.updated_at instanceof Timestamp ? timestampToDate(row.updated_at) : row.updated_at
      ).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      const created_at = (
        row.created_at instanceof Timestamp ? timestampToDate(row.created_at) : row.created_at
      ).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {updated_at !== created_at ? (
              <>
                <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {updated_at}
                </Typography>
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {props.t('fields.created_at')}: {created_at}
                </Typography>
              </>
            ) : (
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {created_at}
              </Typography>
            )}
          </Box>
        </Box>
      )
    }
  }
}
