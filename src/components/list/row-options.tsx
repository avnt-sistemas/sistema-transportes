import IconButton from '@mui/material/IconButton'
import { capitalize } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Icon from '../../@core/components/icon'
import { FC, ReactNode } from 'react'

export interface RowOptionsProps {
  onView?: () => void
  onEdit?: () => void
  onRemove?: () => void
  children?: ReactNode
}

const RowOptions: FC<RowOptionsProps> = ({ onView, onEdit, onRemove, children }: RowOptionsProps) => {
  const { t } = useTranslation()

  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // const rowOptionsOpen = Boolean(anchorEl)

  // const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget)
  // }

  // const handleRowOptionsClose = () => {
  //   setAnchorEl(null)
  // }

  const handleDelete = () => {
    if (onRemove) onRemove!()

    // handleRowOptionsClose()
  }

  const handleEdit = () => {
    if (onEdit) onEdit!()

    // handleRowOptionsClose()
  }

  const handleView = () => {
    if (onView) onView!()

    // handleRowOptionsClose()
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', width: '100%' }}>
      {children}

      {onView && (
        <Tooltip title={`${capitalize(t('view'))}`}>
          <IconButton onClick={handleView}>
            <Icon icon='tabler:eye' fontSize={20} />
          </IconButton>
        </Tooltip>
      )}

      {onEdit && (
        <Tooltip title={`${capitalize(t('update'))}`}>
          <IconButton onClick={handleEdit}>
            <Icon icon='tabler:edit' fontSize={20} />
          </IconButton>
        </Tooltip>
      )}

      {onRemove && (
        <Tooltip title={capitalize(t('delete'))}>
          <IconButton color='error' onClick={handleDelete}>
            <Icon icon='tabler:trash' fontSize={20} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

export default RowOptions
