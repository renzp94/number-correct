import { isGreatEqual, isLess } from '../compared'
import { Value } from '../object'
import {
  createNumberArray,
  getRoundedValue,
  getVDivideData,
  isNegativeNumber,
  replaceInvalidZero,
  transformScientificNotation,
  validator,
} from '../utils'
import { minus } from './minus'
import { times } from './times'

/**
 * 获取当前位的商和差值
 * @param divisor 除数一部分
 * @param dividend 被除数
 * @returns 返回[商,差值]
 */
export const _divide = (divisor: string, dividend): [number, string] => {
  // 商默认为0
  let quotient = 0
  // 差值默认为减数
  let diffValue = divisor

  do {
    // 如果差值 < 被减数则停止记录并统计记录
    if (isLess(diffValue, dividend)) {
      // 得出商和差值
      return [quotient, diffValue]
    }
    // 否则进行减法计算
    diffValue = minus(diffValue, dividend)
    // 并记录+1
    quotient++
  } while (diffValue !== '0' || isGreatEqual(divisor, dividend))
}
/**
 * 除法
 * @param divisorValues 部分除数
 * @param dividend 被除数
 * @param precision 精度
 * @returns 返回计算的商
 */
const vDivide = (
  divisorValues: string[],
  dividend: string,
  precision: number,
) => {
  const divisorList = [...divisorValues]
  // 取并从数组中移除 和除数相同位数的值，并作为默认差值
  let divisor = divisorList.splice(0, dividend.length).join('')
  const result = []

  do {
    const [quotient, diffV] = _divide(divisor, dividend)
    divisor = diffV
    result.push(quotient)
    // 判断数组中是否还有值
    if (divisorList.length > 0) {
      // 有值则首位进行补位
      divisor += divisorList.shift()
      // 判断是否差值为0，不为0则需要再次计算
    } else if (divisor !== '0') {
      // 没有值则进行0补位
      divisor += '0'
      // 差值补位0时，如果没有小数点，则记录小数点
      if (!result.includes('.')) {
        result.push('.')
      }
    }

    const [_, decimal] = result.join('').split('.')
    if (decimal?.length === precision) {
      break
    }
  } while (divisor !== '0')

  return replaceInvalidZero(result.join(''))
}

export interface DivideConfigs {
  precision?: number
  rounded?: boolean
}
/**
 * 除法
 *
 * @param divisor 除数
 * @param numbers 被相除数的数组
 * @param configs 除法配置，默认为{ precision = 10, rounded = true }
 * @returns 相除结果的字符串
 *
 * @example
 * divide(4, [2]); // 2
 * divide(8, [2, 2]); // 2
 * // 可通过precision控制精度，0表示只要整数
 * divide(10, [3], { precision: 0 }); // 3
 * divide(10, [3], { precision: 2 }); // 3.33
 * // 可通过rounded控制是否四舍五入，默认为true
 * divide(20, [3], { precision: 0 }); // 7
 * divide(20, [3], { precision: 2, rounded: false }); // 6.66
 */
export const divide = (
  divisor: Value,
  numbers: Array<Value>,
  configs?: DivideConfigs,
) => {
  // 验证数字
  validator([divisor, ...numbers])
  // 处理科学计数法
  const tNumbers = numbers.map(transformScientificNotation)
  const tDivisor = transformScientificNotation(divisor)
  const { precision = 10, rounded = true } = configs ?? {}
  // 0除以任何数都为0
  if (Number(tDivisor) === 0) {
    return '0'
  }
  // 先将被除数相乘
  let dividend = times(...tNumbers)
  if (Number(dividend) === 0) {
    throw new Error('被除数不能为0')
  }

  // 是否为负数
  const isNegative =
    (isNegativeNumber(tDivisor) && !isNegativeNumber(dividend)) ||
    (isNegativeNumber(dividend) && !isNegativeNumber(tDivisor))

  const [divisorValues, divisorDecimalCount] = getVDivideData(tDivisor)
  const [dividendValues, dividendDecimalCount] = getVDivideData(dividend)
  dividend = dividendValues.join('')
  let zeroCount = dividendDecimalCount - divisorDecimalCount
  // 小数位数大于0，精度需要增加，用于后续移动小数点
  let precisionValue = zeroCount > 0 ? precision + zeroCount : precision
  if (rounded) {
    precisionValue += 1
  }
  let quotient = vDivide(divisorValues, dividend, precisionValue)

  if (zeroCount > 0) {
    if (quotient.includes('.')) {
      const [integer, decimal] = quotient.split('.').map((v) => v.split(''))
      const v = decimal.shift()
      const integerValue = integer.join('') !== '0' ? integer.join('') : ''
      const decimalValue = decimal.length > 0 ? `.${decimal.join('')}` : ''
      quotient = `${integerValue}${v}${decimalValue}`
    } else {
      quotient = quotient.padEnd(zeroCount + quotient.length, '0')
    }
  }

  if (zeroCount < 0) {
    zeroCount = Math.abs(zeroCount)
    const zeroList = createNumberArray(zeroCount).map(String)
    zeroList.splice(1, 0, '.')
    const decimalSuffix = zeroList.join('')
    if (quotient.includes('.')) {
      quotient = quotient
        .split('')
        .filter((v, index) => v !== '.' && index !== quotient.length - 1)
        .join('')
    }

    quotient = `${decimalSuffix}${quotient}`
  }

  if (rounded) {
    quotient = getRoundedValue(quotient, precision)
  }

  if (isNegative && quotient !== '0') {
    quotient = `-${quotient}`
  }

  return quotient
}
