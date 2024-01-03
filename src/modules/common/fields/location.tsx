import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import AutocompleteField, { AutocompleteFieldProps } from './autocomplete'
import { useEffect, useState } from 'react'
import Customer from 'src/modules/company/modules/person/interfaces/customer'
import CustomerEntity from 'src/modules/company/modules/person/entities/customer-entity'
import Address from '../interfaces/address'
import Employee from 'src/modules/company/modules/person/interfaces/employee'
import EmployeeEntity from 'src/modules/company/modules/person/entities/employee-entity'

export interface LocationFieldProps extends Omit<Omit<AutocompleteFieldProps, 'title'>, 'options'> {
  forCustomer?: boolean
  forEmployee?: boolean
  options?: Address[]
}

export default function LocationField(props: LocationFieldProps) {
  const { t } = useTranslation()

  const { forCustomer = false, forEmployee = false, options = [] } = props

  const [value, setValue] = useState<Customer | Employee | undefined>()
  const [customers, setCustomers] = useState<Customer[] | Employee[]>([])
  const [_options, setOptions] = useState<any[]>(options)

  useEffect(() => {
    if (forCustomer) {
      const customerEntity = new CustomerEntity(t)

      customerEntity.service.fetch().then(resp => {
        if (resp) setCustomers(resp.filter(c => c.addresses && c.addresses.length > 0))
      })
    } else if (forEmployee) {
      const employeeEntity = new EmployeeEntity(t)

      employeeEntity.service.fetch().then(resp => {
        if (resp) setCustomers(resp.filter(c => c.addresses && c.addresses.length > 0))
      })
    }

    if (value)
      setOptions(
        value.addresses.map(address => {
          const data = { ...address } as any
          data.resumed_address = `${address.street}, ${address.number}. ${address.district}. ${address.city} - ${address.state}`

          return data
        })
      )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    setOptions(
      options.map(address => {
        const data = { ...address } as any
        data.resumed_address = `${address.street}, ${address.number}. ${address.district}. ${address.city} - ${address.state}`

        return data
      })
    )
  }, [options])

  useEffect(() => {
    if (_options) {
      if (_options.length === 1) {
        props.setValue!(props.field.name, props.valueTag ? (_options[0] as any)[props.valueTag] : _options[0])
      } else {
        const address = _options.find(a => a.default === true)
        if (address) props.setValue!(props.field.name, props.valueTag ? (address as any)[props.valueTag] : address)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_options])

  return (
    <Grid container spacing={6} sx={{ pl: 6, pt: 6 }}>
      {forCustomer && (
        <Grid sx={{ mb: 4 }} xs={12}>
          <AutocompleteField<Customer>
            field={{
              name: 'customer',
              value: value,
              onChange: setValue
            }}
            options={customers}
            title='name'
            subtitle='business_name'
          />
        </Grid>
      )}
      {value !== undefined && (
        <Grid xs={12}>
          <AutocompleteField<Address> {...props} options={_options} subtitle='name' title='resumed_address' />
        </Grid>
      )}
    </Grid>
  )
}
