import { IconButton, InputAdornment, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { prepareErrorMessage } from 'src/@core/utils/errors'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import FieldProps, { prepareLabel } from './interfaces/fieldProps'

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

export interface PasswordFieldProps extends FieldProps {
  required?: boolean
  autoFocus?: boolean
  showHints?: boolean
}

export default function PasswordField({
  field,
  fieldState,
  label,
  translateLabel = false,
  required = false,
  showHints = false,
  autoFocus = true
}: PasswordFieldProps) {
  //Hooks
  const { t } = useTranslation()

  //States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [passwordValue, setPasswordValue] = useState<string>('')

  label = prepareLabel(t, field.name, label, translateLabel)

  return (
    <>
      <CustomTextField
        fullWidth
        {...field}
        required={required}
        autoFocus={autoFocus}
        onChange={e => {
          field.onChange(e)

          setPasswordValue(e.target.value)
        }}
        label={label}
        type={showPassword ? 'text' : 'password'}
        error={fieldState && Boolean(fieldState.error!)}
        {...(fieldState &&
          fieldState.error && {
            helperText: prepareErrorMessage(field.name, label, fieldState.error!.message as string)
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
      {showHints && (
        <>
          <Typography
            sx={{
              mt: 4,
              mb: 3,
              fontWeight: 500,
              lineHeight: 'normal'
            }}
          >
            A senha deve conter:&nbsp;
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
        </>
      )}
    </>
  )
}
