import {
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore/lite'
import ModelService from './model.service'
import SoftDeleteModel from '../interfaces/soft-delete'
import { ModelServiceInterface } from './interfaces'

export default class ModelServiceWithSoftDeletes<T extends SoftDeleteModel>
  extends ModelService<T>
  implements ModelServiceInterface
{
  public async fetch(): Promise<T[]> {
    const collectionRef = this.getCollectionReference()
    const q = query(collectionRef, where('deleted_at', '==', null))

    const querySnapshot = await getDocs(q)
    const results: T[] = []

    querySnapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() } as T)
    })

    return results
  }

  public async fetchWithTrashed(): Promise<T[]> {
    try {
      const collectionRef = this.getCollectionReference()
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(collectionRef)

      const results: T[] = []

      querySnapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() } as T)
      })

      return results
    } catch (error) {
      throw error
    }
  }

  public async fetchDeleted(): Promise<T[]> {
    const collectionRef = this.getCollectionReference()
    const q = query(collectionRef, where('deleted_at', '!=', null), where('deleted_at', '!=', undefined))

    const querySnapshot = await getDocs(q)
    const results: T[] = []

    querySnapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() } as T)
    })

    return results
  }
  public async restore(id: string): Promise<T> {
    try {
      const docRef = doc(this.getCollectionReference(), id)
      const snapshot: DocumentSnapshot<DocumentData> = await getDoc(docRef)

      if (snapshot.exists()) {
        await updateDoc(docRef, { deleted_at: null, updated_at: Timestamp.now().toDate() })

        const updatedSnapshot = await getDoc(docRef)

        if (updatedSnapshot.exists()) {
          return { id: updatedSnapshot.id, ...updatedSnapshot.data() } as T
        } else {
          throw new Error('404')
        }
      } else {
        throw new Error('404')
      }
    } catch (error) {
      throw error
    }
  }

  public async softDelete(id: string): Promise<boolean> {
    try {
      const docRef = doc(this.getCollectionReference(), id)
      const snapshot: DocumentSnapshot<DocumentData> = await getDoc(docRef)

      if (snapshot.exists()) {
        await updateDoc(docRef, { deleted_at: Timestamp.now().toDate() })

        return true
      } else {
        return false
      }
    } catch (error) {
      throw error
    }
  }
}
