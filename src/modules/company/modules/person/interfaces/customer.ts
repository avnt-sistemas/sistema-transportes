import Person from './person'

export default interface Customer extends Person {
  business_name: string | null
}
