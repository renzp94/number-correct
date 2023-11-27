import { isGreatEqual, isLess } from './compared'
import { vDivide, vMinus, vMod, vPlus, vTimes } from './math'
import {
  createNumberArray,
  getOnlyIntegerVData,
  getRoundedValue,
  getSymbolNumbers,
  getVData,
  getVDivideData,
  isNegativeNumber,
  joinNumber,
  plusNegativeNumber,
  reduceVData,
  removeMinusSign,
  replaceBeforeInvalidZero,
  replaceInvalidZero,
  transformScientificNotation,
  validator,
} from './utils'

export * from './compared'

export { default as VNumber } from './object'

/**
 * 加法
 * @example plus(1, 1); // 2
 * @param numbers 要相加的数
 * @returns 相加结果的字符串
 */
export const plus = (...numbers: Array<string | number>) => {
  // 验证数字
  validator(numbers)
  // 处理科学计数法
  const tNumbers = numbers.map(transformScientificNotation)
  const [positiveNumbers, negativeNumbers] = getSymbolNumbers(tNumbers)
  // 假设只有一个数
  let result: string = positiveNumbers?.[0]?.toString()
  // 如果有多个则进行多数加法
  if (positiveNumbers.length > 1) {
    const [vInteger, vDecimal] = getVData(positiveNumbers)
    // 先算小数，因为有可能需要进位
    let decimal: number[] = []
    // 需要进位的数，一般只有0(无进位)和1(有进位)
    let upInteger = 0
    if (vDecimal.maxLen) {
      decimal = reduceVData(vDecimal, vPlus)
      // 如果有进位则将进位从小数数组中移除并赋给进位变量
      if (decimal.length > vDecimal.maxLen) {
        upInteger = decimal.pop() as number
      }
    }
    vInteger.defaultData = [upInteger, ...vInteger.defaultData]
    const integer = reduceVData(vInteger, vPlus)
    result = joinNumber(integer, decimal)
  }

  if (negativeNumbers.length) {
    const negativeNumber = plusNegativeNumber(negativeNumbers)
    if (negativeNumber) {
      result = result ? minus(result, negativeNumber) : `-${negativeNumber}`
    }
  }

  return result
}

/**
 * 减法(首位作为减数，其余为被减数)
 * @example
 * minus(1, 1); // 0
 * minus(2, 1, 1); // 0
 * @param reduction 减数
 * @param numbers 被减数数组
 * @returns 相减结果的字符串
 */
export const minus = (
  reduction: string | number,
  ...numbers: Array<string | number>
) => {
  // 验证数字
  validator([reduction, ...numbers])
  // 处理科学计数法
  const tNumbers = numbers.map(transformScientificNotation)
  const tReduction = transformScientificNotation(reduction)

  let reductionValue = tReduction
  const [positiveNumbers, negativeNumbers] = getSymbolNumbers(tNumbers)
  if (negativeNumbers.length) {
    const negativeNumber = plusNegativeNumber(negativeNumbers)
    if (negativeNumber) {
      if (isNegativeNumber(reductionValue)) {
        reductionValue = removeMinusSign(reductionValue)
        reductionValue = `-${minus(reductionValue, negativeNumber)}`
      } else {
        reductionValue = plus(reductionValue, negativeNumber)
      }
    }
  }
  let minuend = positiveNumbers?.[0] ?? 0
  if (positiveNumbers.length > 1) {
    // 将需要减的值相加
    minuend = plus(...positiveNumbers)
  }
  // 如果减数是负数，则做加法运算
  if (isNegativeNumber(reductionValue)) {
    // 减数转为正数
    reductionValue = removeMinusSign(reductionValue)
    // 相加后结果转为负数
    reductionValue = `-${plus(reductionValue, minuend)}`
    return reductionValue
  }

  const isNumberGreatEqual = isGreatEqual(reductionValue, minuend)
  const numberList = isNumberGreatEqual
    ? [reductionValue, minuend]
    : [minuend, reductionValue]

  // 将最前面的减数作为默认
  const [vInteger, vDecimal] = getVData(numberList)
  vDecimal.defaultData = vDecimal.data.shift() ?? []
  let decimal: number[] = []
  if (vDecimal.maxLen) {
    decimal = reduceVData(vDecimal, vMinus)
  }

  let borrowValue = 0
  // 是否借位，如果借位则将借位数据记录
  if (decimal.length > vDecimal.maxLen) {
    borrowValue = decimal.pop()
  }
  // 如果是负数，则计算实际的值
  if (decimal?.at(-1)?.toString() === 'NaN') {
    // 移除NaN
    decimal.pop()
    // 拿到计算的值
    let v = decimal.pop()
    // 这个值是借位的后的值
    v = 10 - v
    // 将正确的值放入
    decimal.push(v)
  }

  let firstList = vInteger.data.shift()
  if (borrowValue > 0) {
    const firstValue = minus(firstList.reverse().join(''), borrowValue)
    firstList = firstValue.split('').map(Number).reverse()
  } else {
    firstList = firstList.map((v, index) => (index === 0 ? v - borrowValue : v))
  }

  vInteger.defaultData = firstList

  let integer = reduceVData(vInteger, vMinus)
  integer = replaceBeforeInvalidZero(integer)
  let result = joinNumber(integer, decimal)
  // 处理整数最高位不够向高位借位时记录的1和最高位计算结果-被转为NaN的情况
  result = result.replace('1NaN', '-')
  let borrowNumber = result.match(/NaN\d{1}/)?.[0]
  if (borrowNumber) {
    borrowNumber = borrowNumber.replace('NaN', '')
  }

  return isNumberGreatEqual ? result : `-${result}`
}

