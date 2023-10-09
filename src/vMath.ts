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
    let result = Array.from({ length: count }).fill(0) as number[]

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
 */
const _plus = (curr: number, next: number, result: number[], index: number) => {
  let [unit, ten] = (curr + next)
    .toString()
    // 拆分成数组用于进位
    .split('')
    // 反转以处理没有十位的情况
    .reverse()
    .map(Number)

  // console.log(`${curr} + ${next} = ${ten ?? ''}${unit}`)
  // 将上一位的进位加上，如果没有进位则加0
  result[index] = result[index] + unit
  // 拆分当前计算位是否需要进位，拆分了之后才是当前位计算的结果
  const [indexUnit, indexTen] = result[index]
    .toString()
    .split('')
    .map(Number)
    .reverse()
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
