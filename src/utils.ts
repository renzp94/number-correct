import { plus } from '.'
import type { Operation } from './math'

/**
 * 将数字字符串转换成数字数组
 * @param v 数字字符串
 * @returns
 */
export const transformNumberArray = (v: string | number) =>
  v?.toString()?.split('')?.map(Number) ?? []
/**
 * 创建一个获取数组中元素最大长度值的reduce函数
 * @param filed 属性
 * @returns reduce函数
 */
export const createGetMaxLenReduce = (filed: 'integer' | 'decimal') => {
  return (prev: number, curr: VNumber) => {
    const len = curr[filed].length
    return len > prev ? len : prev
  }
}
/**
 * 创建数字数组
 * @param length 数组长度
 * @returns
 */
export const createNumberArray = (length: number) =>
  Array.from({ length }).fill(0) as number[]
/**
 * 拼接整数数组和小数数组为一个数
 * @param integer 整数数组
 * @param decimal 小数数组
 * @returns 数值的字符串
 */
export const joinNumber = (integer: number[], decimal: number[]) => {
  // 计算前将所有位反转了，此处先反转再拼接
  let number = integer.reverse().join('')
  // 如果有小数则拼接小数
  const hasDecimal = decimal.some((item) => item)
  if (hasDecimal) {
    number += `.${decimal.reverse().join('')}`
  }

  return number
}
/**
 * 将VData类型的数据整合
 * @param target 数据源
 * @param computed 计算函数
 * @returns 返回最终数据数组
 */
export const reduceVData = (
  target: VData,
  computed: (prev: number[], curr: number[]) => string,
) => {
  return target.data.reduce(
    (prev, curr) => transformNumberArray(computed(prev, curr)).reverse(),
    target.defaultData,
  )
}

export interface VNumber {
  integer: number[]
  decimal: number[]
}

/**
 * 创建竖式计算函数
 * @param operation 计算方式函数
 * @returns 返回计算结果的字符串
 */
export const createVCalc = (operation: Operation) => {
  return (currList: number[], nextList: number[]) => {
    const currCount = currList?.length ?? 0
    const nextCount = nextList?.length ?? 0
    const count = currCount > nextCount ? currCount : nextCount
    let result = createNumberArray(count)

    let index = 0
    do {
      const curr = currList[index] ?? 0
      const next = nextList[index] ?? 0
      result = operation(curr, next, result, index, currList, nextList)
      index++
    } while (index < count)

    return result.reverse().join('')
  }
}

export interface VData {
  data: number[][]
  defaultData: number[]
  maxLen: number
}

/**
 * 获取竖式计算的数据
 * @param numbers 相加数值数组
 * @returns [整数数据，小数数据]
 */
export const getVData = (numbers: Array<string | number>): [VData, VData] => {
  // 拆分整数和小数
  const list: VNumber[] = numbers.map((v) => {
    const [integer, decimal] = v.toString().split('.')

    return {
      integer: transformNumberArray(integer),
      decimal: transformNumberArray(decimal),
    }
  })

  // 整数最大位数
  const integerMaxLen = list.reduce(createGetMaxLenReduce('integer'), 0)
  // 小数最大位数
  const decimalMaxLen = list.reduce(createGetMaxLenReduce('decimal'), 0)

  const integerList: number[][] = []
  const decimalList: number[][] = []

  list.forEach((item) => {
    // 整数一定有，根据最大位数用0补齐所有位数
    const integerZeroList = createNumberArray(
      integerMaxLen - item.integer.length,
    )
    // 整数要先反转再补位
    const integer = item.integer.reverse().concat(integerZeroList)
    integerList.push(integer)
    // 小数如果有也根据最大位数用0补齐所有位数
    if (decimalMaxLen > 0) {
      const decimalZeroList = createNumberArray(
        decimalMaxLen - item.decimal.length,
      )
      const decimal = item.decimal.concat(decimalZeroList).reverse()
      decimalList.push(decimal)
    }
  })

  // 少一位补0，用于空出进位位置
  const defaultIntegerList = createNumberArray(integerMaxLen - 1)
  const defaultDecimalList = createNumberArray(decimalMaxLen)

  return [
    {
      data: integerList,
      defaultData: defaultIntegerList,
      maxLen: integerMaxLen,
    },
    {
      data: decimalList,
      defaultData: defaultDecimalList,
      maxLen: decimalMaxLen,
    },
  ]
}

export const getThanZeroIndex = (target: number[], currIndex: number) => {
  const nextIndex = currIndex + 1
  const value = target[nextIndex]
  // 如果大于0则找到返回
  if (value !== 0 && value > -10) {
    return nextIndex
  }
  // 如果不大于0并且是最后一位了则返回
  if (nextIndex === target.length - 1) {
    return nextIndex
  }

  return getThanZeroIndex(target, nextIndex)
}

/**
 * 移除数字字符串前面无效的0
 * @param number 数字字符串
 * @returns 返回移除后的数字字符串
 */
export const replaceBeforeInvalidZero = (numbers: number[]) => {
  if (numbers.length > 1 && numbers?.at(-1) === 0) {
    let str = [...numbers].reverse().join('')
    str = str.replace(/^0+/, '')
    return transformNumberArray(str).reverse()
  }

  return numbers
}
/**
 * 是否为负数
 * @param v 数字或数字字符串
 * @returns 是返回true，否则返回false
 */
export const isNegativeNumber = (v: string | number) =>
  v?.toString()?.includes('-')
/**
 * 移除首个负号
 * @param v 数字或数字字符串
 * @returns 返回移除后的字符串
 */
export const removeMinusSign = (v: string | number) =>
  v?.toString()?.replace('-', '')
/**
 * 从数组中筛选出来正数和负数
 * @param numbers 数字数组
 * @returns [正数数组，负数数组]
 */
export const getSymbolNumbers = (numbers: Array<string | number>) => {
  const negativeNumbers = numbers.filter(isNegativeNumber)
  const positiveNumbers = numbers.filter((v) => !negativeNumbers.includes(v))

  return [positiveNumbers, negativeNumbers]
}
/**
 * 负数相加
 * @param numbers 负数数组
 * @returns 返回相加后的值
 */
export const plusNegativeNumber = (numbers: Array<string | number>) => {
  let negativeNumber = removeMinusSign(numbers?.[0])
  if (numbers.length > 1) {
    // 将负数转为正数，然后相加
    negativeNumber = plus(...numbers.map(removeMinusSign))
  }

  return negativeNumber
}
