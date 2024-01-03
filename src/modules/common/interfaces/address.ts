import HasStatus from './has/has-status'

export default interface Address extends HasStatus {
  id: number
  name: string
  postalCode: string

  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: string
  country: string

  ibge?: string

  default: boolean | false
}
