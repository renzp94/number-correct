# times

乘法(*)。

## 基本用法

传入多个数，返回计算结果。

```ts
import { times } from '@renzp/number-correct'

times(2, 2); // 4
times(2, 2, 2); // 8
```

## 参数

| 参数       | 说明       | 类型           | 默认值 | 是否必填 |
| ---------- | ---------- | -------------- | ------ | -------- |
| ...numbers | 要相乘的数 | `Array<Value>` | -      | 是       |

```ts
type Value = string | number
```

## 返回

| 参数 | 说明     | 类型     |
| ---- | -------- | -------- |
| v    | 计算结果 | `string` |
