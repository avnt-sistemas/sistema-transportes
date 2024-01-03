// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Component Import

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { pt } from 'yup-locale-pt'

yup.setLocale(pt)

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useTranslation } from 'react-i18next'
import { capitalize } from '@mui/material'
import { useRouter } from 'next/router'
import { setFocus } from 'src/@core/utils/input'
import Logo from 'src/layouts/components/logo/Logo'
import MaskedField from 'src/modules/common/fields/masked'
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'
import { clearString } from 'src/@core/utils/format'
import { useSettings } from 'src/@core/hooks/useSettings'
import themeConfig from 'src/configs/themeConfig'

const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const schema = yup.object().shape({
  document: yup.string().required()
})

const defaultValues = {
  document: ''
}

interface FormData {
  document: string
}

const LoginPage = () => {
  const { t } = useTranslation()

  const { control, setError, handleSubmit, setValue } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ** Hooks
  const auth = useAuth()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const [loading, setLoading] = useState<boolean>(false)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    setFocus('document')
  }, [router])

  // ** Vars
  const { skin } = settings

  const onSubmit = (data: FormData) => {
    setLoading(true)
    const { document } = data
    auth
      .login({ document: clearString(document) })
      .then(() => {
        router.replace(getHomeRoute('driver'))
      })
      .catch(() => {
        setError('document', {
          type: 'manual',
          message: 'Não encontramos você! Verifique se digitou tudo certinho :)'
        })
      })
      .finally(() => setLoading(false))
  }

  const c = (str: string) => capitalize(str)

  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            flexDirection: 'column',
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <LoginIllustration alt='login-illustration' src={`/images/pages/${imageSource}-${theme.palette.mode}.png`} />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 400,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 6
              }}
            >
              {hidden ? <Logo /> : null}
              <Typography variant='h2' sx={{ mb: 1.5, ml: 2 }}>
                {`${settings.title || themeConfig.templateName}`}
              </Typography>
            </Box>

            <Box
              sx={{
                width: '100%',
                maxWidth: 400
              }}
            >
              <Box sx={{ my: 6 }}>
                <Typography variant='h3' sx={{ mb: 1.5 }}>
                  {`${c(t('welcome'))} Motorista! 👋🏻`}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Digite seu CPF para entrar...</Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 4 }}>
                  <Controller
                    name='document'
                    control={control}
                    render={props => (
                      <MaskedField
                        fullWidth
                        setValue={setValue}
                        {...props}
                        label={'CPF'}
                        mask='999.999.999-99'
                        sx={{ mb: 4 }}
                      />
                    )}
                  />
                </Box>
                <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                  {loading ? <Icon icon='eos-icons:loading' /> : t('login.button')}
                </Button>
              </form>
            </Box>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

export default LoginPage
