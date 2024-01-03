import { getDocs, query, where } from 'firebase/firestore/lite'
import Trip from '../interfaces/trip'
import ModelService from 'src/modules/common/service/model.service'

export default class TripService extends ModelService<Trip> {
  constructor() {
    super('trips')
  }

  async getDriverTrips(driver_id: string) {
    try {
      const usersCollectionRef = this.getCollectionReference()
      const queryRef = query(usersCollectionRef, where('driver.id', '==', driver_id))
      const querySnapshot = await getDocs(queryRef)

      const results: Trip[] = []

      querySnapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() } as Trip)
      })

      return results
    } catch (error) {
      console.error('Error fetching driver trip data:', error)
    }
  }
}
