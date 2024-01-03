import { InitialStatus } from 'src/modules/common/interfaces/status'
import Person from '../interfaces/person'
import Entity, { Relation } from 'src/modules/common/interfaces/entity'
import ModelServiceWithSoftDeletes from 'src/modules/common/service/model-with-soft-deletes.service'

import { TFunction } from 'i18next'
import AddressEntity from './address-entity'
import { HasAddresses } from 'src/modules/common/interfaces/relations/has-address'
import Address from 'src/modules/common/interfaces/address'
import Contact from 'src/modules/common/interfaces/contact'
import Document from 'src/modules/common/interfaces/document'
import BaseEntity from 'src/modules/common/entities/base-entity'
import DocumentEntity from './document-entity'
import { HasDocuments } from 'src/modules/common/interfaces/relations/has-document'
import { HasContacts } from 'src/modules/common/interfaces/relations/has-contact'
import ContactEntity from './contact-entity'

export default class PersonEntity
  extends BaseEntity
  implements Entity<Person>, HasAddresses, HasDocuments, HasContacts
{
  name = 'person'
  plural = 'people'

  collection!: string

  data!: Person
  service!: ModelServiceWithSoftDeletes<Person>

  addressEntity: AddressEntity
  documentEntity: DocumentEntity
  contactEntity: ContactEntity

  constructor(t: TFunction<'translation', undefined, 'translation'>, data?: Person) {
    super(t)

    if (data) this.setData(data)
    else this.clear()

    this.addressEntity = new AddressEntity(t, this)
    this.contactEntity = new ContactEntity(t, this)
    this.documentEntity = new DocumentEntity(t, this)
  }

  setData(data: Person) {
    this.data = {
      name: data.name || '',
      addresses: data.addresses || [],
      documents: data.documents || [],
      contacts: data.contacts || [],
      deleted_at: data.deleted_at,
      id: data.id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      company_id: data.company_id,
      company: data.company,
      status: data.status || InitialStatus
    }
  }

  clear() {
    this.data = {
      name: '',
      addresses: [] as Address[],
      documents: [] as Document[],
      contacts: [] as Contact[],
      deleted_at: null,
      id: null,
      created_at: null,
      updated_at: null,
      company_id: null,
      company: null,
      status: InitialStatus
    }

    this.contactEntity = new ContactEntity(this.t, this)
    this.addressEntity = new AddressEntity(this.t, this)
    this.documentEntity = new DocumentEntity(this.t, this)
  }

  relations(): Relation[] {
    return [
      {
        name: 'addresses',
        data: this.addresses,
        model: this.addressEntity,
        title: this.addressEntity.title('list')
      },
      {
        name: 'documents',
        data: this.documents,
        model: this.documentEntity,
        title: this.documentEntity.title('list')
      },
      {
        name: 'contacts',
        data: this.contacts,
        model: this.contactEntity,
        title: this.contactEntity.title('list')
      }
    ]
  }

  //HasAddresses
  get addresses(): Address[] {
    return this.data.addresses
  }
  address(index: number): Address {
    return this.addresses[index]
  }

  addAddress(record: Address) {
    const addresses = [...this.addresses]
    addresses.push({ ...record })
    this.data.addresses = addresses
  }
  clearAddresses(): void {
    this.data.addresses = [] as Address[]
  }
  removeAddress(id: number): void {
    const addresses = [...this.addresses]
    const index = addresses.findIndex(address => address.id === id)
    if (index >= 0) addresses.splice(index, 1)
    this.data.addresses = addresses
  }
  setAddress(id: number, record: Address): void {
    const addresses = [...this.addresses]
    const index = addresses.findIndex(address => address.id === id)
    if (index >= 0) addresses[index] = record
    this.data.addresses = addresses
  }

  //HasDocuments
  get documents(): Document[] {
    return this.data.documents
  }

  document(index: number): Document {
    return this.documents[index]
  }

  clearDocuments(): void {
    this.data.documents = [] as Document[]
  }

  addDocument(record: Document): void {
    const documents = [...this.documents]
    documents.push({ ...record })
    this.data.documents = documents
  }

  removeDocument(id: number): void {
    const documents = [...this.documents]
    const index = documents.findIndex(document => document.id === id)
    if (index >= 0) documents.splice(index, 1)
    this.data.documents = documents
  }

  setDocument(id: number, record: Document): void {
    const documents = [...this.documents]
    const index = documents.findIndex(document => document.id === id)
    if (index >= 0) documents[index] = record
    this.data.documents = documents
  }

  //HasContact
  get contacts(): Contact[] {
    return this.data.contacts
  }
  contact(index: number): Contact {
    return this.contacts[index]
  }
  clearContacts(): void {
    this.data.contacts = [] as Contact[]
  }
  addContact(record: Contact): void {
    const contacts = [...this.contacts]
    contacts.push({ ...record })
    this.data.contacts = contacts
  }
  removeContact(id: number): void {
    const contacts = [...this.contacts]
    const index = contacts.findIndex(contact => contact.id === id)
    if (index >= 0) contacts.splice(index, 1)
    this.data.contacts = contacts
  }
  setContact(id: number, record: Contact): void {
    const contacts = [...this.contacts]
    const index = contacts.findIndex(contact => contact.id === id)
    if (index >= 0) contacts[index] = record
    this.data.contacts = contacts
  }
}
