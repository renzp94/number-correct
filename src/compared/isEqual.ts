import { compared } from '.'
import { Value } from '../object'

/**
 * 是否等于
 *
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 等于返回true，否则返回false
 *
 * @example
 * isEqual(1, 2); // false
 * isEqual(1, 1); // true
 * isEqual(1, 0); // false
 */
export const isEqual = (compareValue: Value, comparedValue: Value) =>
  compared(compareValue, comparedValue) === 0
