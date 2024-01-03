import Vehicle from '../vehicle'

export interface HasTruck {
  get truck(): Vehicle
  updateTruck(record: Vehicle): void
  clearVehicle(): void
}

export interface HasVehicles {
  get vehicles(): Vehicle[]
  vehicle(id: string): Vehicle
  clearVehicles(): void
  addVehicle(record: Vehicle): void
  removeVehicle(id: string): void
  setVehicle(id: string, record: Vehicle): void
}
