import Entity from 'src/modules/common/interfaces/entity'
import { TFunction } from 'i18next'
import BaseEntity from 'src/modules/common/entities/base-entity'
import Role from '../interfaces/role'
import RoleService from '../services/role-service'

export default class RoleEntity extends BaseEntity implements Entity<Role> {
  name = 'role'
  plural = 'roles'

  isRelation = false

  ignoredProperties: string[] = ['truck', 'roles']

  collection!: string

  data!: Role
  service!: RoleService

  get id(): string | null {
    return this.data.id
  }

  constructor(t: TFunction<'translation', undefined, 'translation'>, isRelation?: boolean, data?: Role) {
    super(t)

    this.service = new RoleService()

    if (data) this.setData(data)
    else this.clear()
  }

  async setData(data: Role) {
    this.data = {
      id: data.id || null,
      name: data.name || '',
      color: data.color || '',
      icon: data.icon || '',
      acl_objects: data.acl_objects || [],
      created_at: data.created_at,
      updated_at: data.updated_at
    }
  }

  async clear() {
    this.data = {
      id: null,
      name: '',
      color: '',
      icon: '',
      acl_objects: [],
      created_at: null,
      updated_at: null
    }
  }
}
