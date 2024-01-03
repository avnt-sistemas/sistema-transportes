// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from '../../@core/components/mui/text-field'

// ** Icon Imports
import Icon from '../../@core/components/icon'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'

interface TableHeaderProps {
  title: string
  value: string
  addButtonText?: string
  onAddClick?: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { title, handleFilter, onAddClick, value, addButtonText } = props
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Grid container spacing={6}>
        {title.length > 0 && (
          <Grid item xs={12} md={onAddClick ? 3 : 6} lg={onAddClick ? 3 : 3} sx={{ alignSelf: 'center' }}>
            <Typography variant='h5'>{title}</Typography>
          </Grid>
        )}

        <Grid item xs sx={{ alignItems: 'center' }}>
          <CustomTextField
            fullWidth
            value={value}
            placeholder={t('search_all') as unknown as string}
            onChange={e => handleFilter(e.target.value)}
            onBlur={e => handleFilter(e.target.value)}
          />
        </Grid>
        {onAddClick ? (
          <Grid item>
            <Button fullWidth onClick={onAddClick!} variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='octicon:plus-16' />
              {addButtonText!}
            </Button>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  )
}

export default TableHeader
