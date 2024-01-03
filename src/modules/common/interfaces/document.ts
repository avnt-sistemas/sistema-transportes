import { capitalize } from '@mui/material'
import { TFunction } from 'i18next'

export type DocumentType = 'cpf' | 'cnpj' | 'rg' | string

interface DocumentListItem {
  type: DocumentType
  text: string
}

export const getDocumentsList = (t: TFunction<'translation', undefined, 'translation'>): DocumentListItem[] => {
  return [
    {
      type: 'cpf',
      text: 'CPF'
    },
    {
      type: 'cnpj',
      text: 'CNPJ'
    },
    {
      type: 'rg',
      text: 'RG'
    },
    {
      type: 'other',
      text: capitalize(t('other'))
    }
  ]
}

export const getDocumentType = (type: DocumentType): DocumentType => {
  switch (type) {
    case 'cpf':
    case 'cnpj':
    case 'rg':
      return type
    default:
      return 'other'
  }
}

export const getDocumentsName = (type: DocumentType): string => {
  switch (type) {
    case 'cpf':
      return 'CPF'
    case 'cnpj':
      return 'CNPJ'
    case 'rg':
      return 'RG'
    default:
      return type
  }
}

export default interface Document {
  id: number
  type: DocumentType
  value: string
  formatted?: string
}
