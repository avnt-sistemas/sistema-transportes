// ** React Imports
import { useState, ReactNode, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useTranslation } from 'react-i18next'
import { capitalize } from '@mui/material'
import { useRouter } from 'next/router'
import { prepareErrorMessage } from '../../@core/utils/errors'
import Collapse from '@mui/material/Collapse'
import getHomeRoute from '../../layouts/components/acl/getHomeRoute'
import { setBlur, setFocus } from 'src/@core/utils/input'
import Logo from 'src/layouts/components/logo/Logo'
import { useSettings } from 'src/@core/hooks/useSettings'

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

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  email: yup
    .string()
    .email()
    .test('domain', 'E-mail deve ter um domínio válido', value => {
      if (!value) return true // Se o campo estiver vazio, não faz a validação

      return /\.[A-Za-z]+$/.test(value)
    })
    .required(),
  password: yup.string().required()
})

const defaultValues = {
  password: '',
  email: ''
}

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  //tradução
  const { t } = useTranslation()

  const { settings } = useSettings()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()

  const [userExists, setUserExists] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Vars
  const { skin } = settings

  useEffect(() => {
    setFocus('email')
  }, [router])

  const onSubmit = (data: FormData) => {
    setLoading(true)
    const { email, password } = data
    auth
      .login({ email, password, rememberMe })
      .then(() => {
        router.replace(getHomeRoute())
      })
      .catch(() => {
        setError('email', {
          type: 'manual',
          message: 'Não encontramos você! Verifique se digitou tudo certinho :)'
        })
      })
      .finally(() => setLoading(false))
  }

  const onEmailBlur = async () => {
    setUserExists(true)
    setTimeout(() => setFocus('password'), 400)
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
              justifyContent: 'center'
            }}
          >
            {hidden ? <Logo /> : null}

            <Box
              sx={{
                width: '100%',
                maxWidth: 400
              }}
            >
              <Box sx={{ my: 6 }}>
                <Typography variant='h3' sx={{ mb: 1.5 }}>
                  {`${c(t('welcome'))} ${t('to')} ${settings.title || themeConfig.templateName}! 👋🏻`}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{t('login.subtitle')}</Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 4 }}>
                  <Controller
                    name='email'
                    control={control}
                    render={({ field, fieldState }) => (
                      <CustomTextField
                        fullWidth
                        {...field}
                        label={c(t('fields.email'))}
                        error={Boolean(errors[field.name]!)}
                        {...(errors[field.name]! && {
                          helperText: prepareErrorMessage(field.name, t(field.name), errors[field.name]!.message!)
                        })}
                        onBlur={event => {
                          field.onBlur()
                          const isInvalid = Boolean(fieldState.error && fieldState.error!.type !== 'manual')
                          if (event.target.value && !isInvalid && !userExists) {
                            onEmailBlur()
                          }
                        }}
                        sx={{ mb: 4 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setBlur('email', onEmailBlur)}
                              >
                                <Icon fontSize='1.25rem' icon={!userExists ? 'tabler:play' : 'tabler:check'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Box>
                <Collapse in={userExists}>
                  <Box sx={{ mb: 1.5 }}>
                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CustomTextField
                          fullWidth
                          {...field}
                          label={c(t('password'))}
                          error={Boolean(errors[field.name]!)}
                          {...(errors[field.name]! && {
                            helperText: prepareErrorMessage(field.name, t(field.name), errors[field.name]!.message!)
                          })}
                          type={showPassword ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onMouseDown={e => e.preventDefault()}
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                  </Box>
                </Collapse>
                <Box
                  sx={{
                    mb: 1.75,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <FormControlLabel
                    label={t('rememberMe')}
                    control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                  />
                  <Typography component={LinkStyled} href={'/auth/forgot-password?email=' + getValues('email')}>
                    {t('forgotPassword')}
                  </Typography>
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

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
