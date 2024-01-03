import Model from './model'

export default interface SoftDeleteModel extends Model {
  deleted_at: Date | null
}
