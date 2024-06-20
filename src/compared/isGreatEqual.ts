import { Value } from '../object'
import { isEqual } from './isEqual'
import { isGreat } from './isGreat'

/**
 * 是否大于等于
 *
 * @param compareValue 比较值
 * @param comparedValue 被比较值
 * @returns 大于等于返回true，否则返回false
 *
 * @example
 * isGreatEqual(1, 2); // false
 * isGreatEqual(1, 1); // true
 * isGreatEqual(1, 0); // true
 */
export const isGreatEqual = (compareValue: Value, comparedValue: Value) =>
  isGreat(compareValue, comparedValue) || isEqual(compareValue, comparedValue)
