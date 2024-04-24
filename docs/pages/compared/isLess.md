# isLess

是否小于。

## 基本用法

传入比较值和被比较值，如果小于返回`true`，否则返回`false`。

```ts
import { isLess } from '@renzp/number-correct'

isGreat(1, 2); // true
isGreat(1, 1); // false
isGreat(1, 0); // false
```

## 参数

| 参数          | 说明     | 类型    | 默认值 | 是否必填 |
| ------------- | -------- | ------- | ------ | -------- |
| compareValue  | 比较值   | `Value` | -      | 是       |
| comparedValue | 被比较值 | `Value` | -      | 是       |

```ts
type Value = string | number
```

## 返回

| 参数 | 说明     | 类型      |
| ---- | -------- | --------- |
| v    | 比较结果 | `boolean` |
