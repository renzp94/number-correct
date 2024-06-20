import { isLess } from '../compared'
import { Value } from '../object'
import {
  createNumberArray,
  getVDivideData,
  isNegativeNumber,
  replaceInvalidZero,
  transformScientificNotation,
} from '../utils'
import { _divide } from './divide'

/**
 * 求余
 * @param divisorValues 部分除数
 * @param dividend 被求余数
 * @returns 返回计算的余数
 */
const vMod = (divisorValues: string[], dividend: string) => {
  const divisorList = [...divisorValues]
  // 取并从数组中移除 和被求余数相同位数的值，并作为默认差值
  let divisor = divisorList.splice(0, dividend.length).join('')
  let remainder = divisor

  do {
    const [_, diffV] = _divide(divisor, dividend)
    divisor = diffV
    // 判断数组中是否还有值
    if (divisorList.length > 0) {
      // 有值则首位进行补位
      divisor += divisorList.shift()
    } else {
      // 没有值则说明差值就是余数
      remainder = diffV
      break
    }
  } while (divisorList.length >= 0)

  return replaceInvalidZero(remainder)
}

/**
 * 求余
 *
 * @param divisor 求余数
 * @param dividend 被求余数
 * @returns 余数的字符串
 *
 * @example
 * mod(5, 3); // 1
 */
export const mod = (divisor: Value, dividend: Value) => {
  const tDivisor = transformScientificNotation(divisor)
  const tDividend = transformScientificNotation(dividend)
  if (Number(tDividend) === 0) {
    throw new Error('被求余数不能为0')
  }
  // 如果余数小于被求余数则直接返回余数
  if (!isNegativeNumber(tDivisor) && isLess(tDivisor, tDividend)) {
    return tDivisor
  }

  let [divisorValues, divisorDecimalCount] = getVDivideData(tDivisor)
  const [dividendValues, dividendDecimalCount] = getVDivideData(tDividend)
  const count = divisorDecimalCount - dividendDecimalCount
  // 小数部分剩余的值
  let decimalRemainder = ''

  if (count > 0) {
    // 因为小数不参与求余计算，所以找出余数和被求余数之间的小数位差，并取出小数位值，用于和计算的余数拼接
    decimalRemainder = divisorValues
      .slice(divisorValues.length - count)
      .join('')
    divisorValues = divisorValues.slice(0, divisorValues.length - count)
  } else if (count < 0) {
    divisorValues = divisorValues.concat(
      Array.from({ length: Math.abs(count) }, () => '0'),
    )
  }

  const dividendValue = dividendValues.join('')

  let remainder = vMod(divisorValues, dividendValue)

  if (remainder !== '0' && dividendDecimalCount > 0) {
    const zeroList = createNumberArray(
      dividendDecimalCount - remainder.length + 1,
    ).map(String)
    zeroList.splice(1, 0, '.')
    remainder = `${zeroList.join('')}${remainder}`
  }
  // 拼接小数差位的值
  if (decimalRemainder) {
    const decimalPoint = remainder.includes('.') ? '' : '.'
    let padZero = ''
    // 如果等于0则表示除尽，需要补足小数位
    if (remainder === '0') {
      // 计算需要补多少0
      padZero = Array.from(
        { length: divisorDecimalCount - decimalRemainder.length },
        () => '0',
      ).join('')
    }

    remainder = `${remainder}${decimalPoint}${padZero}${decimalRemainder}`
  }

  if (isNegativeNumber(tDivisor) && remainder !== '0') {
    remainder = `-${remainder}`
  }

  return remainder
}
