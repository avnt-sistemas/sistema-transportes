import Address from '../address'

export interface HasAddress {
  get data(): Address[]
  updateAddress(record: Address): void
  clearAddress(): void
}

export interface HasAddresses {
  get addresses(): Address[]
  address(index: number): Address
  clearAddresses(): void
  addAddress(record: Address): void
  removeAddress(index: number): void
  setAddress(index: number, record: Address): void
}
