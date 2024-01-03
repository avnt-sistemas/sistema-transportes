import { InitialStatus } from 'src/modules/common/interfaces/status'
import Entity, { Relation } from 'src/modules/common/interfaces/entity'

import { TFunction } from 'i18next'
import { HasAddresses } from 'src/modules/common/interfaces/relations/has-address'
import BaseEntity from 'src/modules/common/entities/base-entity'
import { HasDocuments } from 'src/modules/common/interfaces/relations/has-document'
import { HasContacts } from 'src/modules/common/interfaces/relations/has-contact'
import Company from '../interfaces/company'
import AddressEntity from '../modules/person/entities/address-entity'
import DocumentEntity from '../modules/person/entities/document-entity'
import ContactEntity from '../modules/person/entities/contact-entity'
import Address from 'src/modules/common/interfaces/address'
import Contact from 'src/modules/common/interfaces/contact'
import Document from 'src/modules/common/interfaces/document'
import CompanyService from '../services/company-service'
import { DynamicField } from 'src/components/form/update'
import TextField from 'src/modules/common/fields/text'
import MaskedField from 'src/modules/common/fields/masked'
import { GridColDef } from '@mui/x-data-grid'
import TextColumn from 'src/modules/common/columns/text'
import { formatCNPJ } from 'src/@core/utils/format'

export default class CompanyEntity
  extends BaseEntity
  implements Entity<Company>, HasAddresses, HasDocuments, HasContacts
{
  name = 'company'
  plural = 'companies'

  collection!: string

  data!: Company
  service!: CompanyService

  addressEntity: AddressEntity
  documentEntity: DocumentEntity
  contactEntity: ContactEntity

  constructor(t: TFunction<'translation', undefined, 'translation'>, data?: Company) {
    super(t)

    if (data) this.setData(data)
    else this.clear()

    this.service = new CompanyService()

    this.contactEntity = new ContactEntity(this.t, this)
    this.addressEntity = new AddressEntity(this.t, this)
    this.documentEntity = new DocumentEntity(this.t, this)
  }

  setData(data: Company) {
    this.data = {
      id: data.id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      deleted_at: data.deleted_at,
      name: data.name || '',
      business_name: data.business_name || '',
      document: data.document || '',
      url: data.url,
      addresses: data.addresses || [],
      documents: data.documents || [],
      contacts: data.contacts || [],
      status: data.status || InitialStatus,
      settings: data.settings || null
    }
  }

  clear() {
    this.data = {
      name: '',
      business_name: '',
      document: '',
      url: '',
      addresses: [] as Address[],
      documents: [] as Document[],
      contacts: [] as Contact[],
      id: null,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      status: InitialStatus,
      settings: null
    }

    if (this.contactEntity) this.contactEntity.clear()
    if (this.addressEntity) this.addressEntity.clear()
    if (this.documentEntity) this.documentEntity.clear()
  }

  fields(): DynamicField[] {
    return [
      {
        name: 'name',
        component: props => <TextField {...props} required />
      },
      {
        name: 'business_name',
        component: props => <TextField {...props} required />
      },
      {
        name: 'document',
        component: props => <MaskedField {...props} label={'CNPJ'} mask='99.999.999/9999-99' />
      },
      {
        name: 'url',
        component: props => <TextField {...props} required />
      }
    ]
  }

  columns(): GridColDef[] {
    return [
      TextColumn({
        name: 'name',
        t: this.t
      }),
      TextColumn({
        name: 'business_name',
        t: this.t
      }),
      TextColumn({
        name: 'document',
        headerName: 'CNPJ',
        t: this.t,
        formatValue: row => formatCNPJ(row.document)
      })
    ]
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
