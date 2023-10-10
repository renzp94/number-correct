import type { VData, VNumber } from './vMath'

/**
 * 将数字字符串转换成数字数组
 * @param v 数字字符串
 * @returns
 */
export const transformNumberArray = (v: string) =>
  v?.split('')?.map(Number) ?? []
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
