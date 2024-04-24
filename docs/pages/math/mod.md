# mod

求余(%)。

## 基本用法

传入求余数和被求余数，返回计算结果。

```ts
import { mod } from '@renzp/number-correct'

mod(5, 3); // 1
```

## 参数

| 参数     | 说明     | 类型    | 默认值 | 是否必填 |
| -------- | -------- | ------- | ------ | -------- |
| divisor  | 求余数   | `Value` | -      | 是       |
| dividend | 被求余数 | `Value` | -      | 是       |

```ts
type Value = string | number
```

## 返回

| 参数 | 说明     | 类型     |
| ---- | -------- | -------- |
| v    | 计算结果 | `string` |
