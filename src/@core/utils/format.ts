import { Timestamp } from 'firebase/firestore/lite'
import { PaymentTypes } from './types'

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */

// ** Checks if the passed date is today
const isToday = (date: Date | string) => {
  const today = new Date()

  return (
    new Date(date).getDate() === today.getDate() &&
    new Date(date).getMonth() === today.getMonth() &&
    new Date(date).getFullYear() === today.getFullYear()
  )
}

export const formatDate = (
  value: Date | string,
  formatting: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
) => {
  if (!value) return value

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value: Date | string, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ? The following functions are taken from https://codesandbox.io/s/ovvwzkzry9?file=/utils.js for formatting credit card details
// Get only numbers from the input value
export const clearNumber = (value = '') => {
  return value.replace(/\D+/g, '')
}

export const clearString = (value = '') => {
  return value.replace(/[^\w\s]/g, '')
}

// Format credit cards according to their types
export const formatCreditCardNumber = (value: string, Payment: PaymentTypes) => {
  if (!value) {
    return value
  }

  const issuer = Payment.fns.cardType(value)
  const clearValue = clearNumber(value)
  let nextValue

  switch (issuer) {
    case 'amex':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 15)}`
      break
    case 'dinersclub':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 14)}`
      break
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(8, 12)} ${clearValue.slice(
        12,
        19
      )}`
      break
  }

  return nextValue.trim()
}

// Format expiration date in any credit card
export const formatExpirationDate = (value: string) => {
  const finalValue = value
    .replace(/^([1-9]\/|[2-9])$/g, '0$1/') // 3 > 03/
    .replace(/^(0[1-9]|1[0-2])$/g, '$1/') // 11 > 11/
    .replace(/^([0-1])([3-9])$/g, '0$1/$2') // 13 > 01/3
    .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2') // 141 > 01/41
    .replace(/^([0]+)\/|[0]+$/g, '0') // 0/ > 0 and 00 > 0
    // To allow only digits and `/`
    .replace(/[^\d\/]|^[\/]*$/g, '')
    .replace(/\/\//g, '/') // Prevent entering more than 1 `/`

  return finalValue
}

// Format CVC in any credit card
export const formatCVC = (value: string, cardNumber: string, Payment: PaymentTypes) => {
  const clearValue = clearNumber(value)
  const issuer = Payment.fns.cardType(cardNumber)
  const maxLength = issuer === 'amex' ? 4 : 3

  return clearValue.slice(0, maxLength)
}

export function formatPlate(plate: string) {
  const formattedPlate = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()

  if (/^[A-Z]{3}\d{4}$/.test(formattedPlate)) {
    return formattedPlate.replace(/(\w{3})(\d{4})/, '$1-$2')
  } else if (/^[A-Z]{3}\d{1}[A-Z]{1}\d{2}$/.test(formattedPlate)) {
    return formattedPlate.replace(/(\w{3})(\d{1})(\w{1})(\d{2})/, '$1$2$3$4')
  }
  throw new Error('invalid format')
}

export function timestampToDate(value: Timestamp): Date {
  return new Date(value.seconds * 1000 + value.nanoseconds / 1000000)
}

export function formatCPF(cpf: string) {
  const formattedCPF = cpf.replace(/\D/g, '')

  if (/^(\d{3})(\d{3})(\d{3})(\d{2})$/.test(formattedCPF)) {
    return formattedCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
  }

  return cpf
}

export function formatCNPJ(cnpj: string) {
  const formattedCNPJ = cnpj.replace(/\D/g, '')

  if (/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/.test(formattedCNPJ)) {
    return formattedCNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }

  return cnpj
}

export function formatPhoneNumber(phoneNumber: string): string {
  const formattedNumber = phoneNumber.replace(/\D/g, '')

  if (/^(\d{2})(\d{5})(\d{4})$/.test(formattedNumber)) {
    return formattedNumber.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }

  return phoneNumber
}
