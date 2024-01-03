import HasCompany from 'src/modules/common/interfaces/has/has-company'
import Model from 'src/modules/common/interfaces/model'
import Vehicle from '../../vehicle/interfaces/vehicle'
import Employee from '../../person/interfaces/employee'
import { TFunction } from 'i18next'
import Address from 'src/modules/common/interfaces/address'
import { TripStatus } from './TripStatus'

export default interface Trip extends Model, HasCompany {
  status: TripStatus
  before_status?: TripStatus | null
  status_notes?: string

  start_location: Address | null
  end_location: Address | null

  vehicle: Vehicle | null
  driver: Employee | null

  start_weight: number | 0
  end_weight: number | 0

  invoice_number: string | ''
  order_number: string | ''
}

interface TripStatusItem {
  name: string
  value: string
  icon: string
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

export function getTripStatusList(t: TFunction<'translation', undefined, 'translation'>): TripStatusItem[] {
  return [
    {
      name: t('trip_status.wait_driver'),
      value: 'wait_driver',
      icon: 'clarity:clock-solid',
      color: 'warning'
    },
    {
      name: t('trip_status.wait_load'),
      value: 'wait_load',
      icon: 'fa-solid:truck-loading',
      color: 'secondary'
    },
    {
      name: t('trip_status.loaded'),
      value: 'loaded',
      icon: 'mdi:truck-fast',
      color: 'info'
    },
    {
      name: t('trip_status.wait_unload'),
      value: 'wait_unload',
      icon: 'fa6-solid:truck-ramp-box',
      color: 'secondary'
    },
    {
      name: t('trip_status.unloaded'),
      value: 'unloaded',
      icon: 'mdi:truck-fast',
      color: 'info'
    },
    {
      name: t('trip_status.finish'),
      value: 'finish',
      icon: 'mdi:truck-check',
      color: 'success'
    },
    {
      name: t('trip_status.break'),
      value: 'break',
      icon: 'ion:restaurant',
      color: 'warning'
    },
    {
      name: t('trip_status.off_service'),
      value: 'off_service',
      icon: 'game-icons:tow-truck',
      color: 'error'
    },
    {
      name: t('trip_status.sleeping'),
      value: 'sleeping',
      icon: 'ic:baseline-airline-seat-flat',
      color: 'warning'
    }
  ]
}

export function getTripStatusItem(t: TFunction<'translation', undefined, 'translation'>, value: TripStatus) {
  const found = getTripStatusList(t).find(item => item.value === value)
  if (found) return found
  throw new Error('not found trip status item')
}
