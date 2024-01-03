// ** MUI Imports
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GridColDef } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import List, { ListProps } from 'src/components/list'
import UpdateModelDialog from './dialog/form-dialog'
import RowOptions from 'src/components/list/row-options'
import RemoveDialog from './dialog/remove-dialog'
import UpdatedAtColumn from '../columns/updatedat'
import { capitalize } from '@mui/material'
import BaseEntity from '../entities/base-entity'

function ModelList({ model }: { model: BaseEntity }) {
  const { t } = useTranslation()

  // States
  const [data, setData] = useState<any[]>([])
  const [_columns, setColumns] = useState<GridColDef[]>([])
  const [formOpened, setFormOpened] = useState<boolean>(false)
  const [removeDialogOpened, setRemoveDialogOpened] = useState<boolean>(false)
  const [fetched, setFetched] = useState<boolean>(false)

  useEffect(() => {
    if (!fetched) {
      setFetched(true)
      const promise = model.fetch()

      if (promise instanceof Promise) {
        promise.then(resp => setData(resp))

        toast.promise(promise, {
          loading: t('promise.fetch.loading'),
          success: t('promise.fetch.success'),
          error: t('promise.fetch.error')
        })
      } else {
        setData(promise)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])

  function afterSave(updated: any) {
    setFormOpened(false)
    const _ = [...data]
    const index = _.findIndex(r => r.id === updated.id)
    if (index < 0) _.push(updated)
    else _[index] = updated
    setData(_)
  }

  function formClose() {
    setFormOpened(false)
  }

  async function onRemove() {
    const _ = [...data]
    const index = _.findIndex(r => r.id === model.id)
    const removed = await model.delete()
    if (removed && index >= 0) _.splice(index, 1)
    setData(_)
    setRemoveDialogOpened(false)
  }

  function handleCreate() {
    model.clear()
    setFormOpened(true)
  }

  function handleEdit(record: any) {
    model.setData(record)
    setFormOpened(true)
  }

  function handleRemove(record: any) {
    model.setData(record)
    setRemoveDialogOpened(true)
  }

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

  useEffect(() => {
    const cols = model.columns()
    if (cols instanceof Promise) {
      cols.then(resp => setColumns([...resp, UpdatedAtColumn({ t }), actionColumn]))
    } else {
      setColumns([...cols, UpdatedAtColumn({ t }), actionColumn])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])

  const props: ListProps = {
    title: model.title('list'),
    checkboxSelection: false,
    columns: _columns,
    data: data,
    disableRowSelectionOnClick: false,
    handleCreate,
    addButtonText: capitalize(t('new'))
  }

  return (
    <>
      <List {...props} />
      <UpdateModelDialog
        model={model}
        width={model.modalWidth}
        opened={formOpened}
        onClose={formClose}
        afterSave={afterSave}
      />
      <RemoveDialog
        opened={removeDialogOpened}
        handleToggle={() => setRemoveDialogOpened(false)}
        handleDelete={onRemove}
      />
    </>
  )
}

export default ModelList
