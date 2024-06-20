import { Value } from '../object'
import {
  getRoundedValue,
  isNegativeNumber,
  removeMinusSign,
  transformScientificNotation,
  validator,
} from '../utils'

/**
 * 保留小数位
 *
 * @param number 要处理的数
 * @param precision 保留位数，0为只保留整数
 * @param rounded 是否四舍五入，默认为true
 * @returns 保留指定小数位的字符串
 *
 * @example
 * toFixed(5.33333333, 0); // 5
 * toFixed(5.33333333, 2); // 5.33
 * toFixed(5.66666666, 2); // 5.67
 * toFixed(5.66666666, 2, false); // 5.66
 */
export const toFixed = (number: Value, precision: number, rounded = true) => {
  validator([number])
  let value = transformScientificNotation(number)
  let symbol = ''
  if (isNegativeNumber(value)) {
    value = removeMinusSign(value)
    symbol = '-'
  }

  if (rounded) {
    value = getRoundedValue(value, precision)
  }

  // 精度小于等于0则只保留整数
  if (precision <= 0) {
    value = value.split('.')[0]
    return Number(value) === 0 ? value : `${symbol}${value}`
  }

  let [integer, decimal = ''] = value.split('.')
  decimal =
    decimal.length < precision
      ? decimal.padEnd(precision, '0')
      : decimal.slice(0, precision)

  value = `${symbol}${integer}.${decimal}`

  return value
}
