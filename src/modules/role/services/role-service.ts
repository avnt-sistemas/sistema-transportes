import { CollectionReference, DocumentData, collection } from 'firebase/firestore/lite'
import Role from '../interfaces/role'
import ModelService from 'src/modules/common/service/model.service'

export default class RoleService extends ModelService<Role> {
  public getCollectionReference(): CollectionReference<DocumentData> {
    return collection(this.db, this.collectionName)
  }

  constructor() {
    super('roles')
  }
}
