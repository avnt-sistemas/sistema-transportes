import { Settings } from 'src/@core/context/settingsContext'
import Address from 'src/modules/common/interfaces/address'
import Contact from 'src/modules/common/interfaces/contact'
import Document from 'src/modules/common/interfaces/document'
import HasStatus from 'src/modules/common/interfaces/has/has-status'
import SoftDeleteModel from 'src/modules/common/interfaces/soft-delete'

export default interface Company extends SoftDeleteModel, HasStatus {
  name: string
  business_name: string
  document: string

  url?: string
  settings: Settings | null

  addresses: Address[]
  documents: Document[]
  contacts: Contact[]
}
