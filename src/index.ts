import { isGreatEqual } from './compared'
import { vDivide, vMinus, vPlus, vTimes } from './math'
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
  validator,
} from './utils'

export * from './compared'

/**
 * 加法
 * @param numbers 要相加的数
 * @returns 相加结果的字符串
 */
export const plus = (...numbers: Array<string | number>) => {
  validator(numbers)
  const [positiveNumbers, negativeNumbers] = getSymbolNumbers(numbers)
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
 * @param reduction 减数
 * @param numbers 被减数数组
 * @returns 相减结果的字符串
 */
export const minus = (
  reduction: string | number,
  ...numbers: Array<string | number>
) => {
  validator([reduction, ...numbers])
  let reductionValue = reduction
  const [positiveNumbers, negativeNumbers] = getSymbolNumbers(numbers)
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
 * @param numbers 要相乘的数
 * @returns 相加结果的字符串
 */
export const times = (...numbers: Array<string | number>) => {
  validator(numbers)
  const hasZero = numbers.some((v) => Number(v) === 0)
  // 0乘任何数都为0
  if (hasZero) {
    return '0'
  }
  // 获取负数个数
  const negativeNumberCount = numbers.filter(isNegativeNumber).length
  // 如果是双数的话则结果为正，否则为负
  const symbol = negativeNumberCount % 2 === 0 ? '' : '-'
  let positiveNumbers = numbers.map(removeMinusSign)
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

interface DivideConfigs {
  precision?: number
  rounded?: boolean
}

export const divide = (
  divisor: string | number,
  numbers: Array<string | number>,
  configs?: DivideConfigs,
) => {
  validator([divisor, ...numbers])
  const { precision = 10, rounded = true } = configs ?? {}
  // 0除以任何数都为0
  if (Number(divisor) === 0) {
    return '0'
  }
  // 先将被除数相乘
  let dividend = times(...numbers)
  if (Number(dividend) === 0) {
    throw new Error('被除数不能为0')
  }

  const [divisorValues, divisorDecimalCount] = getVDivideData(divisor)
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
