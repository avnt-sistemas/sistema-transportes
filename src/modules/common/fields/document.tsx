import FieldProps from './interfaces/fieldProps'
import { DocumentType, getDocumentsList } from '../interfaces/document'
import TypeField from './type'
import { useTranslation } from 'react-i18next'

export default function DocumentField(props: FieldProps) {
  const { t } = useTranslation()

  const options = getDocumentsList(t)

  function getMaskByType(type: DocumentType) {
    switch (type) {
      case 'cpf':
        return '999.999.999-99'
      case 'cnpj':
        return '99.999.999/9999-99'
      default:
        return ''
    }
  }

  return (
    <TypeField<DocumentType> {...props} getMaskByType={getMaskByType} options={options} valueTag='type' title='text' />
  )
}
