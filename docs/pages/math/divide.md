# divide

除法(/)。

## 基本用法

传入除数和被除数数组，返回计算结果。

```ts
import { divide } from '@renzp/number-correct'

divide(4, [2]); // 2
divide(8, [2, 2]); // 2
// 可通过precision控制精度，0表示只要整数
divide(10, [3], { precision: 0 }); // 3
divide(10, [3], { precision: 2 }); // 3.33
// 可通过rounded控制是否四舍五入，默认为true
divide(20, [3], { precision: 0 }); // 7
divide(20, [3], { precision: 2, rounded: false }); // 6.66
```

## 参数

| 参数    | 说明       | 类型            | 默认值 | 是否必填 |
| ------- | ---------- | --------------- | ------ | -------- |
| divisor | 除数       | `Value`         | -      | 是       |
| numbers | 被除数数组 | `Array<Value>`  | -      | 是       |
| configs | 配置       | `DivideConfigs` | -      | 否       |

```ts
type Value = string | number
```

### configs

| 参数      | 说明         | 类型      | 默认值 | 是否必填 |
| --------- | ------------ | --------- | ------ | -------- |
| precision | 精度         | `number`  | `10`   | 否       |
| rounded   | 是否四舍五入 | `boolean` | `true` | 否       |


## 返回

| 参数 | 说明     | 类型     |
| ---- | -------- | -------- |
| v    | 计算结果 | `string` |
