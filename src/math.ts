import { isGreatEqual, isLess, minus, plus } from '.'
import {
  createNumberArray,
  createVCalc,
  getThanZeroIndex,
  replaceInvalidZero,
  transformNumberArray,
} from './utils'

export type Operation = (
  curr: number,
  next: number,
  result: number[],
  index: number,
  currList: number[],
  nextList: number[],
) => number[]

/**
 * 加法
 * @param curr 当前值
 * @param next 下一个值
 * @param result 初始数组
 * @param index 初始数组当前下标
 * @returns 相加之后的数组
 */
const _plus: Operation = (curr, next, result, index) => {
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

/**
 * 减法
 * @param curr 当前值
 * @param next 下一个值
 * @param result 初始数组
 * @param index 初始数组当前下标
 * @returns 相减之后的数组
 */
const _minus: Operation = (curr, next, result, index, currList) => {
  // 被借数值(负数)
  let borrowValue = result[index]
  // 如果被借过则需要算上被借数值
  if (borrowValue < 0) {
    // 当前值+被借数值 < 0 则说明当前位已经向高位借位了
    // > -10说明当前还未借完，则将被借数值设置成正确的值
    const currV = curr + borrowValue
    if (currV < 0 && currV > -10) {
      borrowValue = 10 + result[index]
    }
  }

  let v = curr + borrowValue - next

  // 如果不够减并且还有高位则做借位处理
  if (v < 0 && index < result.length - 1) {
    // 通过记录的借位信息重新计算一下currList
    const computedCurrList = currList.map((item, i) => {
      if (i >= index) {
        const borrowValue = result[i]
        return item + borrowValue
      }

      return item
    })
    // 获取可以借位的下标和值
    const borrowIndex = getThanZeroIndex(computedCurrList, index)
    // 如果存在可借的位则做借位处理
    if (borrowIndex > 0) {
      // 借一位给当前数
      const currV = Number(`1${curr}`) + result[index]
      // 重新计算值
      v = currV - next
      // 借位的位数值使用-1记一下
      result[borrowIndex] = result[borrowIndex] - 1
      let iterationIndex = index

      do {
        result[iterationIndex] = result[iterationIndex] - 1
        iterationIndex++
      } while (iterationIndex < borrowIndex)
    }
  }
  // 最后一位且向高位借过位标记借过1次，主要是用于小数向整数借位
  if (index === result.length - 1 && curr + result[index] - next < 0) {
    result.push(1)
  }

  result[index] = v

  return result
}

export const vPlus = createVCalc(_plus)
export const vMinus = createVCalc(_minus)

/**
 * 乘法
 * @param curr 当前值
 * @param next 下一个值
 * @param result 初始数组
 * @param index 初始数组当前下标
 * @returns 相乘之后的数组
 */
export const vTimes = (currList: number[], nextList: number[]) => {
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
 * 获取当前位的商和差值
 * @param divisor 除数一部分
 * @param dividend 被除数
 * @returns 返回[商,差值]
 */
const _divide = (divisor: string, dividend): [number, string] => {
  // 商默认为0
  let quotient = 0
  // 差值默认为减数
  let diffValue = divisor

  do {
    // 如果差值 < 被减数则停止记录并统计记录
    if (isLess(diffValue, dividend)) {
      // 得出商和差值
      return [quotient, diffValue]
    }
    const __debug_diffValue = diffValue
    // 否则进行减法计算
    diffValue = minus(diffValue, dividend)
    // 并记录+1
    quotient++
  } while (diffValue !== '0' || isGreatEqual(divisor, dividend))
}
/**
 * 除法
 * @param divisorValues 部分除数
 * @param dividend 被除数
 * @param precision 精度
 * @returns 返回计算的商
 */
export const vDivide = (
  divisorValues: string[],
  dividend: string,
  precision: number,
) => {
  const divisorList = [...divisorValues]
  // 取并从数组中移除 和除数相同位数的值，并作为默认差值
  let divisor = divisorList.splice(0, dividend.length).join('')
  const result = []

  do {
    const [quotient, diffV] = _divide(divisor, dividend)
    divisor = diffV
    result.push(quotient)
    // 判断数组中是否还有值
    if (divisorList.length > 0) {
      // 有值则首位进行补位
      divisor += divisorList.shift()
      // 判断是否差值为0，不为0则需要再次计算
    } else if (divisor !== '0') {
      // 没有值则进行0补位
      divisor += '0'
      // 差值补位0时，如果没有小数点，则记录小数点
      if (!result.includes('.')) {
        result.push('.')
      }
    }

    const [_, decimal] = result.join('').split('.')
    if (decimal?.length === precision) {
      break
    }
  } while (divisor !== '0')

  return replaceInvalidZero(result.join(''))
}
/**
 * 求余
 * @param divisorValues 部分除数
 * @param dividend 被求余数
 * @returns 返回计算的余数
 */
export const vMod = (divisorValues: string[], dividend: string) => {
  const divisorList = [...divisorValues]
  // 取并从数组中移除 和被求余数相同位数的值，并作为默认差值
  let divisor = divisorList.splice(0, dividend.length).join('')
  let remainder = divisor

  do {
    const [_, diffV] = _divide(divisor, dividend)
    divisor = diffV
    // 判断数组中是否还有值
    if (divisorList.length > 0) {
      // 有值则首位进行补位
      divisor += divisorList.shift()
    } else {
      // 没有值则说明差值就是余数
      remainder = diffV
      break
    }
  } while (divisorList.length >= 0)

  return replaceInvalidZero(remainder)
}
