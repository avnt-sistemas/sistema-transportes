import { InitialStatus } from 'src/modules/common/interfaces/status'
import Entity from 'src/modules/common/interfaces/entity'
import { TFunction } from 'i18next'
import BaseEntity from 'src/modules/common/entities/base-entity'
import Unity from '../interfaces/unity'
import ModelService from 'src/modules/common/service/model.service'
import { GridColDef } from '@mui/x-data-grid'
import TextColumn from 'src/modules/common/columns/text'
import { clearNumber } from 'src/@core/utils/format'
import { DynamicField } from 'src/components/form/update'
import TextField from 'src/modules/common/fields/text'
import MaskedField from 'src/modules/common/fields/masked'
import * as yup from 'yup'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'

interface ViaCepProps {
  bairro: string
  cep: string
  complemento: string
  ddd: string
  gia: string
  ibge: string
  localidade: string
  logradouro: string
  siafi: string
  uf: string
}
export default class UnityEntity extends BaseEntity implements Entity<Unity> {
  name = 'unity'
  plural = 'unities'

  collection!: string

  data!: Unity
  service!: ModelService<Unity>

  get id(): string | null {
    return this.data.id
  }

  constructor(t: TFunction<'translation', undefined, 'translation'>, data?: Unity) {
    super(t)

    this.service = new ModelService<Unity>('unitys')
    if (data) this.setData(data)
    else this.clear()
  }

  setData(data: Unity) {
    this.data = {
      name: data.name || '',
      postalCode: data.postalCode,
      street: data.street,
      number: data.number,
      complement: data.complement || '',
      district: data.district,
      city: data.city,
      state: data.state,
      country: data.country,
      ibge: data.ibge,
      id: data.id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      company_id: data.company_id,
      company: data.company || null,
      status: data.status || InitialStatus
    }
  }

  clear() {
    this.data = {
      name: '',
      postalCode: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      country: '',
      ibge: null,
      id: null,
      created_at: null,
      updated_at: null,
      company_id: null,
      company: null,
      status: InitialStatus
    }
  }

  setDataForViaCep(viacepData: any) {
    const data = viacepData as ViaCepProps
    this.data.postalCode = data.cep
    this.data.street = data.logradouro
    this.data.number = ''
    this.data.complement = data.complemento
    this.data.district = data.bairro
    this.data.city = data.localidade
    this.data.state = data.uf
    this.data.country = 'Brasil'
    this.data.ibge = data.ibge || null
  }

  columns(): GridColDef[] {
    return [
      TextColumn({
        t: this.t,
        name: 'name'
      }),
      TextColumn({
        name: 'street',
        t: this.t,
        minWidth: 250,
        formatValue: row => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {row.street}, {row.number}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {row.district}
              </Typography>
            </Box>
          </Box>
        )
      }),
      TextColumn({
        name: 'city',
        t: this.t,
        formatValue: row => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {row.city} - {row.state}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {row.postalCode}
              </Typography>
            </Box>
          </Box>
        )
      })
    ]
  }

  fields(): DynamicField[] {
    return [
      {
        name: 'name',
        component: props => <TextField {...props} required />
      },
      {
        name: 'postalCode',
        component: props => (
          <MaskedField
            mask='99999-999'
            {...props}
            required
            afterChange={(state, setValue, event) => {
              const value = clearNumber(event.target.value || '')
              if (value.length === 8) {
                axios.get(`https://viacep.com.br/ws/${value}/json/`).then(({ data }) => {
                  if (!data.erro) {
                    this.setDataForViaCep(data)
                    setValue!('postalCode', this.data.postalCode)
                    setValue!('number', this.data.number)
                    setValue!('complement', this.data.complement)
                    setValue!('district', this.data.district)
                    setValue!('street', this.data.street)
                    setValue!('city', this.data.city)
                    setValue!('state', this.data.state)
                    setValue!('country', this.data.country)
                    setValue!('ibge', this.data.ibge)
                  } else {
                    toast.error('CEP não encontrado!')
                  }
                })
              }
            }}
          />
        )
      },
      {
        name: 'street',
        component: props => <TextField {...props} required />
      },
      {
        name: 'number',
        component: props => <TextField {...props} required />
      },
      {
        name: 'complement',
        component: props => <TextField {...props} />
      },
      {
        name: 'district',
        component: props => <TextField {...props} required readOnly />
      },
      {
        name: 'city',
        component: props => <TextField {...props} required readOnly />
      },
      {
        name: 'state',
        component: props => <TextField {...props} required readOnly sx={{ textTransform: 'uppercase' }} />
      }
    ]
  }

  schema(): yup.AnyObjectSchema {
    return yup.object().shape({
      name: yup.string().required(),
      postalCode: yup.string().required(),
      street: yup.string().required(),
      number: yup.string().required(),
      district: yup.string().required(),
      city: yup.string().required(),
      state: yup.string().required(),
      country: yup.string().required()
    })
  }
}
