import FieldProps from './interfaces/fieldProps'
import { ContactType, getContactsList } from '../interfaces/contact'
import TypeField from './type'
import { useTranslation } from 'react-i18next'

export default function ContactField(props: FieldProps) {
  const { t } = useTranslation()

  const options = getContactsList(t)

  function getMaskByType(type: ContactType) {
    switch (type) {
      case 'phone':
      case 'whatsapp':
        return '(99) 99999-9999'
      default:
        return ''
    }
  }

  return (
    <TypeField<ContactType> {...props} getMaskByType={getMaskByType} options={options} valueTag='type' title='text' />
  )
}
