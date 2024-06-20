import { compared } from '.'
import { Value } from '../object'

/**
 * 是否小于
 *
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 小于返回true，否则返回false
 *
 * @example
 * isLess(1, 2); // true
 * isLess(1, 1); // false
 * isLess(1, 0); // false
 */
export const isLess = (compareValue: Value, comparedValue: Value) =>
  compared(compareValue, comparedValue) === -1
