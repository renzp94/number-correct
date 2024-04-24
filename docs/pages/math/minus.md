# minus

减法(-)。

## 基本用法

传入多个数，第一个为减数，其余的为被减数，返回计算结果。

```ts
import { minus } from '@renzp/number-correct'

minus(1, 1); // 0
minus(2, 1, 1); // 0
```

## 参数

| 参数       | 说明               | 类型           | 默认值 | 是否必填 |
| ---------- | ------------------ | -------------- | ------ | -------- |
| reduction  | 减数               | `Value`        | -      | 是       |
| ...numbers | 被减数(至少有一个) | `Array<Value>` | -      | 是       |

```ts
type Value = string | number
```

## 返回

| 参数 | 说明     | 类型     |
| ---- | -------- | -------- |
| v    | 计算结果 | `string` |
