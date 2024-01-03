import Model from 'src/modules/common/interfaces/model'

export interface AclObjectRole {
  subject: string
  actions: string | string[]
}

export default interface Role extends Model {
  name: string
  level: number
  translated_name?: string
  color: string
  icon: string
  acl_objects: AclObjectRole[]
}
