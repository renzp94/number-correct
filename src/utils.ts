import { isGreatEqual, plus } from '.'
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
export const createNumberArray = (length: number, value = 0) =>
  Array.from({ length }).fill(value) as number[]
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
    // console.log('currList', currList, 'nextList', nextList)
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
export const getVData = (
  numbers: Array<string | number>,
  defaultDataFillValue = 0,
): [VData, VData] => {
  // 拆分整数和小数
  const list: VNumber[] = getVNumberList(numbers)

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
      defaultDataFillValue,
    )
    // 整数要先反转再补位
    const integer = item.integer.reverse().concat(integerZeroList)
    integerList.push(integer)
    // 小数如果有也根据最大位数用0补齐所有位数
    if (decimalMaxLen > 0) {
      const decimalZeroList = createNumberArray(
        decimalMaxLen - item.decimal.length,
        defaultDataFillValue,
      )
      const decimal = item.decimal.concat(decimalZeroList).reverse()
      decimalList.push(decimal)
    }
  })

  // 少一位补0，用于空出进位位置
  const defaultIntegerList = createNumberArray(
    integerMaxLen - 1,
    defaultDataFillValue,
  )
  const defaultDecimalList = createNumberArray(
    decimalMaxLen,
    defaultDataFillValue,
  )

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

/**
 * 获取竖式计算的数据
 * @param numbers 相加数值数组
 * @returns [整数数据，小数数据]
 */
export const getOnlyIntegerVData = (
  numbers: Array<string | number>,
  defaultDataFillValue = 0,
): VData => {
  const integerList = numbers.map((item) =>
    item.toString().split('').reverse().map(Number),
  )
  const maxLen = integerList.reduce(
    (prev, curr) => (curr.length > prev ? curr.length : prev),
    0,
  )
  // 少一位补0，用于空出进位位置
  const defaultIntegerList = createNumberArray(maxLen, defaultDataFillValue)

  return {
    data: integerList,
    defaultData: defaultIntegerList,
    maxLen,
  }
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
 * 获取竖式计算的数据
 * @param numbers 相加数值数组
 * @returns [整数数据，小数数据]
 */
export const getVNumberList = (numbers: Array<string | number>): VNumber[] => {
  return numbers.map((v) => {
    const [integer, decimal] = v.toString().split('.')

    return {
      integer: transformNumberArray(integer),
      decimal: decimal ? transformNumberArray(decimal) : [],
    }
  })
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
    return str ? transformNumberArray(str).reverse() : [0]
  }

  return numbers
}

/**
 * 移除数字字符串前后面无效的0
 * @param number 数字字符串
 * @returns 返回移除后的数字字符串
 */
export const replaceInvalidZero = (number: string) => {
  let [integer, decimal] = number.split('.')
  integer = integer.replace(/^0+/, '')
  decimal = decimal?.replace(/0+$/, '')

  let result = integer ? integer : '0'
  if (decimal) {
    result += `.${decimal}`
  }

  return result
}

/**
 * 移除小数数字字符串为整数时后面无效的0
 * @param number 数字字符串
 * @returns 返回移除后的数字字符串
 */
export const replaceDecimalInvalidZero = (
  number: string,
  decimalPoint: number,
) => {
  const decimalList = number.split('').reverse()
  decimalList.splice(decimalPoint, 0, '.')
  return decimalList.reverse().join('')
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
/**
 * 获取除法需要的数据
 * @param number 数字字符串
 * @returns 返回[数字数组,小数个数]
 */
export const getVDivideData = (number: string | number): [string[], number] => {
  const value = replaceInvalidZero(removeMinusSign(number))
  const decimalPointIndex = value.indexOf('.')
  const decimalCount =
    decimalPointIndex > -1 ? value.length - value.indexOf('.') - 1 : 0

  let values = value.split('').filter((v) => v !== '.')
  values = replaceInvalidZero(values.join('')).split('')

  return [values, decimalCount]
}
/**
 * 计算进位后的值
 * @param number 数字字符串
 * @returns 如果是整数则原样返回，否则返回最终进位后的值
 */
export const getRoundedValue = (number: string, precision: number) => {
  // 如果是整数直接返回原数
  if (!number.includes('.')) {
    return number
  }

  let [integer, decimal] = number.split('.')
  // 如果是未多于精度则直接返回原数
  if (decimal.length <= precision) {
    return number
  }

  // 默认精度为0只要整数
  let result = integer
  // 如果精度为0
  if (precision <= 0) {
    const roundValue = decimal.split('')[0] ?? 0
    // 判断是否需要进位
    if (isGreatEqual(roundValue, 5)) {
      result = plus(result, 1)
    }

    return result
  }
  // 如果精度大于0则计算小数位
  const decimalList = decimal.split('')
  const roundValue = decimalList.pop()
  decimal = decimalList.join('')
  result = `${integer}.${decimal}`

  if (isGreatEqual(roundValue, 5)) {
    const zeroList = createNumberArray(decimal.length - 1)
    result = plus(result, `0.${zeroList.join('')}1`)
  }

  return result
}

/**
 * 验证是否为数字
 * @param v 字符串
 * @returns 为数字则返回true，否则返回false
 */
export const isNumber = (v: string | number) =>
  /^[-]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/.test(v.toString())
/**
 * 数字有效验证器
 * @param numbers 当前操作的数
 * @returns 验证不通过则报错
 */
export const validator = (numbers: Array<string | number>) => {
  let errorValue: string | number

  const isError = numbers.some((v) => {
    const pass = isNumber(v)
    if (!pass) {
      errorValue = v
    }
    return !pass
  })

  if (isError) {
    throw new Error(`${errorValue}不是一个数字`)
  }
}
/**
 * 将科学计数法转换为数字完成形式
 * @param v 科学计数法表示的数字
 * @returns 返回转换后的数字
 */
export const transformScientificNotation = (v: string | number) => {
  let value = v.toString()
  if (/[eE]/.test(value)) {
    let [base, exponent] = value.split(/[eE]/)
    base = base.replace(/\./g, '')

    if (exponent.includes('+')) {
      value = base.padEnd(base.length + Number(exponent), '0')
    } else {
      value = base.padStart(base.length + Math.abs(Number(exponent)), '0')
      value = `${value.slice(0, 1)}.${value.slice(1, value.length)}`
    }
  }

  return value
}
