import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  DocumentData,
  DocumentSnapshot,
  Timestamp,
  addDoc,
  QuerySnapshot,
  getDocs,
  query,
  where,
  CollectionReference
} from 'firebase/firestore/lite'
import User from './interfaces/user'
import { UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import Company from '../company/interfaces/company'
import BaseService from '../common/service/base-service'
import CompanyService from '../company/services/company-service'
import RoleService from '../role/services/role-service'

export default class UserService extends BaseService {
  constructor() {
    super('users')
  }

  public getCollectionReference(): CollectionReference<DocumentData> {
    return collection(this.db, this.collectionName)
  }

  public login(email: string, password: string): Promise<UserCredential> {
    return new Promise<UserCredential>(async (resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then(async userCredential => {
          const user = await this.getLoggedUser()
          if (!user || !user.active) {
            this.logout()
            throw new Error('User inactive')
          }
          resolve(userCredential)
        })
        .catch(error => {
          const errorCode = error.code
          const errorMessage = error.message
          console.error(errorCode, errorMessage)

          reject(error)
        })
    })
  }

  public loginWithDocument(document: string): Promise<UserCredential> {
    return new Promise<UserCredential>(async (resolve, reject) => {
      const user = await this.getByDocument(document)

      if (!user) {
        reject('User not found!')

        return
      }

      signInWithEmailAndPassword(this.auth, user.email!, user.password!)
        .then(async userCredential => {
          const user = await this.getLoggedUser()
          if (!user || !user.active) {
            this.logout()
            throw new Error('User inactive')
          }
          resolve(userCredential)
        })
        .catch(error => {
          const errorCode = error.code
          const errorMessage = error.message
          console.error(errorCode, errorMessage)

          reject(error)
        })
    })
  }

  public async isLogged(): Promise<boolean> {
    await this.auth.authStateReady()

    return this.auth.currentUser !== null
  }

  public async getLoggedUser(): Promise<User | null> {
    await this.auth.authStateReady()

    if (await this.isLogged()) {
      try {
        const usersCollectionRef = collection(this.db, 'users')
        const queryRef = query(usersCollectionRef, where('auth_id', '==', this.auth.currentUser!.uid))
        const userQuerySnapshot = await getDocs(queryRef)

        const roleService = new RoleService()

        if (!userQuerySnapshot.empty) {
          const userDoc = userQuerySnapshot.docs[0]
          const userData = userDoc.data()

          const role = await roleService.get(userData.role_id)

          if (role) userData.role = role

          return { ...userData, id: userDoc.id } as User
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    return null
  }

  public logout(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      signOut(this.auth)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  public register(data: {
    email: string
    password: string
    displayName: string
    role_id: string
    company_id?: string | null
  }): Promise<UserCredential> {
    return new Promise<UserCredential>(async (resolve, reject) => {
      try {
        const currentUser = { ...this.auth.currentUser! }

        const userCredential = await createUserWithEmailAndPassword(this.auth, data.email!, data.password!)

        await this.auth.updateCurrentUser(currentUser)

        resolve(userCredential)
      } catch (error) {
        console.error('Error creating user:', error)
        reject(error)
      }
    })
  }

  public async fetch(): Promise<User[]> {
    try {
      const collectionRef = this.getCollectionReference()
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(collectionRef)

      const results: User[] = []

      querySnapshot.forEach(doc => {
        results.push({ ...doc.data(), id: doc.id } as User)
      })

      return results
    } catch (error) {
      throw error
    }
  }

  public async get(id: string): Promise<User> {
    try {
      const docRef = doc(this.getCollectionReference(), id)
      const snapshot: DocumentSnapshot<DocumentData> = await getDoc(docRef)

      if (snapshot.exists()) {
        const data = snapshot.data()

        if (data && data.deleted_at) {
          throw new Error('404')
        }

        return { id: snapshot.id, ...data } as User
      } else {
        throw new Error('404')
      }
    } catch (error) {
      throw error
    }
  }
  public async getByDocument(document: string): Promise<User> {
    const collectionRef = this.getCollectionReference()
    const q = query(collectionRef, where('document', '==', document))

    const querySnapshot = await getDocs(q)
    const results: User[] = []

    querySnapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() } as User)
    })

    return results[0]
  }

  public async active(id: string): Promise<void> {
    try {
      const data = {
        updated_at: Timestamp.now().toDate(),
        active: true
      }

      const docRef = doc(this.getCollectionReference(), id)
      await setDoc(docRef, data)
    } catch (error) {
      throw error
    }
  }

  public async inactive(id: string): Promise<void> {
    try {
      const data = {
        updated_at: Timestamp.now().toDate(),
        active: false
      }

      const docRef = doc(this.getCollectionReference(), id)
      await setDoc(docRef, data)
    } catch (error) {
      throw error
    }
  }

  public async put(id: string, data: User): Promise<User> {
    try {
      data.updated_at = Timestamp.now().toDate()
      const docRef = doc(this.getCollectionReference(), id)
      await setDoc(docRef, data)

      return data
    } catch (error) {
      throw error
    }
  }

  public async store(data: User): Promise<User> {
    try {
      data.password = '12345678' //btoa(new Date().toLocaleDateString())

      const userCredential = await this.register({
        email: data.email!,
        password: data.password,
        displayName: data.displayName!,
        role_id: data.role_id!,
        company_id: data.company_id
      })

      const newData = {
        ...data,
        active: true,
        auth_id: userCredential.user.uid,
        company_id: data.company_id || null,
        id: null,
        phoneNumber: '',
        photoURL: '',
        providerId: userCredential.providerId,
        role_id: data.role_id
      }

      newData.created_at = Timestamp.now().toDate()
      newData.updated_at = newData.created_at

      const docRef = await addDoc(this.getCollectionReference(), newData)
      const insertedData = await getDoc(docRef)
      await setDoc(docRef, { ...insertedData.data(), id: docRef.id })

      return { ...insertedData.data(), id: docRef.id } as User
    } catch (error) {
      throw error
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const docRef = doc(this.getCollectionReference(), id)
      const snapshot = await getDoc(docRef)

      if (snapshot.exists()) {
        await deleteDoc(docRef)

        return true
      } else {
        return false
      }
    } catch (error) {
      throw error
    }
  }

  public async getUserCompany(id?: string): Promise<Company | null> {
    let user: User | null

    if (!id) {
      user = await this.getLoggedUser()
    } else user = await this.get(id)

    if (!user) return null

    if (!user.company_id || user.company_id === null) return null

    const companyService = new CompanyService()

    return await companyService.get(user.company_id)
  }
}
