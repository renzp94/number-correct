import { Value } from './object'
import {
  getVNumberList,
  isNegativeNumber,
  removeMinusSign,
  replaceInvalidZero,
  transformScientificNotation,
  validator,
} from './utils'

type ComparedReturnValue = -1 | 0 | 1

const _compared = (vTVNumbers: number[], vCVNumbers: number[]) => {
  let status: ComparedReturnValue = 0

  for (const index in vTVNumbers) {
    const vTValue = vTVNumbers[index]
    const vCValue = vCVNumbers[index] ?? -1

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
 *
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns >: 返回1 =: 返回0 <: 返回-1
 *
 * @example
 * compared(1, 2); // -1
 * compared(1, 1); // 0
 * compared(1, 0); // 1
 */
export const compared = (
  compareValue: Value,
  comparedValue: Value,
): ComparedReturnValue => {
  validator([compareValue, comparedValue])
  const tCompareValue = transformScientificNotation(compareValue)
  const tComparedValue = transformScientificNotation(comparedValue)

  // 目标值是否为负数
  const isCNV = isNegativeNumber(tCompareValue)
  // 被比较值是否为负数
  const isCedNV = isNegativeNumber(tComparedValue)
  // 目标值为正，被比较值为负
  if (!isCNV && isCedNV) {
    return 1
  }
  // 目标值为负，被比较值为正
  if (isCNV && !isCedNV) {
    return -1
  }
  let tValue = tCompareValue
  let cValue = tComparedValue
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
 * 是否等于
 *
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 等于返回true，否则返回false
 *
 * @example
 * isEqual(1, 2); // false
 * isEqual(1, 1); // true
 * isEqual(1, 0); // false
 */
export const isEqual = (compareValue: Value, comparedValue: Value) =>
  compared(compareValue, comparedValue) === 0
/**
 * 是否大于
 *
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 大于返回true，否则返回false
 *
 * @example
 * isGreat(1, 2); // false
 * isGreat(1, 1); // false
 * isGreat(1, 0); // true
 */
export const isGreat = (compareValue: Value, comparedValue: Value) =>
  compared(compareValue, comparedValue) === 1
/**
 * 是否大于等于
 *
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 大于等于返回true，否则返回false
 *
 * @example
 * isGreatEqual(1, 2); // false
 * isGreatEqual(1, 1); // true
 * isGreatEqual(1, 0); // true
 */
export const isGreatEqual = (compareValue: Value, comparedValue: Value) =>
  isGreat(compareValue, comparedValue) || isEqual(compareValue, comparedValue)
/**
 * 是否小于
 *
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 小于返回true，否则返回false
 *
 * @example
 * isLess(1, 2); // true
 * isLess(1, 1); // false
 * isLess(1, 0); // false
 */
export const isLess = (compareValue: Value, comparedValue: Value) =>
  compared(compareValue, comparedValue) === -1
/**
 * 是否小于等于
 *
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 小于等于返回true，否则返回false
 *
 * @example
 * isLessEqual(1, 2); // true
 * isLessEqual(1, 1); // true
 * isLessEqual(1, 0); // false
 */
export const isLessEqual = (compareValue: Value, comparedValue: Value) =>
  isLess(compareValue, comparedValue) || isEqual(compareValue, comparedValue)
