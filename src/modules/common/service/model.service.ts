import Model from '../interfaces/model'
import {
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
  where
} from 'firebase/firestore/lite'
import { ModelServiceInterface, TimelineRecord } from './interfaces'
import BaseService from './base-service'
import { isEmpty, isObject, objectDiff, removeEmptyValues, removeUndefinedValues } from 'src/@core/utils/object'

export default class ModelService<T extends Model> extends BaseService implements ModelServiceInterface {
  public async fetch(): Promise<T[]> {
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

  public async get(id: string): Promise<T | null> {
    try {
      const docRef = doc(this.getCollectionReference(), id)
      const snapshot: DocumentSnapshot<DocumentData> = await getDoc(docRef)

      if (snapshot.exists()) {
        const data = snapshot.data()

        if (data && data.deleted_at) {
          throw new Error('404')
        }

        return { id: snapshot.id, ...data } as T
      } else {
        return null
      }
    } catch (error) {
      throw error
    }
  }

  public async update(id: string, data: T, original: any): Promise<T> {
    try {
      data.updated_at = Timestamp.now().toDate()
      const docRef = doc(this.getCollectionReference(), id)
      await setDoc(docRef, data)

      this.saveTimeline(docRef.id, 'update', original, data)

      return data
    } catch (error) {
      throw error
    }
  }

  public async store(data: T): Promise<T> {
    try {
      data.created_at = Timestamp.now().toDate()
      data.updated_at = data.created_at

      const storeData = removeUndefinedValues(data)

      const docRef = await addDoc(this.getCollectionReference(), storeData)
      const insertedData = await getDoc(docRef)
      await setDoc(docRef, { ...insertedData.data(), id: docRef.id })

      this.saveTimeline(docRef.id, 'created', { ...insertedData.data(), id: docRef.id })

      return { ...insertedData.data(), id: docRef.id } as T
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

  public async getFromLoggedUser(): Promise<T | undefined> {
    try {
      const item = window.localStorage.getItem('userData')
      const user = item ? JSON.parse(item) : null

      const usersCollectionRef = this.getCollectionReference()
      const queryRef = query(usersCollectionRef, where('auth_id', '==', user!.auth_id))
      const userQuerySnapshot = await getDocs(queryRef)

      if (!userQuerySnapshot.empty) {
        const doc = userQuerySnapshot.docs[0]
        const data = doc.data()

        return { ...data, id: doc.id } as T
      }
    } catch (error) {
      console.error('Error fetching T data:', error)
    }
  }

  async saveTimeline(record_id: string, type: 'update' | 'created', original: any, changed?: any): Promise<void> {
    const u = this.loggedUser

    let originalForSave: any = { ...removeEmptyValues(original) }

    //get only original values from changed values
    if (changed) {
      delete changed.created_at
      delete changed.updated_at

      changed = objectDiff(original, changed)

      if (!isEmpty(changed)) {
        const _ = (c: any, o: any) => {
          const s: any = {}
          for (const [key, value] of Object.entries(c)) {
            if (isObject(value) && isObject(o) && isObject(o[key])) {
              s[key] = _(value, o[key])
            } else s[key] = isObject(o) ? o[key] : null
          }

          return s
        }

        delete original.created_at
        delete original.updated_at
        originalForSave = _(changed, original)

        const timeline: TimelineRecord = {
          original: originalForSave,
          changed,
          type,
          user: { email: u?.email, displayName: u?.displayName, id: u?.id, auth_id: u?.auth_id },
          created_at: Timestamp.now().toDate()
        }

        const timelineRef = await addDoc(this.getCollectionTimelineReference(record_id), timeline)
        const insertedTimelineData = await getDoc(timelineRef)
        await setDoc(timelineRef, { ...insertedTimelineData.data(), id: timelineRef.id })
      }
    } else if (originalForSave) {
      const timeline: TimelineRecord = {
        original: originalForSave,
        type,
        user: { email: u?.email, displayName: u?.displayName },
        created_at: Timestamp.now().toDate()
      }

      const timelineRef = await addDoc(this.getCollectionTimelineReference(record_id), timeline)
      const insertedTimelineData = await getDoc(timelineRef)
      await setDoc(timelineRef, { ...insertedTimelineData.data(), id: timelineRef.id })
    }
  }
}
