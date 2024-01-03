import User from 'src/modules/user/interfaces/user'

export default interface HasUser {
  user_id: string

  user: User | null
}
