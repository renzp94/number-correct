import { vPlus } from './math'
import { getVData, joinNumber, reduceVData } from './utils'

/**
 * 加法
 * @param numbers 要相加的数
 * @returns 相加结果的字符串
 */
export const plus = (...numbers: Array<string | number>) => {
  const [VInteger, vDecimal] = getVData(numbers)
  // console.log('list', list)
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
