import Entity from 'src/modules/common/interfaces/entity'
import { TFunction } from 'i18next'
import BaseEntity from 'src/modules/common/entities/base-entity'
import User from '../interfaces/user'
import { GridColDef } from '@mui/x-data-grid'
import TextColumn from 'src/modules/common/columns/text'
import { DynamicField } from 'src/components/form/update'
import * as yup from 'yup'
import UserService from '../user-service'

import TextField from 'src/modules/common/fields/text'
import AutocompleteField from 'src/modules/common/fields/autocomplete'
import Role from 'src/modules/role/interfaces/role'
import RoleEntity from 'src/modules/role/entities/role-entity'
import IconifyIcon from 'src/@core/components/icon'
import { Chip } from '@mui/material'
import Company from 'src/modules/company/interfaces/company'
import CompanyEntity from 'src/modules/company/entities/company-entity'
import BoolColumn from 'src/modules/common/columns/boolean'
import BoolField from 'src/modules/common/fields/bool'

export default class UserEntity extends BaseEntity implements Entity<User> {
  name = 'user'
  plural = 'users'

  collection!: string

  data!: User
  service!: UserService

  roles!: Role[]
  companies!: Company[]

  get id(): string | null {
    return this.data.id
  }

  constructor(t: TFunction<'translation', undefined, 'translation'>, data?: User) {
    super(t)

    this.service = new UserService()

    this.getRolesList()
    this.getCompaniesList()

    if (data) this.setData(data)
    else this.clear()
  }

  async getRolesList() {
    if (!this.roles) {
      const roleEntity = new RoleEntity(this.t)

      this.roles = (await roleEntity.service.fetch())
        .map(role => {
          role.translated_name = this.t(`roles.${role.name}`) as unknown as string

          return role
        })
        .sort((a, b) => a.translated_name!.localeCompare(b.translated_name!))
    }

    return this.roles
  }

  async getCompaniesList() {
    if (!this.companies) {
      const companyEntity = new CompanyEntity(this.t)

      this.companies = (await companyEntity.fetch()).sort((a, b) => a.name!.localeCompare(b.name!))
    }

    return this.companies
  }

  setData(data: User) {
    this.data = {
      active: data.active || true,
      company_id: data.company_id || null,
      auth_id: data.auth_id,
      displayName: data.displayName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      photoURL: data.photoURL,
      providerId: data.providerId,
      id: data.id,
      role_id: data.role_id || '',
      role: data.role || null,
      uid: data.uid,
      owner: data.owner,
      password: data.password,
      created_at: data.created_at,
      updated_at: data.updated_at
    }

    if (data.role_id && !data.role) {
      data.role = this.roles.find(r => r.id === data.role_id) || null
    }
  }

  clear() {
    this.data = {
      auth_id: '',
      displayName: '',
      email: '',
      phoneNumber: '',
      photoURL: '',
      providerId: '',
      id: '',
      role_id: '',
      role: null,
      uid: '',
      owner: false,
      password: '',
      active: true,
      company_id: null,
      created_at: null,
      updated_at: null
    }
  }

  async columns(): Promise<GridColDef[]> {
    await this.getRolesList()
    await this.getCompaniesList()

    return [
      TextColumn({
        t: this.t,
        name: 'displayName'
      }),
      TextColumn({
        t: this.t,
        name: 'email'
      }),
      TextColumn({
        t: this.t,
        name: 'role',
        formatValue: row =>
          row.role ? (
            <Chip
              color={row.role.color}
              icon={<IconifyIcon icon={row.role.icon} color='#efefef' />}
              label={row.role.translated_name}
            />
          ) : null
      }),
      TextColumn({
        t: this.t,
        name: 'company',
        formatValue: row => {
          const company = row.company_id ? this.companies.find(c => c.id === row.company_id) : null

          return company ? company.name : 'Não atrelado a nenhuma empresa'
        }
      }),
      BoolColumn({
        t: this.t,
        name: 'owner'
      })
    ]
  }

  async fields(): Promise<DynamicField[]> {
    await this.getRolesList()
    await this.getCompaniesList()

    return [
      {
        name: 'displayName',
        component: props => <TextField {...props} required />
      },
      {
        name: 'email',
        component: props => <TextField {...props} required />
      },
      {
        name: 'role_id',
        component: props => (
          <AutocompleteField
            {...props}
            disableClearable
            options={this.roles}
            icon='icon'
            title='translated_name'
            valueTag='id'
          />
        )
      },
      {
        name: 'company_id',
        component: props => (
          <AutocompleteField
            {...props}
            options={this.companies}
            icon='icon'
            title='name'
            subtitle='business_name'
            valueTag='id'
          />
        )
      },
      {
        name: 'owner',
        component: props => <BoolField {...props} />
      }
    ]
  }

  schema(): yup.AnyObjectSchema {
    return yup.object().shape({
      displayName: yup.string().required(),
      email: yup.string().required(),
      role_id: yup.string().required()

      // ...(withPassword && {
      //   password: yup
      //     .string()
      //     .min(8, 'A senha deve ter pelo menos 8 caracteres')
      //     .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      //     .matches(/[0-9]/, 'A senha deve conter pelo menos um número')
      //     .matches(/[!@#$%^&*(),.?":{}|<>]/, 'A senha deve conter pelo menos um caractere especial')
      //     .required()
      // })
    })
  }

  async fetch(): Promise<any[]> {
    const users = await this.service.fetch()
    const roles = await this.getRolesList()

    return users.map(user => {
      if (user.role_id) user.role = roles.find(role => role.id === user.role_id) || null

      return user
    })
  }
}
