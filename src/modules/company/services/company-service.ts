import { CollectionReference, DocumentData, collection, getDocs, query, where } from 'firebase/firestore/lite'
import Company from '../interfaces/company'
import ModelServiceWithSoftDeletes from 'src/modules/common/service/model-with-soft-deletes.service'

export default class CompanyService extends ModelServiceWithSoftDeletes<Company> {
  public getCollectionReference(): CollectionReference<DocumentData> {
    return collection(this.db, this.collectionName)
  }

  constructor() {
    super('companies')
  }

  async getCompanyByUrl(url: string) {
    try {
      const usersCollectionRef = this.getCollectionReference()
      const queryRef = query(usersCollectionRef, where('url', '==', url))
      const userQuerySnapshot = await getDocs(queryRef)

      if (!userQuerySnapshot.empty) {
        const doc = userQuerySnapshot.docs[0]
        const data = doc.data()

        return { ...data, id: doc.id } as Company
      }
    } catch (error) {
      console.error('Error fetching company data:', error)
    }
  }
}
