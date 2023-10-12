import { vMinus, vPlus } from './math'
import {
  getVData,
  joinNumber,
  reduceVData,
  replaceBeforeInvalidZero,
} from './utils'

/**
 * 加法
 * plus
 * @param numbers 要相加的数
 * @returns 相加结果的字符串
 */
export const plus = (...numbers: Array<string | number>) => {
  let borrowNumbers = numbers.filter((v) => v.toString().includes('-'))
  const positiveNumbers = numbers.filter((v) => !borrowNumbers.includes(v))

  // console.log('positiveNumbers', positiveNumbers)

  // 假设只有一个数
  let result: string = positiveNumbers?.[0]?.toString()
  // 如果有多个则进行多数加法
  if (positiveNumbers.length > 1) {
    const [vInteger, vDecimal] = getVData(positiveNumbers)
    // console.log('vInteger', vInteger, 'vDecimal', vDecimal)

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
    // console.log('decimal', decimal)

    vInteger.defaultData = [upInteger, ...vInteger.defaultData]
    const integer = reduceVData(vInteger, vPlus)
    // console.log('integer', integer)

    result = joinNumber(integer, decimal)
  }

  // console.log('result', result)
  // console.log('borrowNumbers', borrowNumbers)
  if (borrowNumbers.length) {
    // 如果存在负数，则将负数整理成一个集合
    let borrowNumber = borrowNumbers?.[0]?.toString()?.replace('-', '')
    if (borrowNumbers.length > 1) {
      // 将负数转为正数
      borrowNumbers = borrowNumbers.map((v) => v.toString().replace('-', ''))
      // console.log('正数 borrowNumbers', borrowNumbers)
      // 相加
      borrowNumber = plus(...borrowNumbers)
    }

    // console.log('borrowNumber', borrowNumber, 'result', result)

    if (borrowNumber) {
      result = result ? minus(result, borrowNumber) : `-${borrowNumber}`
    }
  }

  // console.log('end result', result)

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
  let borrowNumbers = numbers.filter((v) => v.toString().includes('-'))
  const positiveNumbers = numbers.filter((v) => !borrowNumbers.includes(v))
  // console.log(
  //   'reductionValue',
  //   reductionValue,
  //   'borrowNumbers',
  //   borrowNumbers,
  //   'positiveNumbers',
  //   positiveNumbers,
  // )

  if (borrowNumbers.length) {
    // 如果存在负数，则将负数整理成一个集合
    let borrowNumber = borrowNumbers?.[0]?.toString()?.replace('-', '')
    if (borrowNumbers.length > 1) {
      // 将负数转为正数
      borrowNumbers = borrowNumbers.map((v) => v.toString().replace('-', ''))
      // console.log('正数 borrowNumbers', borrowNumbers)
      // 相加
      borrowNumber = plus(...borrowNumbers)
    }

    // console.log('borrowNumber', borrowNumber)

    if (borrowNumber) {
      if (reductionValue.toString()?.includes('-')) {
        reductionValue = reductionValue.toString().replace('-', '')
        reductionValue = `-${minus(reductionValue, borrowNumber)}`
      } else {
        reductionValue = plus(reductionValue, borrowNumber)
      }
    }

    // console.log('reductionValue', reductionValue)
  }
  let minuend = positiveNumbers?.[0] ?? 0
  if (positiveNumbers.length > 1) {
    // 将需要减的值相加
    minuend = plus(...positiveNumbers)
  }

  // console.log('minuend', minuend)

  if (reductionValue.toString()?.includes('-')) {
    reductionValue = reductionValue.toString().replace('-', '')
    reductionValue = `-${plus(reductionValue, minuend)}`
    return reductionValue
  }

  // 将最前面的减数作为默认
  const [vInteger, vDecimal] = getVData([reductionValue, minuend])
  vDecimal.defaultData = vDecimal.data.shift() ?? []
  // console.log('=====================')
  // console.log('vInteger', vInteger, 'vDecimal', vDecimal)

  let decimal: number[] = []
  if (vDecimal.maxLen) {
    decimal = reduceVData(vDecimal, vMinus)
  }

  // console.log('decimal', decimal)
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

  // console.log(decimal)

  vInteger.defaultData = vInteger.data.shift().map((v, index, list) => {
    let value = v
    if (index === list.length - 1) {
      value = value - borrowValue
    }

    return value
  })
  let integer = reduceVData(vInteger, vMinus)
  // console.log('integer', integer)
  integer = replaceBeforeInvalidZero(integer)
  let result = joinNumber(integer, decimal)
  // 处理整数最高位不够向高位借位时记录的1和最高位计算结果-被转为NaN的情况
  result = result.replace('1NaN', '-')
  let borrowNumber = result.match(/NaN\d{1}/)?.[0]
  if (borrowNumber) {
    borrowNumber = borrowNumber.replace('NaN', '')
  }
  // console.log(borrowNumber)

  return result
}
