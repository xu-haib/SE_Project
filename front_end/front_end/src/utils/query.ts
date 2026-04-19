import { isArray } from 'lodash-es'
import type { LocationQueryValue } from 'vue-router'

type QueryValue = LocationQueryValue | LocationQueryValue[]

export function toSingle(value: QueryValue) {
  return isArray(value) ? value[0] : value
}

export function queryNum(value: QueryValue) {
  value = toSingle(value)
  return value ? parseInt(value) : undefined
}

export function queryStr(value: QueryValue) {
  value = toSingle(value)
  return value ? value : undefined
}

export function queryDate(value: QueryValue) {
  const str = queryStr(value)
  if(str !== undefined){
    const result = new Date(str)
    return result ? result : undefined
  } else {
    return undefined
  }
}

export function queryNoS(value: QueryValue) {
  value = toSingle(value)
  if (value && /d+/.test(value)) {
    return queryNum(value)
  } else {
    return queryStr(value)
  }
}