/**
 * 乘法
 * @example
 * times(2, 2); // 4
 * times(2, 2, 2); // 8
 * @param numbers 要相乘的数
 * @returns 相乘结果的字符串
 */
export const times = (...numbers: Array<string | number>) => {
  // 验证数字
  validator(numbers)
  // 处理科学计数法
  const tNumbers = numbers.map(transformScientificNotation)
  const hasZero = tNumbers.some((v) => Number(v) === 0)
  // 0乘任何数都为0
  if (hasZero) {
    return '0'
  }
  // 获取负数个数
  const negativeNumberCount = tNumbers.filter(isNegativeNumber).length
  // 如果是双数的话则结果为正，否则为负
  const symbol = negativeNumberCount % 2 === 0 ? '' : '-'
  let positiveNumbers = tNumbers.map(removeMinusSign)
  // 假设只有一个数
  let result: string = positiveNumbers?.[0]?.toString()
  // 如果有多个则进行多数加法
  if (positiveNumbers.length > 1) {
    // 算出小数位的长度
    const decimalPoint = positiveNumbers.reduce((prev, curr) => {
      const [_, decimal] = curr.split('.')
      return prev + (decimal?.length ?? 0)
    }, 0)
    // 将小数全部转化为整数
    positiveNumbers = positiveNumbers.map((item) => item.replace('.', ''))
    const vInteger = getOnlyIntegerVData(positiveNumbers)
    // 过滤掉整数数组中全部为0数组
    vInteger.data = vInteger.data.filter((item) => !item.every((v) => v === 0))
    vInteger.defaultData = vInteger.data.shift() ?? []

    // 算出整数
    const integer: Array<number | string> = reduceVData(
      vInteger,
      vTimes,
    ).reverse()
    if (decimalPoint > 0) {
      const zeroList = createNumberArray(decimalPoint)
      integer.unshift(...zeroList)
      integer.splice(integer.length - decimalPoint, 0, '.')
    }
    result = replaceInvalidZero(integer.join(''))
  }

  return `${symbol}${result}`
}

export interface DivideConfigs {
  precision?: number
  rounded?: boolean
}

/**
 * 除法
 * @example
 * divide(4, [2]); // 2
 * divide(8, [2, 2]); // 2
 * // 可通过precision控制精度，0表示只要整数
 * divide(10, [3], { precision: 0 }); // 3
 * divide(10, [3], { precision: 2 }); // 3.33
 * // 可通过rounded控制是否四舍五入，默认为true
 * divide(20, [3], { precision: 0 }); // 7
 * divide(20, [3], { precision: 2, rounded: false }); // 6.66
 * @param numbers 被相除数的数组
 * @param configs 除法配置，默认为{ precision = 10, rounded = true }
 * @returns 相除结果的字符串
 */
export const divide = (
  divisor: string | number,
  numbers: Array<string | number>,
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
      quotient = `${integer.join('')}${v}.${decimal.join('')}`
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

  return quotient
}

/**
 * 求余
 * @example mod(5, 3); // 1
 * @param divisor 求余数
 * @param dividend 被求余数
 * @returns 余数的字符串
 */
export const mod = (divisor: string | number, dividend: string | number) => {
  const tDivisor = transformScientificNotation(divisor)
  const tDividend = transformScientificNotation(dividend)
  if (Number(tDividend) === 0) {
    throw new Error('被求余数不能为0')
  }
  // 如果余数小于被求余数则直接返回余数
  if (isLess(tDivisor, tDividend)) {
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
    remainder = `${remainder}${
      remainder.includes('.') ? '' : '.'
    }${decimalRemainder}`
  }

  return remainder
}

/**
 * 保留小数位
 * @example
 * toFixed(5.33333333, 0); // 5
 * toFixed(5.33333333, 2); // 5.33
 * toFixed(5.66666666, 2); // 5.67
 * toFixed(5.66666666, 2, false); // 5.66
 * @param number 要处理的数
 * @param precision 保留位数，0为只保留整数
 * @param rounded 是否四舍五入，默认为true
 * @returns 保留指定小数位的字符串
 */
export const toFixed = (
  number: string | number,
  precision: number,
  rounded = true,
) => {
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

  if (rounded) {
    value = getRoundedValue(value, precision)
  }

  let [integer, decimal = ''] = value.split('.')
  if (decimal.length < precision) {
    decimal = decimal.padEnd(precision, '0')
  } else {
    decimal = decimal.slice(0, precision)
  }
  value = `${symbol}${integer}.${decimal}`

  return value
}
