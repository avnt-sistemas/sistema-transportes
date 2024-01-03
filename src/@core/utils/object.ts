import { Timestamp } from 'firebase/firestore/lite'

export function objectDiff(original: any, data: any) {
  const _ = (d: any, o: any) => {
    const c: any = {}
    for (const [key, value] of Object.entries(d)) {
      if (!isObject(o) || o[key] !== value) {
        c[key] = value
      }

      if (isObject(value)) {
        if (Object.keys(value as object).length === 0) delete c[key]
        else if (isObject(o)) {
          c[key] = _(value, o[key])
          if (Object.keys(c[key]).length === 0) delete c[key]
        }
      }
    }

    return c
  }

  return _(data, original)
}

export function isEmpty(value: any) {
  return (
    value === '' ||
    value === null ||
    value === undefined ||
    (typeof value === 'object' && Object.keys(value as object).length === 0)
  )
}

export function isObject(value: any) {
  return value !== null && !(value instanceof Date) && !(value instanceof Timestamp) && typeof value === 'object'
}

export function removeEmptyValues(object: any) {
  const _ = (o: any) => {
    const c: any = { ...o }
    for (const [key, value] of Object.entries(o)) {
      if (isEmpty(value)) {
        delete c[key]
      } else if (typeof value === 'object') {
        c[key] = _(value)
        if (Object.keys(c[key]).length === 0) delete c[key]
      }
    }

    return c
  }

  return _(object)
}

export function removeUndefinedValues(object: any) {
  const _ = (o: any) => {
    const c: any = { ...o }
    for (const [key, value] of Object.entries(o)) {
      if (value === undefined) {
        delete c[key]
      } else if (isObject(value)) {
        c[key] = _(value)
        if (isEmpty(c[key])) delete c[key]
      }
    }

    return c
  }

  return _(object)
}

export function removeNullValues(object: any) {
  const _ = (o: any) => {
    const c: any = { ...o }
    for (const [key, value] of Object.entries(o)) {
      if (value === null) {
        delete c[key]
      } else if (isObject(value)) {
        c[key] = _(value)
        if (isEmpty(c[key])) delete c[key]
      }
    }

    return c
  }

  return _(object)
}
