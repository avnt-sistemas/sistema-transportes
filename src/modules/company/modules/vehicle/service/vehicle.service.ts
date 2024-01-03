import { getDocs, query, where } from 'firebase/firestore/lite'
import ModelServiceWithSoftDeletes from 'src/modules/common/service/model-with-soft-deletes.service'
import Vehicle from '../interfaces/vehicle'

export default class VehicleService extends ModelServiceWithSoftDeletes<Vehicle> {
  constructor() {
    super('vehicles')
  }

  public async fetch(): Promise<Vehicle[]> {
    const collectionRef = this.getCollectionReference()
    const q = query(collectionRef, where('deleted_at', '==', null), where('type', '!=', 'trailer'))

    const querySnapshot = await getDocs(q)
    const results: Vehicle[] = []

    querySnapshot.forEach(doc => {
      results.push({ ...doc.data() } as Vehicle)
    })

    return results
  }

  async fetchVehicles(for_vehicle: string): Promise<Vehicle[]> {
    try {
      const collectionRef = this.getCollectionReference()
      const q = query(collectionRef, where('truck_id', '==', for_vehicle))

      const querySnapshot = await getDocs(q)

      const results: Vehicle[] = []

      querySnapshot.forEach(doc => {
        results.push({ ...doc.data() } as Vehicle)
      })

      return results
    } catch (error) {
      throw error
    }
  }

  async fetchTrucks(for_vehicle: string | null): Promise<Vehicle[]> {
    try {
      const collectionRef = this.getCollectionReference()
      const q = query(collectionRef, where('truck_id', '==', null), where('type', '==', 'truck'))

      const querySnapshot = await getDocs(q)

      const results: Vehicle[] = []

      querySnapshot.forEach(doc => {
        if (doc.id !== for_vehicle) results.push({ id: doc.id, ...doc.data() } as Vehicle)
      })

      return results
    } catch (error) {
      throw error
    }
  }
}
