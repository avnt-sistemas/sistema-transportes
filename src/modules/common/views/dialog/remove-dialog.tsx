import { capitalize } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ConfirmDialog from 'src/components/dialogs/confirm-dialog'

export interface RemoveDialogProps {
  opened: boolean
  handleToggle: () => void
  handleDelete: () => void
}

const RemoveDialog = ({ opened, handleToggle, handleDelete }: RemoveDialogProps) => {
  const { t } = useTranslation()

  return (
    <ConfirmDialog
      opened={opened}
      confirmColor='error'
      confirmText={capitalize(t('remove'))}
      handleConfirm={handleDelete}
      handleToggle={handleToggle}
      icon='jam:alert-f'
      iconColor='#BD0000'
      message={t('remove_message')}
      title={t('alert')}
    />
  )
}

export default RemoveDialog
