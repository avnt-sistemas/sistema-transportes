import { UserInfo } from 'firebase/auth'
import Model from 'src/modules/common/interfaces/model'
import Role from 'src/modules/role/interfaces/role'

export default interface User extends UserInfo, Model {
  auth_id: string | null
  company_id: string | null
  document?: string | null
  password?: string
  owner?: boolean
  role_id: string | null
  active: boolean

  role: Role | null
}
