import { InitialStatus } from 'src/modules/common/interfaces/status'
import Entity, { Relation } from 'src/modules/common/interfaces/entity'
import { TFunction } from 'i18next'
import BaseEntity from 'src/modules/common/entities/base-entity'
import Vehicle, { listVehicleTypes } from '../interfaces/vehicle'
import { GridColDef } from '@mui/x-data-grid'
import TextColumn from 'src/modules/common/columns/text'
import { formatPlate } from 'src/@core/utils/format'
import { DynamicField } from 'src/components/form/update'
import TextField from 'src/modules/common/fields/text'
import MaskedField from 'src/modules/common/fields/masked'
import * as yup from 'yup'
import { HasTruck, HasVehicles } from '../interfaces/relations/has-vehicle'
import AutocompleteField from 'src/modules/common/fields/autocomplete'
import { Box, Typography } from '@mui/material'
import VehicleService from '../service/vehicle.service'
import RelationVehicleEntity from './relation-vehicle-entity'

export default class VehicleEntity extends BaseEntity implements Entity<Vehicle>, HasVehicles, HasTruck {
  name = 'vehicle'
  plural = 'vehicles'

  ignoredProperties: string[] = ['truck', 'vehicles']

  collection!: string

  data!: Vehicle
  service!: VehicleService

  trucks: Vehicle[] = []
  vehiclesEntity: RelationVehicleEntity

  get id(): string | null {
    return this.data.id
  }

  constructor(t: TFunction<'translation', undefined, 'translation'>, data?: Vehicle) {
    super(t)

    this.service = new VehicleService()

    this.vehiclesEntity = new RelationVehicleEntity(t, this)

    if (data) this.setData(data)
    else this.clear()
  }

  async get(id: string) {
    const data = await this.service.get(id)

    if (data) {
      if (data.truck_id) this.data.truck = await this.service.get(data.truck_id)
      data.vehicles = await this.service.fetchVehicles(id)

      this.trucks = await this.getTrucks()

      await this.setData(data)

      return data
    }

    return null
  }

  async setData(data: Vehicle) {
    this.data = {
      name: data.name || '',
      brand: data.brand || '',
      model: data.model || '',
      model_year: data.model_year || new Date().getFullYear(),
      fab_year: data.fab_year || new Date().getFullYear(),
      plate: data.plate || '',
      type: data.type || 'truck',
      id: data.id,
      truck_id: data.truck_id || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      company_id: data.company_id,
      deleted_at: data.deleted_at,
      company: data.company || null,
      status: data.status || InitialStatus,
      vehicles: data.vehicles || []
    }
  }

  async clear() {
    this.data = {
      name: '',
      plate: '',
      brand: '',
      model: '',
      model_year: new Date().getFullYear(),
      fab_year: new Date().getFullYear(),
      type: 'truck',
      id: null,
      truck_id: null,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      company_id: null,
      company: null,
      status: InitialStatus
    }
    this.clearVehicle()
    this.clearVehicles()

    if (!this.trucks.length) this.trucks = await this.getTrucks()
  }

  columns(): GridColDef[] {
    return [
      TextColumn({
        t: this.t,
        name: 'name'
      }),
      TextColumn({
        t: this.t,
        name: 'plate',
        formatValue: row => formatPlate(row.plate)
      }),
      TextColumn({
        t: this.t,
        name: 'model',
        formatValue: row => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {row.brand}, {row.model}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {row.model_year}/{row.fab_year}
              </Typography>
            </Box>
          </Box>
        )
      })
    ]
  }

  fields(): DynamicField[] {
    return [
      {
        name: 'name',
        component: props => <TextField {...props} required />
      },
      {
        name: 'plate',
        component: props => <MaskedField {...props} mask='aaa-9*99' required saveMasked />
      },
      {
        name: 'type',
        component: props => (
          <AutocompleteField
            {...props}
            options={listVehicleTypes(this.t).filter(x => x.value !== 'trailer')}
            title='text'
            valueTag='value'
            icon='icon'
            disableClearable
          />
        )
      },
      {
        name: 'brand',
        component: props => <TextField {...props} required />
      },
      {
        name: 'model',
        component: props => <TextField {...props} required />
      },
      {
        name: 'fab_year',
        component: props => <TextField {...props} required type='number' />
      },
      {
        name: 'model_year',
        component: props => <TextField {...props} required type='number' />
      }
    ]
  }

  schema(): yup.AnyObjectSchema {
    return yup.object().shape({
      name: yup.string().required(),
      plate: yup.string().required(),
      brand: yup.string().required(),
      type: yup.string().required(),
      model: yup.string().required(),
      fab_year: yup.number().required(),
      model_year: yup.number().required()
    })
  }

  relations(): Relation[] {
    return [
      {
        title: this.vehiclesEntity.title('list'),
        data: this.vehicles,
        name: 'vehicles',
        model: this.vehiclesEntity
      }
    ]
  }

  async getTrucks(): Promise<Vehicle[]> {
    return await this.service.fetchTrucks(this.id)
  }

  //HasVehicles
  get vehicles(): Vehicle[] {
    return this.data.vehicles || []
  }

  vehicle(id: string): Vehicle {
    if (!this.data.vehicles) throw new Error('Empty vehicles.')
    const v = this.data.vehicles.find(v => v.id === id)
    if (!v) throw new Error('Not found vehicle.')

    return v
  }

  clearVehicles(): void {
    this.data.vehicles = []
  }

  addVehicle(record: Vehicle): void {
    const vehicles = [...(this.data.vehicles || [])]
    record.truck_id = this.data.id
    vehicles.push(record)
    this.data.vehicles = vehicles
  }

  removeVehicle(id: string): void {
    const vehicles = [...(this.data.vehicles || [])]
    const index = vehicles.findIndex(v => v.id === id)
    if (index >= 0) vehicles.splice(index, 1)
    this.data.vehicles = vehicles
  }

  setVehicle(id: string, record: Vehicle): void {
    const vehicles = [...(this.data.vehicles || [])]
    const vehicle = vehicles.find(v => v.id === id)
    record.truck_id = this.data.id
    if (vehicle) vehicles.push(record)
    this.data.vehicles = vehicles
  }

  //HasTruck
  get truck(): Vehicle {
    if (!this.data.truck) throw new Error('Empty truck.')

    return this.data.truck
  }

  updateTruck(record: Vehicle): void {
    this.data.truck_id = record.id
    this.data.truck = record
  }

  clearVehicle(): void {
    delete this.data.truck
  }

  async save(): Promise<any> {
    const vehicles = [...(this.data.vehicles || [])]
    const saved = await super.save()
    if (vehicles.length > 0) {
      vehicles.forEach(v => {
        v.truck_id = this.id
        if (v.id && !/^\d+$/.test(v.id)) {
          this.service.update(v.id, v)
        } else {
          v.id = null
          this.service.store(v)
        }
      })
    }

    return saved
  }

  async delete(): Promise<any> {
    if (this.id) this.removeVehicle(this.id)
    else throw new Error('id is required for this!')
  }
}
