export type StatusType = 'draft' | 'active' | 'inactive' | 'pending' | 'canceled' | 'finished'

export default interface Status {
  id: StatusType
  name: string
  color?: string
}

export const InitialStatus = {
  id: 'draft' as StatusType,
  name: 'only initialized'
}
