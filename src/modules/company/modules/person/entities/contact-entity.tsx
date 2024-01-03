import Entity from 'src/modules/common/interfaces/entity'
import Contact, { ContactType, getContactName } from 'src/modules/common/interfaces/contact'

import TextField from 'src/modules/common/fields/text'
import { DynamicField } from 'src/components/form/update'
import TextColumn from 'src/modules/common/columns/text'
import { TFunction } from 'i18next'
import { Typography } from '@mui/material'
import { AnyObjectSchema } from 'yup'

import * as yup from 'yup'
import { GridColDef } from '@mui/x-data-grid'

import { HasContacts } from 'src/modules/common/interfaces/relations/has-contact'
import BaseEntity from 'src/modules/common/entities/base-entity'
import { clearNumber, formatPhoneNumber } from 'src/@core/utils/format'
import ContactField from 'src/modules/common/fields/contact'

export default class ContactEntity extends BaseEntity implements Entity<Contact> {
  name = 'contact'
  plural = 'contacts'

  data!: Contact

  master: HasContacts

  get id(): number {
    return this.data.id
  }

  constructor(t: TFunction<'translation', undefined, 'translation'>, master: HasContacts, data?: Contact) {
    super(t)
    this.master = master
    if (data) this.setData(data)
    else this.clear()
  }

  setData(data: Contact) {
    this.data = {
      id: data.id || -1,
      name: data.name || '',
      type: data.type || 'other',
      value: ['phone', 'whatsapp'].includes(data.type) ? clearNumber(data.value || '') : data.value || ''
    }
  }

  clear() {
    this.data = {
      id: -1,
      type: 'other',
      name: '',
      value: ''
    }
  }

  fields(): DynamicField[] {
    return [
      {
        name: 'name',
        component: props => <TextField {...props} required />
      },
      {
        name: 'type',
        component: props => <TextField {...props} type='hidden' />
      },
      {
        name: 'value',
        component: props => <ContactField {...props} required />
      }
    ]
  }

  columns(): GridColDef[] {
    return [
      TextColumn({
        name: 'name',
        t: this.t
      }),
      TextColumn({
        name: 'type',
        t: this.t,
        width: 150,
        formatValue: row => (
          <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {getContactName(this.t, row.type as ContactType)}
          </Typography>
        )
      }),
      TextColumn({
        name: 'value',
        t: this.t,
        minWidth: 250,
        formatValue: row => {
          switch (row.type as ContactType) {
            case 'phone':
            case 'whatsapp':
              return formatPhoneNumber(row.value)
            default:
              return row.value
          }
        }
      })
    ]
  }

  schema(): AnyObjectSchema {
    return yup.object().shape({
      value: yup.string().required()
    })
  }

  async get(i: number) {
    this.setData(this.master.contact(i))
  }

  async save() {
    if (this.id >= 0) {
      this.master.setContact(this.id, this.data)
    } else {
      const n = { ...this.data, id: this.master.contacts.length + 1 }
      this.setData(n)
      this.master.addContact(n)
    }
  }

  async delete() {
    if (this.id >= 0) this.master.removeContact(this.id)
    else throw new Error('index is required for this!')

    return true
  }
}
