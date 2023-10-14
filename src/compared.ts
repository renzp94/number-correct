import { minus } from '.'
import { isNegativeNumber, removeMinusSign } from './utils'

type ComparedReturnValue = -1 | 0 | 1
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

  const result = minus(tValue, cValue)
  // 如果相减为0则为等于
  if (result === '0') {
    return 0
  }
  const isResultNV = isNegativeNumber(result)
  // 如果相减结果为负，则为小于，否则为大于
  let status: ComparedReturnValue = isResultNV ? -1 : 1
  // 如果全为负，则status取反
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
