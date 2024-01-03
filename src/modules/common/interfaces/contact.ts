import { capitalize } from '@mui/material'
import { TFunction } from 'i18next'

export type ContactType = 'phone' | 'whatsapp' | 'email' | 'other' | string

interface ContactListItem {
  type: ContactType
  text: string
}

export const getContactsList = (t: TFunction<'translation', undefined, 'translation'>): ContactListItem[] => {
  return [
    {
      type: 'phone',
      text: capitalize(t('phone'))
    },
    {
      type: 'whatsapp',
      text: capitalize(t('whatsapp'))
    },
    {
      type: 'email',
      text: capitalize(t('email'))
    },
    {
      type: 'other',
      text: capitalize(t('other'))
    }
  ]
}

export const getContactName = (t: TFunction<'translation', undefined, 'translation'>, type: ContactType): string => {
  const list = getContactsList(t)
  const item = list.find(i => i.type === type)

  return item ? item.text : type
}

export default interface Contact {
  id: number
  name: string
  type: ContactType
  value: string
  formatted?: string
}
