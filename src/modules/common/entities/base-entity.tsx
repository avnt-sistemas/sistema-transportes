import { TFunction } from 'i18next'
import Entity from '../interfaces/entity'
import { GridColDef } from '@mui/x-data-grid'
import { DynamicField } from 'src/components/form/update'
import { ModelServiceInterface } from '../service/interfaces'
import { Breakpoint, capitalize } from '@mui/material'

export default class BaseEntity implements Entity<any> {
  name!: string
  plural!: string

  newText = 'new'

  modalWidth?: Breakpoint | false = 'xs'

  ignoredProperties: string[] = []

  service!: ModelServiceInterface

  t: TFunction<'translation', undefined, 'translation'>

  constructor(t: TFunction<'translation', undefined, 'translation'>) {
    this.t = t
  }

  master?: any
  data: any
  original: any = {}

  get id(): string | number | null {
    return this.data.id
  }

  setData(data: any): void {
    console.error('params', data)
    throw new Error('Method not implemented.')
  }
  clear(): void {
    throw new Error('Method not implemented.')
  }

  fields(t?: TFunction<'translation', undefined, 'translation'> | undefined): DynamicField[] | Promise<DynamicField[]> {
    console.error('params', t)
    throw new Error('Method not implemented.')
  }
  columns(t?: TFunction<'translation', undefined, 'translation'> | undefined): GridColDef[] | Promise<GridColDef[]> {
    console.error('params', t)
    throw new Error('Method not implemented.')
  }

  async fetch(): Promise<any[]> {
    return this.service.fetch()
  }

  async get(id: string | number) {
    const data = await this.service.get(id as string)
    this.setData(data)

    this.original = { ...data }

    return data
  }

  async save() {
    if (this.ignoredProperties) {
      this.ignoredProperties.forEach(prop => {
        delete this.data[prop]
      })
    }

    //remove undefined props
    const keys = Object.keys(this.data)
    Object.values(this.data).forEach((value, i) => {
      if (value === undefined) delete this.data[keys[i]]
    })

    const promise =
      this.id && typeof this.id === 'string'
        ? this.service.update(this.id, this.data, this.original)
        : this.service.store(this.data)

    promise.then(resp => {
      if (!this.id) this.original = { ...resp }
      this.setData(resp)
    })

    return promise
  }

  async delete() {
    if (!this.id || typeof this.id !== 'string') throw new Error('id is required for this!')
    const promise = this.service.delete(this.id)
    promise.then(() => this.clear())

    return promise
  }

  title(type: 'list' | 'form') {
    switch (type) {
      case 'list':
        return capitalize(this.t(this.plural))
      case 'form':
        if (!this.id) return capitalize(this.t(this.newText) + ' ' + capitalize(this.t(this.name)))

        return capitalize(this.t('update')) + ' ' + capitalize(this.t(this.name))
    }
  }
}
