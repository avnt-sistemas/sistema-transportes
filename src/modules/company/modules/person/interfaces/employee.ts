import Role from 'src/modules/role/interfaces/role'
import Person from './person'

export default interface Employee extends Person {
  role: Role | null
  last_vehicle_id: string | null
  auth_id: string | null
  can_login: boolean | false
  login_with_document: boolean | false
  password: string | null
  email: string | null
  document: string | null
  work_trip: number
  work_off: number
  next_work_day: Date | null
  next_day_off: Date | null
}
