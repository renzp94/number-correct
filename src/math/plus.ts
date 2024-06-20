import { Operation } from '../math'
import { Value } from '../object'
import {
  createVCalc,
  getSymbolNumbers,
  getVData,
  joinNumber,
  plusNegativeNumber,
  reduceVData,
  transformNumberArray,
  transformScientificNotation,
  validator,
} from '../utils'
import { minus } from './minus'

/**
 * 加法
 * @param curr 当前值
 * @param next 下一个值
 * @param result 初始数组
 * @param index 初始数组当前下标
 * @returns 相加之后的数组
 */
export const _plus: Operation = (curr, next, result, index) => {
  let [unit, ten] = transformNumberArray(curr + next).reverse()

  // 将上一位的进位加上，如果没有进位则加0
  result[index] = result[index] + unit
  // 拆分当前计算位是否需要进位，拆分了之后才是当前位计算的结果
  const [indexUnit, indexTen] = transformNumberArray(result[index]).reverse()

  unit = indexUnit
  // 如果当前位在未拆分前计算的结果就已经进位则无需使用拆分后的进位值
  ten = ten ?? indexTen
  // 将真正的当前位的值赋值
  result[index] = unit

  if (ten) {
    result[index + 1] = (result[index + 1] ?? 0) + ten
  }

  return result
}

const vPlus = createVCalc(_plus)

/**
 * 加法
 * @param numbers 要相加的数
 * @returns 相加结果的字符串
 *
 * @example
 * plus(1, 1); // 2
 */
export const plus = (...numbers: Array<Value>) => {
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
