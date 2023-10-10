import {
  createGetMaxLenReduce,
  createNumberArray,
  transformNumberArray,
} from './utils'

type Operation = (
  curr: number,
  next: number,
  result: number[],
  index: number,
) => number[]

export interface VNumber {
  integer: number[]
  decimal: number[]
}

/**
 * 创建竖式计算函数
 * @param operation 计算方式函数
 * @returns 返回计算结果的字符串
 */
const createVCalc = (operation: Operation) => {
  return (currList: number[], nextList: number[]) => {
    // console.log('currList', currList)
    // console.log('nextList', nextList)
    const currCount = currList?.length ?? 0
    const nextCount = nextList?.length ?? 0
    const count = currCount > nextCount ? currCount : nextCount
    let result = createNumberArray(count)

    let index = 0
    do {
      const curr = currList[index] ?? 0
      const next = nextList[index] ?? 0
      result = operation(curr, next, result, index)
      index++
    } while (index < count)

    return result.reverse().join('')
  }
}
/**
 * 加法实现
 * @param curr 当前值
 * @param next 下一个值
 * @param result 初始数组
 * @param index 初始数组当前下标
 * @returns 相加之后的数组
 */
const _plus = (curr: number, next: number, result: number[], index: number) => {
  let [unit, ten] = transformNumberArray((curr + next).toString()).reverse()

  // console.log(`${curr} + ${next} = ${ten ?? ''}${unit}`)
  // 将上一位的进位加上，如果没有进位则加0
  result[index] = result[index] + unit
  // 拆分当前计算位是否需要进位，拆分了之后才是当前位计算的结果
  const [indexUnit, indexTen] = transformNumberArray(
    result[index].toString(),
  ).reverse()

  unit = indexUnit
  // 如果当前位在未拆分前计算的结果就已经进位则无需使用拆分后的进位值
  ten = ten ?? indexTen
  // 将真正的当前位的值赋值
  result[index] = unit

  // console.log('unit', unit, 'ten', ten)

  if (ten) {
    result[index + 1] = (result[index + 1] ?? 0) + ten
  }

  // console.log('result[index]', result[index])

  return result
}

/**
 * 减法实现
 */
const _minus = (
  curr: number,
  next: number,
  result: number[],
  index: number,
) => {
  const [unit, ten] = (curr + next)
    .toString()
    // 拆分成数组用于进位
    .split('')
    // 反转以处理没有十位的情况
    .reverse()
    .map(Number)

  if (ten) {
    result[index + 1] = result[index + 1] + ten
  }

  result[index] = result[index] + unit

  return result
}

export const vPlus = createVCalc(_plus)
export const vMinus = createVCalc(_minus)

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
  let list: VNumber[] = numbers.map((v) => {
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

  list = list.map((item) => {
    // 整数一定有，根据最大位数用0补齐所有位数
    const integerZeroList = createNumberArray(
      integerMaxLen - item.integer.length,
    )
    // 整数要先反转再补位
    item.integer = item.integer.reverse().concat(integerZeroList)
    // 小数如果有也根据最大位数用0补齐所有位数
    if (decimalMaxLen > 0) {
      const decimalZeroList = createNumberArray(
        decimalMaxLen - item.decimal.length,
      )
      item.decimal = item.decimal.concat(decimalZeroList).reverse()
    }
    return item
  })

  const decimalList = list.map((item) => item.decimal)
  const defaultDecimalList = createNumberArray(decimalMaxLen)

  const integerList = list.map((item) => item.integer)
  // 少一位补0，用于空出进位位置
  const defaultIntegerList = createNumberArray(integerMaxLen - 1)

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
