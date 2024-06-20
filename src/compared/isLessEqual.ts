import { Value } from '../object'
import { isEqual } from './isEqual'
import { isLess } from './isLess'

/**
 * 是否小于等于
 *
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 小于等于返回true，否则返回false
 *
 * @example
 * isLessEqual(1, 2); // true
 * isLessEqual(1, 1); // true
 * isLessEqual(1, 0); // false
 */
export const isLessEqual = (compareValue: Value, comparedValue: Value) =>
  isLess(compareValue, comparedValue) || isEqual(compareValue, comparedValue)
