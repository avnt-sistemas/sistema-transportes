// ** React Imports
import { forwardRef, ReactElement, ReactNode, Ref } from 'react'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Slide, { SlideProps } from '@mui/material/Slide'
import DialogContentText from '@mui/material/DialogContentText'

import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { Typography } from '@mui/material'

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

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

interface Props {
  icon?: string
  iconSize?: number
  title?: string
  message: ReactNode
  opened: boolean
  onClose: () => void
}
const AlertDialog = ({ icon, title, message, opened, iconSize = 20, onClose }: Props) => (
  <Dialog
    open={opened}
    keepMounted
    onClose={onClose}
    TransitionComponent={Transition}
    aria-labelledby='alert-dialog-slide-title'
    aria-describedby='alert-dialog-slide-description'
    sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
  >
    <DialogTitle
      id='alert-dialog-slide-title'
      sx={{ alignItems: 'center', alignContent: 'center', display: 'flex', marginBottom: 1 }}
    >
      {icon && icon.length > 0 ? <Icon color='primary' icon={icon} fontSize={iconSize} /> : null}
      {title && title.length > 0 ? <Typography sx={{ ml: 2 }}>{title}</Typography> : null}
      <CustomCloseButton aria-label='close' onClick={() => onClose()}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
    </DialogTitle>
    <DialogContent>
      <DialogContentText id='alert-dialog-slide-description'>{message}</DialogContentText>
    </DialogContent>
  </Dialog>
)

export default AlertDialog
