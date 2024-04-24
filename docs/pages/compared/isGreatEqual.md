# isGreatEqual

是否大于等于。

## 基本用法

传入比较值和被比较值，如果大于等于返回`true`，否则返回`false`。

```ts
import { isGreatEqual } from '@renzp/number-correct'

isGreatEqual(1, 2); // false
isGreatEqual(1, 1); // true
isGreatEqual(1, 0); // true
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
