import BaseEntity from 'src/modules/common/entities/base-entity'
import EmployeeEntity from 'src/modules/company/modules/person/entities/employee-entity'
import CustomerEntity from 'src/modules/company/modules/person/entities/customer-entity'
import VehicleEntity from 'src/modules/company/modules/vehicle/entities/vehicle-entity'
import UnityEntity from 'src/modules/company/modules/unity/entities/unity-entity'
import CompanyEntity from 'src/modules/company/entities/company-entity'
import UserEntity from 'src/modules/user/entitites/user-entity'
import TripEntity from 'src/modules/company/modules/trip/entities/trip-entity'

interface Module {
  section: string
  of_company?: boolean
  path: string
  icon: string
  title: string
  subject: string
  class: typeof BaseEntity
}

const modules: Module[] = [
  {
    section: 'administration',
    of_company: false,
    path: '/companies',
    icon: 'mdi:company',
    title: 'companies',
    subject: 'company',
    class: CompanyEntity
  },
  {
    section: 'administration',
    of_company: false,
    path: '/users',
    icon: 'fa-solid:users',
    title: 'users',
    subject: 'user',
    class: UserEntity
  },
  {
    section: 'resources',
    of_company: true,
    path: '/employees',
    icon: 'clarity:employee-line',
    title: 'employees',
    subject: 'employee',
    class: EmployeeEntity
  },
  {
    section: 'resources',
    of_company: true,
    path: '/customers',
    icon: 'icon-park-solid:peoples-two',
    title: 'customers',
    subject: 'customer',
    class: CustomerEntity
  },
  {
    section: 'resources',
    of_company: true,
    path: '/vehicles',
    icon: 'tdesign:vehicle',
    title: 'vehicles',
    subject: 'vehicle',
    class: VehicleEntity
  },
  {
    section: 'resources',
    of_company: true,
    path: '/unities',
    icon: 'ic:twotone-place',
    title: 'unities',
    subject: 'unity',
    class: UnityEntity
  },
  {
    section: 'manager',
    of_company: true,
    path: '/trips',
    icon: 'bx:trip',
    title: 'trips',
    subject: 'trip',
    class: TripEntity
  }
]

export function getModule(path: string) {
  const found = modules.find(module => module.path.replace('/', '') === path.replace('/', ''))
  if (!found) return null

  return found
}

export default modules
