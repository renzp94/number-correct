# compared

通用比较。

## 基本用法

传入比较值和被比较值，`>`: 返回1、`=`: 返回0、`<`: 返回-1。

```ts
import { compared } from '@renzp/number-correct'

compared(1, 2); // -1
compared(1, 1); // 0
compared(1, 0); // 1
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

| 参数 | 说明     | 类型                  |
| ---- | -------- | --------------------- |
| v    | 比较结果 | `ComparedReturnValue` |

```ts
type ComparedReturnValue = -1 | 0 | 1
```
