import {
  type DivideConfigs,
  compared,
  divide,
  isEqual,
  isGreat,
  isGreatEqual,
  isLess,
  isLessEqual,
  minus,
  mod,
  plus,
  times,
  toFixed,
} from '.'

export type Value = string | number

const getValues = (values: Array<Value | VNumber>) => {
  return values.map((v) => {
    if (v instanceof VNumber) {
      return (v as VNumber).value
    } else {
      return v
    }
  })
}

export interface VNumberConfigs {
  divideConfigs?: DivideConfigs
}

/**
 * 竖式计算类
 */
class VNumber {
  #value: Value
  #divideConfigs?: DivideConfigs
  /**
   * 创建VNumber实例
   * @example
   * const vn = new VNumber(1);
   * const vNumber = new VNumber(1, { divideConfigs: { precision: 0 } });
   * @param value 实例化时的值
   * @param configs 竖式计算对象配置
   */
  constructor(value: Value, configs?: VNumberConfigs) {
    this.#value = value
    this.#divideConfigs = configs?.divideConfigs
  }
  /**
   * 对象的值
   * @example
   * const vn = new VNumber(1);
   * console.log(vn.value); // 1
   */
  get value() {
    return this.#value
  }
  /**
   * 设置配置
   * @example
   * const vn = new VNumber(1);
   * vn.setConfigs({ divideConfigs: { precision: 0 } });
   * @param configs 配置参数
   * @returns 当前实例
   */
  setConfigs(configs: VNumberConfigs) {
    this.#divideConfigs = configs?.divideConfigs

    return this
  }
  /**
   * 加法
   * @example
   * const vn = new VNumber(1);
   * vn.plus(1); // 2
   * @param values 要相加的数
   * @returns 当前实例
   */
  plus(...values: Array<Value | VNumber>) {
    const vList = getValues(values)
    this.#value = plus(this.#value, ...vList)

    return this
  }
  /**
   * 减法
   * @example
   * const vn = new VNumber(1);
   * vn.minus(1); // 0
   * @param values 要相减的数
   * @returns 当前实例
   */
  minus(...values: Array<Value | VNumber>) {
    const vList = getValues(values)
    this.#value = minus(this.#value, ...vList)

    return this
  }
  /**
   * 乘法
   * @example
   * const vn = new VNumber(1);
   * vn.times(2, 2); // 4
   * vn.times(2, 2, 2); // 8
   * @param values 要相乘的数
   * @returns 当前实例
   */
  times(...values: Array<Value | VNumber>) {
    const vList = getValues(values)
    this.#value = times(this.#value, ...vList)

    return this
  }
  /**
   * 除法
   * @example
   * const vn = new VNumber(8);
   * vn.divide(2); // 4
   * vn.divide(2, 2); // 1
   * const vNumber = new VNumber(20);
   * vNumber.setConfigs({ divideConfigs: { precision: 0 } }).divide(3); // 7
   * vNumber.setConfigs({ divideConfigs: { precision: 2, rounded: false } }).divide(3); // 6.66
   * @param values 要相除的数
   * @returns 当前实例
   */
  divide(...values: Array<Value | VNumber>) {
    const vList = getValues(values)
    this.#value = divide(this.#value, vList, this.#divideConfigs)

    return this
  }
  /**
   * 求余
   * @example
   * const vn = new VNumber(5);
   * vn.mod(2); // 1
   * @param values 被求余数
   * @returns 当前实例
   */
  mod(value: Value | VNumber) {
    const [v] = getValues([value])
    this.#value = mod(this.#value, v)
    return this
  }
  /**
   * 保留小数位
   * @example
   * const vn = new VNumber(5.333);
   * vn.toFixed(5.33333333, 0); // 5
   * vn.toFixed(5.33333333, 2); // 5.33
   * vn.toFixed(5.66666666, 2); // 5.67
   * vn.toFixed(5.66666666, 2, false); // 5.66
   * @param precision 保留位数
   * @param rounded 是否四舍五入
   * @returns 当前实例
   */
  toFixed(precision: number, rounded?: boolean) {
    this.#value = toFixed(this.#value, precision, rounded)

    return this
  }
  /**
   * 比大小
   * @example
   * const vn = new VNumber(1);
   * vn.compared(2); // -1
   * vn.compared(1); // 0
   * vn.compared(0); // 1
   * @param compareValue 比较值
   * @param comparedValue 被比较值
   * @returns >: 返回1 =: 返回0 <: 返回-1
   */
  compared(value: Value | VNumber) {
    const [v] = getValues([value])
    return compared(this.#value, v)
  }
  /**
   * 是否大于
   * @example
   * const vn = new VNumber(1);
   * vn.isGreat(2); // false
   * vn.isGreat(1); // false
   * vn.isGreat(0); // true
   * @param values 被比较数
   * @returns 大于返回true，否则返回false
   */
  isGreat(value: Value | VNumber) {
    const [v] = getValues([value])
    return isGreat(this.#value, v)
  }
  /**
   * 是否小于
   * @example
   * const vn = new VNumber(1);
   * vn.isLess(2); // true
   * vn.isLess(1); // false
   * vn.isLess(0); // false
   * @param values 被比较数
   * @returns 小于返回true，否则返回false
   */
  isLess(value: Value | VNumber) {
    const [v] = getValues([value])
    return isLess(this.#value, v)
  }
  /**
   * 是否等于
   * @example
   * const vn = new VNumber(1);
   * vn.isEqual(2); // false
   * vn.isEqual(1); // true
   * vn.isEqual(0); // false
   * @param values 被比较数
   * @returns 等于返回true，否则返回false
   */
  isEqual(value: Value | VNumber) {
    const [v] = getValues([value])
    return isEqual(this.#value, v)
  }
  /**
   * 是否大于等于
   * @example
   * const vn = new VNumber(1);
   * vn.isGreat(2); // false
   * vn.isGreat(1); // true
   * vn.isGreat(0); // false
   * @param values 被比较数
   * @returns 等于返回true，否则返回false
   */
  isGreatEqual(value: Value | VNumber) {
    const [v] = getValues([value])
    return isGreatEqual(this.#value, v)
  }
  isLessEqual(value: Value | VNumber) {
    const [v] = getValues([value])
    return isLessEqual(this.#value, v)
  }
}

export default VNumber
