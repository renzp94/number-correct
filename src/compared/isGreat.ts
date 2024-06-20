import { compared } from '.'
import { Value } from '../object'

/**
 * 是否大于
 *
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 大于返回true，否则返回false
 *
 * @example
 * isGreat(1, 2); // false
 * isGreat(1, 1); // false
 * isGreat(1, 0); // true
 */
export const isGreat = (compareValue: Value, comparedValue: Value) =>
  compared(compareValue, comparedValue) === 1
