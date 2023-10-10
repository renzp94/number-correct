import { createVCalc, transformNumberArray } from './utils'

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
