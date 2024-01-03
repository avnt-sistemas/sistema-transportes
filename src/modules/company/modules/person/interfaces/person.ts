import Address from 'src/modules/common/interfaces/address'
import Contact from 'src/modules/common/interfaces/contact'
import Document from 'src/modules/common/interfaces/document'
import HasCompany from 'src/modules/common/interfaces/has/has-company'
import HasStatus from 'src/modules/common/interfaces/has/has-status'
import SoftDeleteModel from 'src/modules/common/interfaces/soft-delete'

export default interface Person extends SoftDeleteModel, HasCompany, HasStatus {
  name: string
  addresses: Address[]
  documents: Document[]
  contacts: Contact[]
}
