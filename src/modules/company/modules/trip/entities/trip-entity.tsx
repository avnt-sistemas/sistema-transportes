import Entity, { Relation } from 'src/modules/common/interfaces/entity'
import { TFunction } from 'i18next'
import BaseEntity from 'src/modules/common/entities/base-entity'
import { GridColDef } from '@mui/x-data-grid'
import TextColumn from 'src/modules/common/columns/text'
import { DynamicField } from 'src/components/form/update'
import * as yup from 'yup'
import Trip, { getTripStatusItem } from '../interfaces/trip'
import { TripProblemStatus, TripStatus, nextStatus } from '../interfaces/TripStatus'
import LocationField from 'src/modules/common/fields/location'
import AutocompleteField from 'src/modules/common/fields/autocomplete'
import EmployeeEntity from '../../person/entities/employee-entity'
import Employee from '../../person/interfaces/employee'
import Vehicle from '../../vehicle/interfaces/vehicle'
import VehicleEntity from '../../vehicle/entities/vehicle-entity'
import { Box, Breakpoint } from '@mui/system'
import { Chip, Typography } from '@mui/material'
import { formatCPF, formatPlate } from 'src/@core/utils/format'
import IconifyIcon from 'src/@core/components/icon'
import TripService from '../services/trip-service'

export default class TripEntity extends BaseEntity implements Entity<Trip> {
  name = 'trip'
  plural = 'trips'

  isRelation = false

  newText = 'newa'

  modalWidth: Breakpoint | false = 'md'

  ignoredProperties: string[] = ['truck', 'trips']

  collection!: string

  data!: Trip
  service!: TripService

  drivers!: Employee[]
  trucks!: Vehicle[]

  get id(): string | null {
    return this.data.id
  }

  constructor(t: TFunction<'translation', undefined, 'translation'>, data?: Trip) {
    super(t)

    this.service = new TripService()

    if (data) this.setData(data)
    else this.clear()
  }

  async get(id: string) {
    const data = await this.service.get(id)

    if (data) {
      await this.setData(data)

      return data
    }

    return null
  }

  setData(data: Trip) {
    this.data = {
      id: data.id || null,
      start_location: data.start_location || null,
      end_location: data.end_location || null,
      vehicle: data.vehicle || null,
      driver: data.driver || null,
      start_weight: data.start_weight || 0,
      end_weight: data.end_weight || 0,
      invoice_number: data.invoice_number || '',
      order_number: data.order_number || '',
      status: data.status || 'wait_driver',
      created_at: data.created_at || null,
      updated_at: data.updated_at || null,
      company_id: data.company_id || null,
      company: data.company || null,
      before_status: data.before_status || null,
      status_notes: data.status_notes || undefined
    }

    this.original = { ...this.data }

    return this
  }

  clear() {
    this.data = {
      id: null,
      start_location: null,
      end_location: null,
      driver: null,
      end_weight: 0,
      start_weight: 0,
      invoice_number: '',
      order_number: '',
      vehicle: null,
      status: 'wait_driver',
      before_status: null,
      status_notes: undefined,
      created_at: null,
      updated_at: null,
      company_id: null,
      company: null
    }

    return this
  }

  columns(): GridColDef[] {
    return [
      TextColumn({
        name: 'driver',
        t: this.t,
        minWidth: 180,
        formatValue: row =>
          row.driver ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {row.driver.name}
                </Typography>
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {formatCPF(row.driver.document || '')}
                </Typography>
              </Box>
            </Box>
          ) : null
      }),
      TextColumn({
        name: 'start_location',
        t: this.t,
        minWidth: 250,
        formatValue: row =>
          row.start_location ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {row.start_location.street}, {row.start_location.number}
                </Typography>
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {row.start_location.city} - {row.start_location.state}
                </Typography>
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {row.start_location.postalCode}
                </Typography>
              </Box>
            </Box>
          ) : null
      }),
      TextColumn({
        name: 'end_location',
        t: this.t,
        minWidth: 250,
        formatValue: row =>
          row.end_location ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {row.end_location.street}, {row.end_location.number}
                </Typography>
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {row.end_location.city} - {row.end_location.state}
                </Typography>
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {row.end_location.postalCode}
                </Typography>
              </Box>
            </Box>
          ) : null
      }),
      TextColumn({
        name: 'status',
        t: this.t,
        minWidth: 200,
        formatValue: row => {
          const statusItem = getTripStatusItem(this.t, row.status as TripStatus)

          return (
            <Chip
              color={statusItem.color}
              icon={<IconifyIcon icon={statusItem.icon} color='#efefef' />}
              label={statusItem.name}
            />
          )
        }
      }),
      TextColumn({
        name: 'vehicle',
        t: this.t,
        minWidth: 120,
        formatValue: row =>
          row.vehicle ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {row.vehicle.name}
                </Typography>
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {formatPlate(row.vehicle.plate || '')}
                </Typography>
              </Box>
            </Box>
          ) : null
      })
    ]
  }

  async fields(): Promise<DynamicField[]> {
    await this.getDrivers()
    await this.getTrucks()

    return [
      {
        name: 'driver',
        component: props => (
          <AutocompleteField
            {...props}
            options={this.drivers}
            disableClearable
            required
            title='name'
            subtitle='document'
          />
        )
      },
      {
        name: 'vehicle',
        component: props => (
          <AutocompleteField {...props} options={this.trucks} disableClearable required title='name' subtitle='plate' />
        )
      },
      {
        name: 'start_location',
        component: props => <LocationField {...props} disableClearable required />
      },
      {
        name: 'end_location',
        component: props => <LocationField {...props} disableClearable required />
      }
    ]
  }

  schema(): yup.AnyObjectSchema {
    return yup.object().shape({
      start_location: yup.object().required(),
      end_location: yup.object().required(),
      driver: yup.object().required(),
      vehicle: yup.object().required()
    })
  }

  relations(): Relation[] {
    return []
  }

  async getDrivers() {
    if (!this.drivers) {
      const employeeEntity = new EmployeeEntity(this.t)

      this.drivers = (await employeeEntity.service.fetch()).filter(e => e.role && e.role.name === 'driver')
    }
  }

  async getTrucks() {
    if (!this.trucks) {
      const vehicleEntity = new VehicleEntity(this.t)

      this.trucks = await vehicleEntity.getTrucks()
    }
  }

  goToNextStatus() {
    if (this.data.status) {
      this.data.before_status = this.data.status
      this.data.status = nextStatus(this.data)
    }

    return this
  }

  goToStatus(status: TripStatus, notes?: string) {
    this.data.before_status = this.data.status
    this.data.status = status
    this.data.status_notes = notes

    return this
  }

  goToPriorStatus() {
    if (this.data.before_status) {
      this.data.status = this.data.before_status
    }

    return this
  }

  informProblem(problem: TripProblemStatus, notes?: string) {
    this.goToStatus(problem, notes)

    return this
  }
}
