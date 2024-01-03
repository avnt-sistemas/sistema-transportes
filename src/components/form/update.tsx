import { ValidationMode } from 'react-hook-form/dist/types'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { yupResolver } from '@hookform/resolvers/yup'
import { AnyObjectSchema } from 'yup'
import { Grid, capitalize } from '@mui/material'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import RemoveDialog, { RemoveDialogProps } from './dialog/remove-dialog'
import toast from 'react-hot-toast'
import FieldProps from 'src/modules/common/fields/interfaces/fieldProps'

export interface DynamicRow {
  props?: any
  fields: DynamicField[]
}

export interface DynamicField {
  key?: string
  name: string

  boxProps?: any
  controllerProps?: any

  component: ({ field, fieldState, beforeChange, afterChange, setValue }: FieldProps) => ReactElement
}

export interface DynamicFormProps {
  formKey?: string

  title: string
  subtitle?: string

  dialogProps?: any

  yupSchema?: AnyObjectSchema

  rows?: DynamicRow[]
  fields?: DynamicField[]

  mode?: keyof ValidationMode
  autoComplete?: string
  record?: any

  onSubmit: (data: any) => Promise<any>

  removeProps?: RemoveDialogProps

  showErrorsOnAlert?: boolean

  content?: any

  children?: ReactNode
  alertBox?: ReactNode
}

const UpdateForm = ({
  formKey,
  yupSchema,
  rows,
  fields,
  mode,
  autoComplete,
  record,
  onSubmit,
  removeProps,
  children,
  alertBox
}: DynamicFormProps) => {
  const { t } = useTranslation()

  const { control, handleSubmit, reset, clearErrors, setValue } = useForm({
    mode: mode || 'onBlur',
    defaultValues: record,
    ...(yupSchema && { resolver: yupResolver(yupSchema) })
  })

  const [sendingData, setSendingData] = useState<boolean>(false)

  useEffect(() => {
    //clear all fields -------------------------------------------------------------------------------------

    fields?.map(field => {
      const key = field.name
      if (record && (typeof record[key] === 'undefined' || record[key] === null)) {
        record[field.name] = ''
      }
    })
    reset(record)

    //end clear fields -------------------------------------------------------------------------------------

    clearErrors() // clear all errors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])

  const handleRemove = () => {
    removeProps?.handleToggle!()
  }

  const mappedField = ({ key, name, boxProps = { xs: 12 }, controllerProps, component }: DynamicField) => (
    <Grid item sx={{ my: 4 }} key={`box-${key || name}`} {...boxProps}>
      <Controller
        key={`controller-${key || name}`}
        name={name}
        control={control}
        {...controllerProps}
        render={props => component({ ...props, setValue })}
      />
    </Grid>
  )

  const renderRows = () => {
    return (
      <>
        {rows
          ? rows.map(({ props, fields }: DynamicRow) => {
              return (
                <Grid container spacing={4} {...props} key={formKey + '-box'}>
                  {renderFields(fields)}
                </Grid>
              )
            })
          : null}
      </>
    )
  }

  const renderFields = (f: DynamicField[]) => (f ? f.map(mappedField) : null)

  const onValid = (data: any) => {
    const promise = onSubmit(data)

    if (promise instanceof Promise) {
      setSendingData(true)

      toast.promise(promise, {
        loading: t('promise.update.loading'),
        success: t('promise.update.success'),
        error: t('promise.update.error')
      })

      promise.finally(() => setSendingData(false))
    }
  }

  const onInvalid = (err: any) => console.error('onInvalid', err)

  return (
    <>
      <form key={formKey} noValidate autoComplete={autoComplete || 'off'} onSubmit={handleSubmit(onValid, onInvalid)}>
        <fieldset disabled={sendingData} style={{ border: 'none' }}>
          <Grid spacing={6} container>
            <Grid item xs={12}>
              {alertBox}
            </Grid>
            <Grid item xs={12}>
              {rows ? renderRows() : renderFields(fields!)}
            </Grid>
            <Grid item xs={12}>
              {children}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'end', alignItems: 'center' }}>
              {removeProps && record && record!.id ? (
                <Tooltip title={capitalize(`${t('delete')} ${t(removeProps.module)}`)}>
                  <IconButton sx={{ mr: 4 }} onClick={handleRemove}>
                    <Icon color={'red'} icon='tabler:trash' fontSize={20} />
                  </IconButton>
                </Tooltip>
              ) : null}
              <Button type='submit' variant='contained'>
                {sendingData ? (
                  <Icon icon='eos-icons:loading' />
                ) : (
                  <>
                    {capitalize(t('save'))}
                    <Icon icon='ic:round-save' />
                  </>
                )}
              </Button>
            </Grid>
          </Grid>
        </fieldset>
      </form>
      {removeProps ? <RemoveDialog {...removeProps} /> : null}
    </>
  )
}

export default UpdateForm
