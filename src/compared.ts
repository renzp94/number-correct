import {
  getVNumberList,
  isNegativeNumber,
  removeMinusSign,
  replaceInvalidZero,
} from './utils'

type ComparedReturnValue = -1 | 0 | 1

const _compared = (vTVNumbers: number[], vCVNumbers: number[]) => {
  let status: ComparedReturnValue = 0

  for (const _ in vTVNumbers) {
    const vTValue = vTVNumbers.shift()
    const vCValue = vCVNumbers.shift() ?? -1

    if (vTValue > vCValue) {
      status = 1
      break
    }
    if (vTValue < vCValue) {
      status = -1
      break
    }
  }

  return status
}
/**
 * 比大小
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns >: 返回1 =: 返回0 <: 返回-1
 */
export const compared = (
  compareValue: string | number,
  comparedValue: string | number,
): ComparedReturnValue => {
  // 目标值是否为负数
  const isCNV = isNegativeNumber(compareValue)
  // 被比较值是否为负数
  const isCedNV = isNegativeNumber(comparedValue)
  // 目标值为正，被比较值为负
  if (!isCNV && isCedNV) {
    return 1
  }
  // 目标值为负，被比较值为正
  if (isCNV && !isCedNV) {
    return -1
  }
  let tValue = compareValue
  let cValue = comparedValue
  // 全为负
  const isAllNV = isCNV && isCedNV
  if (isAllNV) {
    tValue = removeMinusSign(tValue)
    cValue = removeMinusSign(cValue)
  }

  tValue = replaceInvalidZero(tValue.toString())
  cValue = replaceInvalidZero(cValue.toString())

  const [vTVNumbers, vCVNumbers] = getVNumberList([tValue, cValue])
  // 整数位多
  if (vTVNumbers.integer.length > vCVNumbers.integer.length) {
    return isAllNV ? -1 : 1
  }
  // 整数位少
  if (vTVNumbers.integer.length < vCVNumbers.integer.length) {
    return isAllNV ? 1 : -1
  }

  let status = _compared(vTVNumbers.integer, vCVNumbers.integer)
  if (status === 0) {
    status = _compared(vTVNumbers.decimal, vCVNumbers.decimal)
  }

  if (isAllNV) {
    status = (0 - status) as ComparedReturnValue
  }

  return status
}
/**
 * 是否大于
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 大于返回true，否则返回false
 */
export const isGreat = (
  compareValue: string | number,
  comparedValue: string | number,
) => compared(compareValue, comparedValue) === 1
/**
 * 是否小于
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 小于返回true，否则返回false
 */
export const isLess = (
  compareValue: string | number,
  comparedValue: string | number,
) => compared(compareValue, comparedValue) === -1
/**
 * 是否等于
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 等于返回true，否则返回false
 */
export const isEqual = (
  compareValue: string | number,
  comparedValue: string | number,
) => compared(compareValue, comparedValue) === 0
/**
 * 是否大于等于
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 大于等于返回true，否则返回false
 */
export const isGreatEqual = (
  compareValue: string | number,
  comparedValue: string | number,
) =>
  isGreat(compareValue, comparedValue) || isEqual(compareValue, comparedValue)
/**
 * 是否小于等于
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 小于等于返回true，否则返回false
 */
export const isLessEqual = (
  compareValue: string | number,
  comparedValue: string | number,
) => isLess(compareValue, comparedValue) || isEqual(compareValue, comparedValue)
