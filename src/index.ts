import { vMinus, vPlus } from './math'
import { getVData, joinNumber, reduceVData } from './utils'

/**
 * 加法
 * plus
 * @param numbers 要相加的数
 * @returns 相加结果的字符串
 */
export const plus = (...numbers: Array<string | number>) => {
  const [VInteger, vDecimal] = getVData(numbers)
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

  VInteger.defaultData = [upInteger, ...VInteger.defaultData]
  const integer = reduceVData(VInteger, vPlus)
  // console.log('integer', integer)

  return joinNumber(integer, decimal)
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
  // 将需要减的值相加
  const minuend = plus(...numbers)
  // console.log('=====================')

  // 将最前面的减数作为默认
  const [VInteger, vDecimal] = getVData([reduction, minuend])
  vDecimal.defaultData = vDecimal.data.shift()
  // console.log(VInteger, 'VInteger', 'vDecimal', vDecimal)

  let decimal: number[] = []
  if (vDecimal.maxLen) {
    decimal = reduceVData(vDecimal, vMinus)
  }

  // console.log('decimal', decimal)
  let borrowValue = 0
  if (decimal.length > vDecimal.maxLen) {
    borrowValue = decimal.pop()
  }

  VInteger.defaultData = VInteger.data.shift().map((v, index, list) => {
    let value = v
    if (index === list.length - 1) {
      value = value - borrowValue
    }

    return value
  })
  const integer = reduceVData(VInteger, vMinus)
  // console.log('integer', integer)

  return joinNumber(integer, decimal)
}
