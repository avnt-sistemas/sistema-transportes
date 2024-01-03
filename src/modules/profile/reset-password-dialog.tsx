import { Dialog, DialogContent, DialogTitle, IconButton, IconButtonProps } from '@mui/material'
import ResetPasswordForm from './reset-password-form'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

export interface ResetPasswordDialogProps {
  opened: boolean
  onClose: () => void
}

export default function ResetPasswordDialog({ opened, onClose }: ResetPasswordDialogProps) {
  return (
    <Dialog open={opened} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogTitle sx={{ alignItems: 'center', alignContent: 'center', display: 'flex', marginBottom: 1 }}>
        Mudar senha
        <CustomCloseButton aria-label='close' onClick={() => onClose()}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
      </DialogTitle>
      <DialogContent>
        <ResetPasswordForm />
      </DialogContent>
    </Dialog>
  )
}
