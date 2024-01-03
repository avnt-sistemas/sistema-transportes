import User from 'src/modules/user/interfaces/user'

export interface ModelServiceInterface {
  fetch: () => Promise<any[]>
  get: (id: string) => Promise<any>
  update: (id: string, data: any, original: any) => Promise<any>
  store: (data: any) => Promise<any>
  delete: (id: string) => Promise<boolean>
  fetchWithTrashed?: () => Promise<any[]>
  fetchDeleted?: () => Promise<any[]>
  restore?: (id: string) => Promise<any>
  softDelete?: (id: string) => Promise<boolean>
}

export interface TimelineRecord {
  id?: string | null
  original?: any
  changed?: any
  type: 'update' | 'created'
  user: Partial<User> | null
  created_at: Date
}
