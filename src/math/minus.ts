import { isGreatEqual } from '../compared'
import { Operation } from '../math'
import { Value } from '../object'
import {
  createVCalc,
  getSymbolNumbers,
  getThanZeroIndex,
  getVData,
  isNegativeNumber,
  joinNumber,
  plusNegativeNumber,
  reduceVData,
  removeMinusSign,
  replaceBeforeInvalidZero,
  transformScientificNotation,
  validator,
} from '../utils'
import { plus } from './plus'

/**
 * 减法
 * @param curr 当前值
 * @param next 下一个值
 * @param result 初始数组
 * @param index 初始数组当前下标
 * @returns 相减之后的数组
 */
const _minus: Operation = (curr, next, result, index, currList) => {
  // 被借数值(负数)
  let borrowValue = result[index]
  // 如果被借过则需要算上被借数值
  if (borrowValue < 0) {
    // 当前值+被借数值 < 0 则说明当前位已经向高位借位了
    // > -10说明当前还未借完，则将被借数值设置成正确的值
    const currV = curr + borrowValue
    if (currV < 0 && currV > -10) {
      borrowValue = 10 + result[index]
    }
  }

  let v = curr + borrowValue - next

  // 如果不够减并且还有高位则做借位处理
  if (v < 0 && index < result.length - 1) {
    // 通过记录的借位信息重新计算一下currList
    const computedCurrList = currList.map((item, i) => {
      if (i >= index) {
        const borrowValue = result[i]
        return item + borrowValue
      }

      return item
    })
    // 获取可以借位的下标和值
    const borrowIndex = getThanZeroIndex(computedCurrList, index)
    // 如果存在可借的位则做借位处理
    if (borrowIndex > 0) {
      // 借一位给当前数
      const currV = Number(`1${curr}`) + result[index]
      // 重新计算值
      v = currV - next
      // 借位的位数值使用-1记一下
      result[borrowIndex] = result[borrowIndex] - 1
      let iterationIndex = index

      do {
        result[iterationIndex] = result[iterationIndex] - 1
        iterationIndex++
      } while (iterationIndex < borrowIndex)
    }
  }
  // 最后一位且向高位借过位标记借过1次，主要是用于小数向整数借位
  if (index === result.length - 1 && curr + result[index] - next < 0) {
    result.push(1)
  }

  result[index] = v

  return result
}

const vMinus = createVCalc(_minus)

/**
 * 减法(首位作为减数，其余为被减数)
 *
 * @param reduction 减数
 * @param numbers 被减数数组
 * @returns 相减结果的字符串
 *
 * @example
 * minus(1, 1); // 0
 * minus(2, 1, 1); // 0
 */
export const minus = (reduction: Value, ...numbers: Array<Value>) => {
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
    reductionValue = plus(reductionValue, minuend)
    reductionValue = `${reductionValue === '0' ? '' : '-'}${reductionValue}`
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

  return isNumberGreatEqual ? result : `-${result}`
}
