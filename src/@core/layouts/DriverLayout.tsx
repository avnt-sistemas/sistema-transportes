import { Grid, Toolbar } from '@mui/material'
import { Box } from '@mui/system'
import { ReactNode } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

const DriverLayoutPage = ({ children }: { children: ReactNode }) => {
  const { settings, saveSettings } = useSettings()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          className='layout-navbar'
          sx={{
            width: '100%',
            ...(settings.navHidden ? {} : { borderBottom: theme => `1px solid ${theme.palette.divider}` })
          }}
        >
          <Toolbar
            className='navbar-content-container'
            sx={{
              mx: 'auto',
              ...(settings.contentWidth === 'boxed' && { '@media (min-width:1440px)': { maxWidth: 1440 } }),
              minHeight: theme => `${(theme.mixins.toolbar.minHeight as number) - 2}px !important`
            }}
          >
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
              <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
                <ModeToggler settings={settings} saveSettings={saveSettings} />
                <UserDropdown settings={settings} />
              </Box>
            </Box>
          </Toolbar>
        </Box>
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  )
}

DriverLayoutPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default DriverLayoutPage
