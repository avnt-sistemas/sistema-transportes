import TextField from 'src/modules/common/fields/text'
import PersonEntity from './person-entity'
import { DynamicField } from 'src/components/form/update'
import TextColumn from 'src/modules/common/columns/text'
import { TFunction } from 'i18next'
import Customer from '../interfaces/customer'
import ModelServiceWithSoftDeletes from 'src/modules/common/service/model-with-soft-deletes.service'
import { AnyObjectSchema } from 'yup'

import * as yup from 'yup'

export default class CustomerEntity extends PersonEntity {
  name = 'customer'
  plural = 'customers'

  data!: Customer
  service!: ModelServiceWithSoftDeletes<Customer>

  constructor(t: TFunction<'translation', undefined, 'translation'>, data?: Customer) {
    super(t, data)
    this.service = new ModelServiceWithSoftDeletes<Customer>('customers')
  }

  setData(data: Customer): void {
    super.setData(data)
    this.data.business_name = data.business_name || ''
  }

  clear(): void {
    super.clear()
    this.data.business_name = ''
  }

  fields(): DynamicField[] {
    return [
      {
        name: 'name',
        component: props => <TextField {...props} label='fields.enterprise_name' translateLabel required />
      },
      {
        name: 'business_name',
        component: props => <TextField {...props} required />
      }
    ]
  }

  columns() {
    return [
      TextColumn({ name: 'name', t: this.t, headerName: 'fields.enterprise_name', translateHeaderName: true }),
      TextColumn({ name: 'business_name', t: this.t })
    ]
  }

  schema(): AnyObjectSchema {
    return yup.object().shape({
      name: yup.string().required(),
      business_name: yup.string().required()
    })
  }
}
