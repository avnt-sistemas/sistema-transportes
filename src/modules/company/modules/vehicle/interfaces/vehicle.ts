import { TFunction } from 'i18next'
import HasCompany from 'src/modules/common/interfaces/has/has-company'
import HasStatus from 'src/modules/common/interfaces/has/has-status'
import SoftDeleteModel from 'src/modules/common/interfaces/soft-delete'

type VehicleType = 'car' | 'truck' | 'van' | 'trailer'

interface VehicleTypeItem {
  text: string
  icon: string
  color: string
  value: VehicleType
}

export default interface Vehicle extends SoftDeleteModel, HasStatus, HasCompany {
  name: string
  plate: string
  brand: string
  model: string
  model_year: number
  fab_year: number
  type: VehicleType
  truck_id: string | null

  vehicles?: Vehicle[]
  truck?: Vehicle | null
}

export function listVehicleTypes(t: TFunction<'translation', undefined, 'translation'>): VehicleTypeItem[] {
  return [
    {
      text: t('car'),
      value: 'car',
      icon: 'gis:car',
      color: 'secondary'
    },
    {
      text: t('truck'),
      value: 'truck',
      icon: 'fontisto:truck',
      color: 'info'
    },
    {
      text: t('van'),
      value: 'van',
      icon: 'ph:van-fill',
      color: 'warning'
    },
    {
      text: t('trailer'),
      value: 'trailer',
      icon: 'fa-solid:trailer',
      color: 'error'
    }
  ]
}
