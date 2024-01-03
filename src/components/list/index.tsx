import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import { DataGrid, GridColDef, GridSortModel, ptBR } from '@mui/x-data-grid'
import { GridRowsProp } from '@mui/x-data-grid/models/gridRows'
import { useEffect, useState } from 'react'
import TableHeader from './table-header'
import { Button, Card } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Entity from 'src/modules/common/interfaces/entity'
import RowOptions from './row-options'
import RemoveDialog from 'src/modules/common/views/dialog/remove-dialog'
import IconifyIcon from 'src/@core/components/icon'
import { Timestamp } from 'firebase/firestore/lite'
import { timestampToDate } from 'src/@core/utils/format'

export interface ListProps {
  title?: string

  data: GridRowsProp<any>
  columns: GridColDef[]
  filters?: any

  searchTerms?: string
  handleSearch?: (terms: string) => void

  pageSizeOptions?: number[]
  hideActionColumn?: boolean

  model?: Entity<any>

  handleCreate?: () => void
  afterUpdate?: () => void
  afterRemove?: () => void
  paginationModel?: { page?: number; pageSize?: number }
  sortModel?: GridSortModel
  addButtonText?: string
  checkboxSelection?: boolean
  disableRowSelectionOnClick?: boolean
}

const List = ({
  title,
  filters,
  data,
  columns,
  pageSizeOptions,
  addButtonText,
  checkboxSelection,
  disableRowSelectionOnClick,
  sortModel,
  paginationModel,
  hideActionColumn = false,
  model,
  handleCreate,
  afterUpdate,
  afterRemove,
  searchTerms,
  handleSearch
}: ListProps) => {
  const [_paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [_data, setData] = useState<GridRowsProp<any>>(data)
  const [_columns, setColumns] = useState<GridColDef[]>(columns)
  const [_searchTerms, setSearchTerms] = useState<string>(searchTerms || '')
  const [confirmRemoveOpened, setConfirmRemoveOpened] = useState<boolean>(false)

  const { t } = useTranslation()

  useEffect(() => {
    if (paginationModel) setPaginationModel(Object.assign({}, _paginationModel, paginationModel))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel])

  useEffect(() => {
    if (searchTerms) setSearchTerms(searchTerms)
  }, [searchTerms])

  useEffect(() => {
    setData(data || [])
  }, [data])

  useEffect(() => {
    if (columns) updateColumns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])

  function handleRemove(record: any) {
    if (!model) return

    model.setData(record)
    setConfirmRemoveOpened(true)
  }

  function onRemove() {
    if (!model) return

    model.delete()
    setConfirmRemoveOpened(false)
    if (afterRemove) afterRemove!()
  }

  function handleEdit(record: any) {
    if (!model) return
    model.clear()
    model.setData(record)
    if (afterUpdate) afterUpdate!()
  }

  function updateColumns() {
    const cols = [...columns]
    if (model && !hideActionColumn) {
      const actionColumn: GridColDef = {
        flex: 0.1,
        minWidth: 100,
        maxWidth: 100,
        sortable: false,
        hideable: false,
        field: 'actions',
        headerName: '',
        headerAlign: 'right',
        renderCell: ({ row }: { row: any }) => (
          <RowOptions onEdit={() => handleEdit(row)} onRemove={() => handleRemove(row)}></RowOptions>
        )
      }
      cols.push(actionColumn)
    }
    setColumns(cols)
  }

  const defaultSearch = (terms?: string) => {
    setSearchTerms(terms!)
    if (terms!.length > 1) {
      setData(
        data.filter((record: any) => {
          const fields = Object.keys(record)

          return Object.values(record).some((fieldValue, i) => {
            if (fieldValue instanceof Timestamp) {
              fieldValue = timestampToDate(fieldValue)
            }
            if (fieldValue instanceof Date) {
              fieldValue = fieldValue.toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })
            }

            return (
              (typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(terms!.toLowerCase())) ||
              t(`values.${fields[i]}.${fieldValue}`).toLowerCase().includes(terms!.toLowerCase())
            )
          })
        })
      )
    } else setData(data)
  }

  useEffect(() => {
    if (model && !hideActionColumn) {
      updateColumns()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, hideActionColumn])

  function NoRowsOverlay() {
    return (
      <Grid container spacing={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Grid item>
          <Button fullWidth onClick={handleCreate} variant='tonal' color='info' sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon fontSize='1.125rem' icon='octicon:plus-16' />
            {t('no_records_button_text')}
          </Button>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            title={title || ''}
            value={_searchTerms}
            handleFilter={handleSearch || defaultSearch}
            addButtonText={addButtonText}
            onAddClick={handleCreate}
          />

          {filters ? (
            <CardContent>
              {filters}
              <Divider sx={{ m: '0 !important' }} />
            </CardContent>
          ) : null}

          <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            autoHeight
            rowHeight={62}
            rows={_data}
            rowSelection={false}
            columns={_columns}
            sortModel={sortModel}
            checkboxSelection={!!checkboxSelection}
            disableRowSelectionOnClick={!!disableRowSelectionOnClick}
            pageSizeOptions={pageSizeOptions || [10, 25, 50]}
            paginationModel={_paginationModel}
            onPaginationModelChange={setPaginationModel}
            slots={{
              noRowsOverlay: handleCreate ? NoRowsOverlay : undefined
            }}
          />
        </Card>
      </Grid>
      <RemoveDialog
        handleDelete={onRemove}
        opened={confirmRemoveOpened}
        handleToggle={() => setConfirmRemoveOpened(false)}
      />
    </Grid>
  )
}

export default List
