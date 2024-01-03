import { InitialStatus } from 'src/modules/common/interfaces/status'
import Entity from 'src/modules/common/interfaces/entity'
import { TFunction } from 'i18next'
import BaseEntity from 'src/modules/common/entities/base-entity'
import Vehicle from '../interfaces/vehicle'
import { GridColDef } from '@mui/x-data-grid'
import TextColumn from 'src/modules/common/columns/text'
import { formatPlate } from 'src/@core/utils/format'
import { DynamicField } from 'src/components/form/update'
import TextField from 'src/modules/common/fields/text'
import MaskedField from 'src/modules/common/fields/masked'
import * as yup from 'yup'
import { HasVehicles } from '../interfaces/relations/has-vehicle'
import { Box, Typography } from '@mui/material'
import VehicleService from '../service/vehicle.service'

export default class RelationVehicleEntity extends BaseEntity implements Entity<Vehicle> {
  name = 'trailer'
  plural = 'trailers'

  newText = 'newa'

  ignoredProperties: string[] = ['truck', 'vehicles']

  collection!: string

  data!: Vehicle
  service!: VehicleService

  master: HasVehicles

  get id(): string | null {
    return this.data.id
  }

  constructor(t: TFunction<'translation', undefined, 'translation'>, master: HasVehicles, data?: Vehicle) {
    super(t)

    this.service = new VehicleService()

    this.master = master

    if (data) this.setData(data)
    else this.clear()
  }

  async setData(data: Vehicle) {
    this.data = {
      name: data.name || '',
      brand: data.brand || '',
      model: data.model || '',
      model_year: data.model_year || new Date().getFullYear(),
      fab_year: data.fab_year || new Date().getFullYear(),
      plate: data.plate || '',
      type: data.type || 'trailer',
      id: data.id,
      truck_id: data.truck_id || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      company_id: data.company_id,
      deleted_at: data.deleted_at,
      company: data.company || null,
      status: data.status || InitialStatus
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
      type: 'trailer',
      id: null,
      truck_id: null,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      company_id: null,
      company: null,
      status: InitialStatus
    }
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
      model: yup.string().required(),
      fab_year: yup.number().required(),
      model_year: yup.number().required()
    })
  }

  async getTrucks(): Promise<Vehicle[]> {
    return await this.service.fetchTrucks(this.id)
  }

  async save(): Promise<any> {
    if (this.id) {
      this.master.setVehicle(this.id, this.data)
    } else {
      this.data.type = 'trailer'
      this.data.id = this.master.vehicles.length.toString()
      this.master.addVehicle(this.data)
    }
  }

  async delete(): Promise<any> {
    if (this.id) {
      await this.service.delete(this.id)
      this.master.removeVehicle(this.id)
    } else throw new Error('id is required for this!')
  }
}
