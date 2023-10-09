import { VNumber } from './vMath'

export const transformNumberArray = (v: string) =>
  v?.split('')?.map(Number) ?? []

export const createGetMaxLen = (filed: 'integer' | 'decimal') => {
  return (prev: number, curr: VNumber) => {
    const len = curr[filed].length
    return len > prev ? len : prev
  }
}
