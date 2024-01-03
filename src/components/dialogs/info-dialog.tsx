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
import { Breakpoint, Typography } from '@mui/material'

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
  maxWidth?: Breakpoint | false
  iconSize?: number
  title?: string
  message: ReactNode | string
  opened: boolean
  onClose: () => void
}
const InfoDialog = ({ icon, title, message, opened, iconSize = 20, maxWidth = 'lg', onClose }: Props) => (
  <Dialog
    fullWidth
    maxWidth={maxWidth}
    scroll='body'
    open={opened}
    keepMounted
    onClose={onClose}
    TransitionComponent={Transition}
    aria-labelledby='info-dialog-slide-title'
    aria-describedby='info-dialog-slide-description'
    sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
  >
    <DialogTitle
      id='info-dialog-slide-title'
      sx={{ alignItems: 'center', alignContent: 'center', display: 'flex', marginBottom: 1 }}
    >
      {icon && icon.length > 0 ? <Icon color='primary' icon={icon} fontSize={iconSize} /> : null}
      {title && title.length > 0 ? <Typography sx={{ ml: 2 }}>{title}</Typography> : null}
      <CustomCloseButton aria-label='close' onClick={() => onClose()}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
    </DialogTitle>
    <DialogContent>
      <DialogContentText id='info-dialog-slide-description'>
        {typeof message === 'string' ? <div dangerouslySetInnerHTML={{ __html: message as string }}></div> : message}
      </DialogContentText>
    </DialogContent>
  </Dialog>
)

export default InfoDialog
