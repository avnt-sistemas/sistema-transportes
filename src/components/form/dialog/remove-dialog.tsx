import React from 'react'
import { useTranslation } from 'react-i18next'
import { capitalize } from '@mui/material'
import ConfirmDialog from 'src/components/dialogs/confirm-dialog'

export interface RemoveDialogProps {
  opened: boolean
  module: string
  registerName: string
  handleToggle: () => void
  handleDelete: () => void
}

const RemoveDialog = ({ opened, handleToggle, handleDelete, module, registerName }: RemoveDialogProps) => {
  const { t } = useTranslation()

  return (
    <ConfirmDialog
      opened={opened}
      confirmColor='error'
      confirmText={capitalize(t('delete'))}
      handleConfirm={handleDelete}
      handleToggle={handleToggle}
      icon='jam:alert-f'
      iconColor='#BD0000'
      message={`${capitalize(t('canRemove'))} ${module} <b>"${registerName}"</b>?`}
      title={t('alert')}
    />
  )
}

export default RemoveDialog
