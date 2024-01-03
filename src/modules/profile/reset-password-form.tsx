// ** React Imports
import { useState } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { capitalize } from '@mui/material'
import { useTranslation } from 'react-i18next'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'

import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import { useAuth } from 'src/hooks/useAuth'
import { prepareErrorMessage } from 'src/@core/utils/errors'
import CustomTextField from 'src/@core/components/mui/text-field'

const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    },
    'min-height': 0
  },
  '& .MuiTimelineDot-root': {
    border: 0,
    padding: 0
  }
})

const schema = yup.object().shape({
  password: yup
    .string()
    .required()
    .test('senha', 'Senha deve conter pelo menos um número, um símbolo e uma letra maiúscula', value => {
      if (!value) return false

      const hasNumber = /\d/.test(value) // Verifica se há pelo menos um número
      const hasSymbol = /[!@#$%^&*()_+[\]{};':"\\|,.<>?]/.test(value) // Verifica se há pelo menos um símbolo
      const hasUppercase = /[A-Z]/.test(value) // Verifica se há pelo menos uma letra maiúscula

      return hasNumber && hasSymbol && hasUppercase
    })
})

const ResetPasswordForm = () => {
  const { t } = useTranslation()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** Hooks
  const auth = useAuth()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [passwordValue, setPasswordValue] = useState<string>('')

  // Handle New Password
  const onSubmit = (data: any) => {
    const { password } = data
    const p = auth.updatePassword(password)

    toast.promise(p, {
      loading: 'enviando nova senha...',
      error: 'Ocorreu um erro ao trocar a senha! Tente novamente mais tarde!',
      success: 'Senha alterada com sucesso!'
    })
  }

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name='password'
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <CustomTextField
            fullWidth
            {...field}
            autoFocus
            onChange={e => {
              field.onChange(e)

              setPasswordValue(e.target.value)
            }}
            label={capitalize(t('password'))}
            type={showPassword ? 'text' : 'password'}
            error={Boolean(errors.password)}
            {...(errors[field.name]! && {
              helperText: prepareErrorMessage(
                field.name,
                capitalize(t('password')),
                errors[field.name]!.message! as string
              )
            })}
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
      <Typography
        sx={{
          mt: 4,
          mb: 3,
          fontWeight: 500,
          lineHeight: 'normal'
        }}
      >
        A senha deve conter:{' '}
      </Typography>
      <Timeline>
        <TimelineItem>
          <TimelineSeparator>
            {passwordValue.length >= 8 ? (
              <TimelineDot color='success' variant='outlined' sx={{ mt: 0 }}>
                <Icon fontSize='1.25rem' icon='tabler:circle-check' />
              </TimelineDot>
            ) : (
              <TimelineDot color='error' variant='outlined' sx={{ mt: 0 }}>
                <Icon fontSize='1.25rem' icon='carbon:close-filled' />
              </TimelineDot>
            )}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ mt: 0, pt: 0, mb: theme => `${theme.spacing(1)} !important` }}>
            <Typography
              variant='body2'
              sx={{
                mb: 0.5,
                fontWeight: 500,
                lineHeight: 'normal',
                color: passwordValue.length >= 8 ? 'success.main' : 'error.main'
              }}
            >
              No mínimo 8 dígitos
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            {/[A-Z]/.test(passwordValue) ? (
              <TimelineDot color='success' variant='outlined' sx={{ mt: 0 }}>
                <Icon fontSize='1.25rem' icon='tabler:circle-check' />
              </TimelineDot>
            ) : (
              <TimelineDot color='error' variant='outlined' sx={{ mt: 0 }}>
                <Icon fontSize='1.25rem' icon='carbon:close-filled' />
              </TimelineDot>
            )}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ mt: 0, pt: 0, mb: theme => `${theme.spacing(1)} !important` }}>
            <Typography
              variant='body2'
              sx={{
                mb: 0.5,
                fontWeight: 500,
                lineHeight: 'normal',
                color: /[A-Z]/.test(passwordValue) ? 'success.main' : 'error.main'
              }}
            >
              Ao menos uma letra maiúscula
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            {/[a-z]/.test(passwordValue) ? (
              <TimelineDot color='success' variant='outlined' sx={{ mt: 0 }}>
                <Icon fontSize='1.25rem' icon='tabler:circle-check' />
              </TimelineDot>
            ) : (
              <TimelineDot color='error' variant='outlined' sx={{ mt: 0 }}>
                <Icon fontSize='1.25rem' icon='carbon:close-filled' />
              </TimelineDot>
            )}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ mt: 0, pt: 0, mb: theme => `${theme.spacing(1)} !important` }}>
            <Typography
              variant='body2'
              sx={{
                mb: 0.5,
                fontWeight: 500,
                lineHeight: 'normal',
                color: /[a-z]/.test(passwordValue) ? 'success.main' : 'error.main'
              }}
            >
              Ao menos uma letra minuscula
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {/\d/.test(passwordValue) ? (
              <TimelineDot color='success' variant='outlined' sx={{ mt: 0 }}>
                <Icon fontSize='1.25rem' icon='tabler:circle-check' />
              </TimelineDot>
            ) : (
              <TimelineDot color='error' variant='outlined' sx={{ mt: 0 }}>
                <Icon fontSize='1.25rem' icon='carbon:close-filled' />
              </TimelineDot>
            )}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ mt: 0, pt: 0, mb: theme => `${theme.spacing(1)} !important` }}>
            <Typography
              variant='body2'
              sx={{
                mb: 0.5,
                fontWeight: 500,
                lineHeight: 'normal',
                color: /\d/.test(passwordValue) ? 'success.main' : 'error.main'
              }}
            >
              Ao menos um número
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(passwordValue) ? (
              <TimelineDot color='success' variant='outlined' sx={{ mt: 0 }}>
                <Icon fontSize='1.25rem' icon='tabler:circle-check' />
              </TimelineDot>
            ) : (
              <TimelineDot color='error' variant='outlined' sx={{ mt: 0 }}>
                <Icon fontSize='1.25rem' icon='carbon:close-filled' />
              </TimelineDot>
            )}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ mt: 0, pt: 0, mb: theme => `${theme.spacing(1)} !important` }}>
            <Typography
              variant='body2'
              sx={{
                mb: 0.5,
                fontWeight: 500,
                lineHeight: 'normal',
                color: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(passwordValue) ? 'success.main' : 'error.main'
              }}
            >
              Ao menos um caractere especial
            </Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
      <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
        {capitalize(t('change_password'))}
      </Button>
    </form>
  )
}

export default ResetPasswordForm
