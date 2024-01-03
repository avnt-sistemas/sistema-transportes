import TextField from 'src/modules/common/fields/text'
import PersonEntity from './person-entity'
import { DynamicField } from 'src/components/form/update'
import TextColumn from 'src/modules/common/columns/text'
import { TFunction } from 'i18next'
import ModelServiceWithSoftDeletes from 'src/modules/common/service/model-with-soft-deletes.service'
import Employee from '../interfaces/employee'

import { AnyObjectSchema } from 'yup'

import * as yup from 'yup'
import BoolField from 'src/modules/common/fields/bool'
import MaskedField from 'src/modules/common/fields/masked'
import BoolColumn from 'src/modules/common/columns/boolean'
import DateTimePicker from 'src/modules/common/fields/date-time'
import { Timestamp } from 'firebase/firestore/lite'
import { timestampToDate } from 'src/@core/utils/format'
import { Chip, capitalize } from '@mui/material'
import AutocompleteField from 'src/modules/common/fields/autocomplete'
import Role from 'src/modules/role/interfaces/role'
import RoleEntity from 'src/modules/role/entities/role-entity'
import IconifyIcon from 'src/@core/components/icon'
import UserEntity from 'src/modules/user/entitites/user-entity'
import TripService from '../../trip/services/trip-service'

export default class EmployeeEntity extends PersonEntity {
  name = 'employee'
  plural = 'employees'

  data!: Employee
  service!: ModelServiceWithSoftDeletes<Employee>

  roles!: Role[]

  constructor(t: TFunction<'translation', undefined, 'translation'>, data?: Employee) {
    super(t, data)
    this.service = new ModelServiceWithSoftDeletes<Employee>('employees')
  }

  setData(data: Employee): void {
    super.setData(data)
    this.data.last_vehicle_id = data.last_vehicle_id || ''
    this.data.auth_id = data.auth_id || ''
    this.data.login_with_document = data.login_with_document || false
    this.data.can_login = data.can_login || false
    this.data.document = data.document || null
    this.data.email = data.email || null
    this.data.password = data.password || null
    this.data.work_trip = data.work_trip || 0
    this.data.work_off = data.work_off || 0
    this.data.role = data.role || null

    if (data.next_work_day instanceof Timestamp) this.data.next_work_day = timestampToDate(data.next_work_day)
    else this.data.next_work_day = data.next_work_day || null
  }

  clear(): void {
    super.clear()
    this.data.last_vehicle_id = null
    this.data.auth_id = null
    this.data.can_login = false
    this.data.login_with_document = false
    this.data.document = null
    this.data.email = null
    this.data.password = null
    this.data.work_trip = 0
    this.data.work_off = 0
    this.data.next_work_day = null
    this.data.next_day_off = null
    this.data.role = null
  }

  async fields(): Promise<DynamicField[]> {
    await this.getRolesList()

    return [
      {
        name: 'name',
        component: props => <TextField {...props} required />
      },
      {
        name: 'role',
        component: props => (
          <AutocompleteField {...props} options={this.roles} required icon='icon' title='translated_name' />
        )
      },
      {
        name: 'can_login',
        component: props => <BoolField {...props} defaultValue={true} />
      },
      {
        name: 'email',
        component: props => <TextField {...props} required />
      },
      {
        name: 'document',
        component: props => <MaskedField {...props} label={'CPF'} mask='999.999.999-99' />
      },
      {
        name: 'login_with_document',
        component: props => <BoolField {...props} />
      },
      {
        name: 'work_trip',
        component: props => <TextField {...props} required type='number' />
      },
      {
        name: 'work_off',
        component: props => <TextField {...props} required type='number' />
      },
      {
        name: 'next_work_day',
        component: props => <DateTimePicker {...props} hideTime />
      }
    ]
  }

  columns() {
    return [
      TextColumn({ name: 'name', t: this.t, minWidth: 180 }),
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
      TextColumn({ name: 'email', t: this.t, minWidth: 170 }),
      BoolColumn({ name: 'can_login', t: this.t, width: 180 }),
      BoolColumn({ name: 'login_with_document', t: this.t, width: 260 }),
      TextColumn({
        name: 'next_day_off',
        t: this.t,
        formatValue: row => {
          if (!row.work_off || !row.work_trip) return ''

          const next_day_off = EmployeeEntity.getNextOffDay(row.work_trip, row.work_off, row.next_work_day)
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          if (next_day_off.getTime() === today.getTime()) return capitalize(this.t('today'))

          return next_day_off.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        }
      })
    ]
  }

  schema(): AnyObjectSchema {
    return yup.object().shape({
      name: yup.string().required(),
      email: yup
        .string()
        .email()
        .test('domain', 'E-mail deve ter um domínio válido', value => {
          if (!value) return true

          return /\.[A-Za-z]+$/.test(value)
        })
        .required()
    })
  }

  static getNextOffDay(workDays: number, offDays: number, referenceDate: Date | null) {
    if (referenceDate instanceof Timestamp) referenceDate = timestampToDate(referenceDate)
    const nextDate = referenceDate ? new Date(referenceDate) : new Date()
    const currentDate = new Date()

    workDays = parseInt(workDays as unknown as string) //foca o parametro ser numero (por algum motivo o tipo dele estava === 'string')
    offDays = parseInt(offDays as unknown as string) //foca o parametro ser numero (por algum motivo o tipo dele estava === 'string')

    if (currentDate.getHours() > 18) currentDate.setDate(currentDate.getDate() + 1)
    currentDate.setHours(0, 0, 0, 0)
    nextDate.setHours(0, 0, 0, 0)

    while (currentDate > nextDate) {
      nextDate.setDate(nextDate.getDate() + workDays)

      for (let i = 0; i < offDays; i++) {
        if (currentDate > nextDate) {
          nextDate.setDate(nextDate.getDate() + 1)
        }
      }
    }

    return nextDate
  }

  async getRolesList() {
    if (!this.roles) {
      const roleEntity = new RoleEntity(this.t)

      this.roles = (await roleEntity.service.fetch())
        .filter(role => role.level > 0)
        .map(role => {
          role.translated_name = this.t(`roles.${role.name}`) as unknown as string

          return role
        })
        .sort((a, b) => a.translated_name!.localeCompare(b.translated_name!))
    }

    return this.roles
  }

  async save(): Promise<any> {
    const id = this.id

    if (!id) {
      const item = window.localStorage.getItem('userData')
      const user = item ? JSON.parse(item) : null

      const userEntity = new UserEntity(this.t)

      const createdUser = await userEntity.service.store({
        ...userEntity.data,
        document: this.data.document,
        displayName: this.data.name,
        active: true,
        email: this.data.email,
        role_id: this.data.role ? this.data.role.id : null,
        auth_id: null,
        company_id: user!.company_id
      })

      this.data.auth_id = createdUser.auth_id
    }

    return await super.save()
  }

  async getTrips() {
    if (this.data.role && this.data.role.name === 'driver') {
      const service = new TripService()

      return await service.getDriverTrips(this.id as string)
    } else return []
  }

  async getLoggedEmployee() {
    return this.service.getFromLoggedUser()
  }
}
