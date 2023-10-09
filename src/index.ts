import { createGetMaxLen, transformNumberArray } from './utils'
import { type VNumber, vPlus } from './vMath'

export const plus = (...numbers: Array<string | number>) => {
  // 拆分整数和小数
  let list: VNumber[] = numbers.map((v) => {
    const value = v.toString()
    const [integer, decimal] = value.split('.')

    return {
      integer: transformNumberArray(integer),
      decimal: transformNumberArray(decimal),
    }
  })

  // 整数最大位数
  const integerMaxLen = list.reduce(createGetMaxLen('integer'), 0)
  // 小数最大位数
  const decimalMaxLen = list.reduce(createGetMaxLen('decimal'), 0)

  list = list.map((item) => {
    // 整数一定有，根据最大位数用0补齐所有位数
    const integerZeroList = Array.from({
      length: integerMaxLen - item.integer.length,
    }).fill(0) as number[]
    // 整数要先反转再补位
    item.integer = item.integer.reverse().concat(integerZeroList)
    // 小数如果有也根据最大位数用0补齐所有位数
    if (decimalMaxLen > 0) {
      const decimalZeroList = Array.from({
        length: decimalMaxLen - item.decimal.length,
      }).fill(0) as number[]
      item.decimal = item.decimal.concat(decimalZeroList).reverse()
    }
    return item
  })

  // console.log('list', list)

  // 先算小数，因为有可能需要进位
  let decimal: number[] = []
  // 需要进位的数，一般只有0(无进位)和1(有进位)
  let upInteger = 0
  if (decimalMaxLen) {
    const decimalList = list.map((item) => item.decimal)
    const defaultDecimalList = Array.from({ length: decimalMaxLen }).fill(
      0,
    ) as number[]
    decimal = decimalList.reduce(
      (prev, curr) => vPlus(prev, curr).split('').map(Number).reverse(),
      defaultDecimalList,
    )
    // 如果有进位则将进位从小数数组中移除并赋给进位变量
    if (decimal.length > decimalMaxLen) {
      upInteger = decimal.pop() as number
    }
  }

  // console.log('decimal', decimal)

  const integerList = list.map((item) => item.integer)
  const defaultIntegerList = Array.from({
    // 少一位补0，用于空出进位位置
    length: integerMaxLen - 1,
  }).fill(0) as number[]

  const integer = integerList.reduce(
    (prev, curr) => vPlus(prev, curr).split('').map(Number).reverse(),
    // 将进位放入
    [upInteger, ...defaultIntegerList],
  )

  // console.log('integer', integer)

  // 计算前将所有位反转了，此处先反转再拼接
  let number = integer.reverse().join('')
  // 如果有小数则拼接小数
  const hasDecimal = decimal.some((item) => item)
  if (hasDecimal) {
    number += `.${decimal.reverse().join('')}`
  }

  return number
}
