import React from 'react'
import { useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog'
import { Icon } from '@iconify/react'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { capitalize } from '@mui/material'
import Typography from '@mui/material/Typography'

export interface DialogProps {
  opened: boolean
  message: string
  title: string
  icon: string
  confirmText: string
  confirmColor: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  iconColor: string
  canCancel?: boolean
  handleToggle: () => void
  handleConfirm: () => void
}

const ConfirmDialog = ({
  opened,
  handleToggle,
  handleConfirm,
  message,
  title,
  icon,
  confirmColor,
  confirmText,
  iconColor,
  canCancel = true
}: DialogProps) => {
  const { t } = useTranslation()

  return (
    <Dialog
      open={opened}
      disableEscapeKeyDown
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleToggle()
        }
      }}
    >
      <DialogTitle
        id='alert-dialog-title'
        sx={{ alignItems: 'center', alignContent: 'center', display: 'flex', marginBottom: 1 }}
      >
        <Icon color={iconColor} icon={icon} fontSize={25} />{' '}
        <Typography sx={{ ml: 2 }}>
          <b>{title}</b>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          <span dangerouslySetInnerHTML={{ __html: message }}></span>
        </DialogContentText>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        {canCancel ? (
          <Button color='secondary' onClick={handleToggle}>
            {capitalize(t('cancel'))}
          </Button>
        ) : null}
        <Button color={confirmColor} onClick={() => handleConfirm()}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
