import { GridColDef } from '@mui/x-data-grid'
import { TFunction } from 'i18next'
import { DynamicField } from 'src/components/form/update'
import { AnyObjectSchema } from 'yup'
import { ModelServiceInterface } from '../service/interfaces'

export interface Relation {
  name: string
  title?: string
  icon?: string
  data: any[]
  model: Entity<any>
  readOnly?: boolean | true
}

export default interface Entity<T> {
  name: string
  plural: string

  service?: ModelServiceInterface
  master?: any

  data: T

  get id(): number | string | null

  setData(data: any): void
  clear(): void

  fetch(): Promise<any[]> | any[]
  get(id: any): any
  save(): Promise<any> | any
  delete(): Promise<any> | any

  title(type: 'list' | 'form', t?: TFunction<'translation', undefined, 'translation'>): string

  cloneFrom?(id: string | number): void
  cloneTo?(id: string | number): any

  schema?(): AnyObjectSchema

  fields(t?: TFunction<'translation', undefined, 'translation'>): DynamicField[] | Promise<DynamicField[]>
  columns(t?: TFunction<'translation', undefined, 'translation'>): GridColDef[] | Promise<GridColDef[]>
  relations?(): Relation[]

  ignoredProperties?: string[]
}
