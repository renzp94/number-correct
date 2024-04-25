# VNumber

竖式计算类，可通过此类实现链式调用。

## 基本用法

创建一个实例，通过实例操作。

```ts
import { VNumber } from '@renzp/number-correct'

const v = new VNumber(1);

v.plus(1)
 .minus(2)
 .plus(2)
 .times(3)
 .plus(2)
 .divide(2);

console.log(v.value); // 4
```

## 构造函数

```ts
constructor(value: Value, configs?: VNumberConfigs)
```

| 参数    | 说明       | 类型             | 默认值 | 是否必填 |
| ------- | ---------- | ---------------- | ------ | -------- |
| value   | 要使用的数 | `Value`          | -      | 是       |
| configs | 配置       | `VNumberConfigs` | -      | 否       |


```ts
type Value = string | number
```

### configs

| 参数          | 说明                                                        | 类型            | 默认值 | 是否必填 |
| ------------- | ----------------------------------------------------------- | --------------- | ------ | -------- |
| divideConfigs | 除法配置(参考[divide参数](/math/divide#%E5%8F%82%E6%95%B0)) | `DivideConfigs` | -      | 否       |


## 属性

| 属性  | 说明     | 类型    |
| ----- | -------- | ------- |
| value | 计算结果 | `Value` |

## 方法

| 方法         | 说明     | 类型                                                |
| setConfigs   | 设置配置 | `(config: VNumberConfigs) => VNumber`               |
| plus         | 加法     | `(...values: Array<Value \| VNumber>) => VNumber`   |
| minus        | 减法     | `(...values: Array<Value \| VNumber>) => VNumber`   |
| times        | 乘法     | `(...values: Array<Value \| VNumber>) => VNumber`   |
| divide       | 除法     | `(...values: Array<Value \| VNumber>) => VNumber`   |
| mod          | 求余     | `(value: Value \| VNumber) => VNumber`              |
| toFixed      | 保留小数 | `(precision: number, rounded?: boolean) => VNumber` |
| compared     | 比大小   | `(value: Value \| VNumber) => boolean`              |
| isGreat      | 大于     | `(value: Value \| VNumber) => boolean`              |
| isLess       | 小于     | `(value: Value \| VNumber) => boolean`              |
| isEqual      | 等于     | `(value: Value \| VNumber) => boolean`              |
| isGreatEqual | 大于等于 | `(value: Value \| VNumber) => boolean`              |
| isLessEqual  | 小于等于 | `(value: Value \| VNumber) => boolean`              |
