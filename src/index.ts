import { vMinus, vPlus } from './math'
import {
  getSymbolNumbers,
  getVData,
  isNegativeNumber,
  joinNumber,
  plusNegativeNumber,
  reduceVData,
  removeMinusSign,
  replaceBeforeInvalidZero,
} from './utils'

/**
 * 加法
 * plus
 * @param numbers 要相加的数
 * @returns 相加结果的字符串
 */
export const plus = (...numbers: Array<string | number>) => {
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

  // 将最前面的减数作为默认
  const [vInteger, vDecimal] = getVData([reductionValue, minuend])
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

  vInteger.defaultData = vInteger.data.shift().map((v, index, list) => {
    let value = v
    if (index === list.length - 1) {
      value = value - borrowValue
    }

    return value
  })
  let integer = reduceVData(vInteger, vMinus)
  integer = replaceBeforeInvalidZero(integer)
  let result = joinNumber(integer, decimal)
  // 处理整数最高位不够向高位借位时记录的1和最高位计算结果-被转为NaN的情况
  result = result.replace('1NaN', '-')
  let borrowNumber = result.match(/NaN\d{1}/)?.[0]
  if (borrowNumber) {
    borrowNumber = borrowNumber.replace('NaN', '')
  }

  return result
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
) => {
  // 目标值是否为负数
  const isCNV = isNegativeNumber(compareValue)
  // 被比较值是否为负数
  const isCedNV = isNegativeNumber(comparedValue)
  // 目标值为正，被比较值为负
  if (!isCNV && isCedNV) {
    return true
  }
  // 目标值为负，被比较值为正
  if (isCNV && !isCedNV) {
    return false
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
  let status = isResultNV ? -1 : 1
  // 如果全为负，则status取反
  if (isAllNV) {
    status = 0 - status
  }

  return status
}
