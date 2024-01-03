import { initializeApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { CollectionReference, DocumentData, Firestore, collection, getFirestore } from 'firebase/firestore/lite'
import { FirebaseCredentials } from 'src/configs/auth'
import User from 'src/modules/user/interfaces/user'

export default class BaseService {
  collectionName = ''
  db: Firestore
  auth: Auth

  constructor(collectionName?: string) {
    if (collectionName) this.collectionName = collectionName

    const firebaseApp = initializeApp(FirebaseCredentials)
    this.db = getFirestore(firebaseApp)
    this.auth = getAuth(firebaseApp)
  }

  get collectionPath(): string {
    const user = this.loggedUser
    if (user && user.company_id) return `companies/${user.company_id}/${this.collectionName}`

    return this.collectionName
  }

  get loggedUser(): User | null {
    const item = window.localStorage.getItem('userData')
    const user = item ? JSON.parse(item) : null

    return user
  }

  public getCollectionReference(): CollectionReference<DocumentData> {
    return collection(this.db, this.collectionPath)
  }

  public getCollectionTimelineReference(record_id: string): CollectionReference<DocumentData> {
    return collection(this.db, `${this.collectionPath}/${record_id}/timeline`)
  }
}
