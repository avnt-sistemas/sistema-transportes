import HasCompany from 'src/modules/common/interfaces/has/has-company'
import HasStatus from 'src/modules/common/interfaces/has/has-status'
import Model from 'src/modules/common/interfaces/model'

export default interface Unity extends Model, HasCompany, HasStatus {
  name: string
  postalCode: string

  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: string
  country: string

  ibge: string | null
}
