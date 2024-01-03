import { InitialStatus } from 'src/modules/common/interfaces/status'
import Entity from 'src/modules/common/interfaces/entity'
import Address from 'src/modules/common/interfaces/address'

import TextField from 'src/modules/common/fields/text'
import { DynamicField } from 'src/components/form/update'
import TextColumn from 'src/modules/common/columns/text'
import { TFunction } from 'i18next'
import { Box, Typography } from '@mui/material'
import { AnyObjectSchema } from 'yup'

import * as yup from 'yup'
import { GridColDef } from '@mui/x-data-grid'
import BoolColumn from 'src/modules/common/columns/boolean'
import MaskedField from 'src/modules/common/fields/masked'
import axios from 'axios'
import toast from 'react-hot-toast'
import { HasAddresses } from 'src/modules/common/interfaces/relations/has-address'
import { clearNumber } from 'src/@core/utils/format'
import BaseEntity from 'src/modules/common/entities/base-entity'
import BoolField from 'src/modules/common/fields/bool'

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

export default class AddressEntity extends BaseEntity implements Entity<Address> {
  name = 'address'
  plural = 'addresses'

  data!: Address
  master: HasAddresses

  get id(): number {
    return this.data.id
  }

  constructor(t: TFunction<'translation', undefined, 'translation'>, master: HasAddresses, data?: Address) {
    super(t)
    this.master = master
    if (data) this.setData(data)
    else this.clear()
  }

  setData(data: Address) {
    this.data = {
      name: data.name || '',
      id: data.id || -1,
      postalCode: data.postalCode,
      street: data.street,
      number: data.number,
      complement: data.complement || '',
      district: data.district,
      city: data.city,
      state: data.state,
      country: data.country,
      ibge: data.ibge,
      default: data.default || false,
      status: data.status || InitialStatus
    }
  }

  clear() {
    this.data = {
      id: -1,
      name: '',
      postalCode: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      country: '',
      ibge: undefined,
      default: false,
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
    this.data.ibge = data.ibge
  }

  fields(): DynamicField[] {
    return [
      {
        name: 'name',
        component: props => <TextField {...props} required />
      },
      {
        name: 'default',
        component: props => <BoolField {...props} required />
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
        component: props => <TextField {...props} required disabled />
      },
      {
        name: 'city',
        component: props => <TextField {...props} required disabled />
      },
      {
        name: 'state',
        component: props => <TextField {...props} required disabled sx={{ textTransform: 'uppercase' }} />
      }
    ]
  }

  columns(): GridColDef[] {
    return [
      TextColumn({
        name: 'name',
        t: this.t,
        width: 150,
        formatValue: row => (
          <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {row.name}
          </Typography>
        )
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
      }),
      BoolColumn({ name: 'default', t: this.t })
    ]
  }

  schema(): AnyObjectSchema {
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

  async get(i: number) {
    this.setData(this.master.address(i))
  }

  async save() {
    if (this.id >= 0) {
      this.master.setAddress(this.id, this.data)
    } else {
      const n = { ...this.data, id: this.master.addresses.length + 1 }
      this.setData(n)
      this.master.addAddress(n)
    }

    if (this.data.default)
      this.master.addresses
        .filter(address => address.id !== this.id)
        .forEach(address => this.master.setAddress(address.id, { ...address, default: false }))
  }

  async delete() {
    if (this.id >= 0) this.master.removeAddress(this.id)
    else throw new Error('index is required for this!')

    return true
  }
}
