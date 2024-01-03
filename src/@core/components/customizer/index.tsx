// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** MUI Imports
import Radio from '@mui/material/Radio'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { useTranslation } from 'react-i18next'
import { TextField } from '@mui/material'

const Toggler = styled(Box)<BoxProps>(({ theme }) => ({
  right: 0,
  top: '50%',
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  padding: theme.spacing(2),
  zIndex: theme.zIndex.modal,
  transform: 'translateY(-50%)',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius
}))

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 400,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

const CustomizerSpacing = styled('div')(({ theme }) => ({
  padding: theme.spacing(5, 6)
}))

const ColorBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: 45,
  height: 45,
  cursor: 'pointer',
  margin: theme.spacing(2.5, 1.75, 1.75),
  borderRadius: theme.shape.borderRadius,
  transition: 'margin .25s ease-in-out, width .25s ease-in-out, height .25s ease-in-out, box-shadow .25s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}))

const Customizer = () => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)

  // ** Hook
  const { settings, saveSettings } = useSettings()

  const { t } = useTranslation()

  // ** Vars
  const {
    mode,
    skin,
    appBar,
    layout,
    navHidden,

    // appBarBlur,
    themeColor,
    navCollapsed,
    contentWidth

    // verticalNavToggleType
  } = settings

  const handleChange = (field: keyof Settings, value: Settings[keyof Settings]): void => {
    saveSettings({ ...settings, [field]: value })
  }

  return (
    <div className='customizer'>
      <Toggler className='customizer-toggler' onClick={() => setOpen(true)}>
        <Icon icon='tabler:settings' />
      </Toggler>
      <Drawer open={open} hideBackdrop anchor='right' variant='persistent'>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
            Personalize seu painel
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Deixe do seu jeito</Typography>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              right: 20,
              top: '50%',
              position: 'absolute',
              color: 'text.secondary',
              transform: 'translateY(-50%)'
            }}
          >
            <Icon icon='tabler:x' fontSize={20} />
          </IconButton>
        </Box>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              {t('data')}
            </Typography>

            {/* Title */}
            <Box sx={{ mb: 5 }}>
              <Typography>Título</Typography>
              <TextField
                value={settings.title}
                fullWidth
                onChange={e => handleChange('title', e.target.value as Settings['title'])}
              />
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography>Sigla</Typography>
              <TextField
                value={settings.acronym}
                fullWidth
                onChange={e => handleChange('acronym', e.target.value as Settings['acronym'])}
              />
            </Box>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              Tema
            </Typography>

            {/* Skin */}
            <Box sx={{ mb: 5 }}>
              <Typography>Estilo</Typography>
              <RadioGroup
                row
                value={skin}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={e => handleChange('skin', e.target.value as Settings['skin'])}
              >
                <FormControlLabel value='default' label='Padrão' control={<Radio />} />
                <FormControlLabel value='bordered' label='Com bordas' control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* Mode */}
            <Box sx={{ mb: 5 }}>
              <Typography>Modo padrão</Typography>
              <RadioGroup
                row
                value={mode}
                onChange={e => handleChange('mode', e.target.value as any)}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
              >
                <FormControlLabel value='light' label='Claro' control={<Radio />} />
                <FormControlLabel value='dark' label='Escuro' control={<Radio />} />
                {layout === 'horizontal' ? null : (
                  <FormControlLabel value='semi-dark' label='Mesclado' control={<Radio />} />
                )}
              </RadioGroup>
            </Box>

            {/* Color Picker */}
            <div>
              <Typography>Cor primária</Typography>
              <Box sx={{ display: 'flex' }}>
                <ColorBox
                  onClick={() => handleChange('themeColor', 'primary')}
                  sx={{
                    backgroundColor: '#7367F0',
                    ...(themeColor === 'primary'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'secondary')}
                  sx={{
                    backgroundColor: 'secondary.main',
                    ...(themeColor === 'secondary'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'success')}
                  sx={{
                    backgroundColor: 'success.main',
                    ...(themeColor === 'success'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'error')}
                  sx={{
                    backgroundColor: 'error.main',
                    ...(themeColor === 'error'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'warning')}
                  sx={{
                    backgroundColor: 'warning.main',
                    ...(themeColor === 'warning'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'info')}
                  sx={{
                    backgroundColor: 'info.main',
                    ...(themeColor === 'info' ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) } : {})
                  }}
                />
              </Box>
            </div>
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              Estrutura
            </Typography>

            {/* Content Width */}
            <Box sx={{ mb: 5 }}>
              <Typography>Disposição horizontal</Typography>
              <RadioGroup
                row
                value={contentWidth}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={e => handleChange('contentWidth', e.target.value as Settings['contentWidth'])}
              >
                <FormControlLabel value='full' label='Ponta a ponta' control={<Radio />} />
                <FormControlLabel value='boxed' label='Fixo' control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* AppBar */}
            <Box sx={{ mb: 5 }}>
              <Typography>Barra superior</Typography>
              <RadioGroup
                row
                value={appBar}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={e => handleChange('appBar', e.target.value as Settings['appBar'])}
              >
                <FormControlLabel value='fixed' label='Fixa' control={<Radio />} />
                <FormControlLabel value='static' label='Estática' control={<Radio />} />
                {layout === 'horizontal' ? null : (
                  <FormControlLabel value='hidden' label='Oculta' control={<Radio />} />
                )}
              </RadioGroup>
            </Box>

            {/* AppBar Blur */}
            {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>Sombreamento</Typography>
              <Switch
                name='appBarBlur'
                checked={appBarBlur}
                onChange={e => handleChange('appBarBlur', e.target.checked)}
              />
            </Box> */}
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              Menu
            </Typography>

            {/* Menu Layout */}
            {/* <Box sx={{ mb: layout === 'horizontal' && appBar === 'hidden' ? {} : 5 }}>
              <Typography>Estrutura</Typography>
              <RadioGroup
                row
                value={layout}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={e => {
                  saveSettings({
                    ...settings,
                    layout: e.target.value as Settings['layout'],
                    lastLayout: e.target.value as Settings['lastLayout']
                  })
                }}
              >
                <FormControlLabel value='vertical' label='Vertical' control={<Radio />} />
                <FormControlLabel value='horizontal' label='Horizontal' control={<Radio />} />
              </RadioGroup>
            </Box> */}

            {/* Menu Toggle */}
            {/* {navHidden || layout === 'horizontal' ? null : (
              <Box sx={{ mb: 5 }}>
                <Typography>Menu Toggle</Typography>
                <RadioGroup
                  row
                  value={verticalNavToggleType}
                  sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                  onChange={e =>
                    handleChange('verticalNavToggleType', e.target.value as Settings['verticalNavToggleType'])
                  }
                >
                  <FormControlLabel value='accordion' label='Accordion' control={<Radio />} />
                  <FormControlLabel value='collapse' label='Collapse' control={<Radio />} />
                </RadioGroup>
              </Box>
            )} */}

            {/* Menu Collapsed */}
            {navHidden || layout === 'horizontal' ? null : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
                <Typography>Manter menu escondido</Typography>
                <Switch
                  name='navCollapsed'
                  checked={navCollapsed}
                  onChange={e => handleChange('navCollapsed', e.target.checked)}
                />
              </Box>
            )}
          </CustomizerSpacing>
        </PerfectScrollbar>
      </Drawer>
    </div>
  )
}

export default Customizer
