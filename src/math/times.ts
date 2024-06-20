import { Value } from '../object'
import {
  createNumberArray,
  getOnlyIntegerVData,
  isNegativeNumber,
  reduceVData,
  removeMinusSign,
  replaceInvalidZero,
  transformScientificNotation,
  validator,
} from '../utils'
import { plus } from './plus'

/**
 * 乘法
 * @param curr 当前值
 * @param next 下一个值
 * @param result 初始数组
 * @param index 初始数组当前下标
 * @returns 相乘之后的数组
 */
const vTimes = (currList: number[], nextList: number[]) => {
  // 获取相差位数
  const diffCount = currList.length - nextList.length
  // 相差位数绝对值
  const diffCountAbs = Math.abs(diffCount)
  let cList = currList
  let nList = nextList
  const zeroList = createNumberArray(diffCountAbs)
  // 如果大于0则对nList补齐位数
  if (diffCount > 0) {
    nList = zeroList.concat(nList)
  }
  // 如果小于0则对cList补齐位数
  if (diffCount < 0) {
    cList = zeroList.concat(cList)
  }
  const productResult = nList.map((item, nextIndex) => {
    // 将下一个数组中的每个数乘以当前数组的每个值
    const products: string[] = cList.reduce((prev, curr, currIndex) => {
      // 根据下标算出所在位数
      const count = nextIndex + currIndex
      // 进行位数补0
      const digit = ''.padEnd(count, '0')
      prev.push(`${item * curr}${digit}`)
      return prev
    }, [])
    // 等到当前数组的所有积然后相加
    return plus(...products)
  })
  // 将通过下一个数组的每个值乘以当前数组的每个值等到的和相加，则得到当前数组✖️下一个数组的积
  let result = plus(...productResult)
  const list = result.split('')
  const len = result.length - diffCountAbs
  // 因为是小数转成整数的，所以要剔除后面无用的0
  list.splice(len, diffCountAbs)
  // 剔除前面无用的0
  result = replaceInvalidZero(list.join(''))
  return result
}

/**
 * 乘法
 *
 * @param numbers 要相乘的数
 * @returns 相乘结果的字符串
 *
 * @example
 * times(2, 2); // 4
 * times(2, 2, 2); // 8
 */
export const times = (...numbers: Array<Value>) => {
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
