import Contact from '../contact'

export interface HasContact {
  get data(): Contact[]
  updateContact(record: Contact): void
  clearContact(): void
}

export interface HasContacts {
  get contacts(): Contact[]
  contact(index: number): Contact
  clearContacts(): void
  addContact(record: Contact): void
  removeContact(index: number): void
  setContact(index: number, record: Contact): void
}
