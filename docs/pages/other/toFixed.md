# toFixed

保留小数。

## 基本用法

传入要处理的数和精度，返回指定精度的数。默认四舍五入，可以设置`rounded`取消四舍五入。

```ts
import { toFixed } from '@renzp/number-correct'

toFixed(5.33333333, 0); // 5
toFixed(5.33333333, 2); // 5.33
toFixed(5.66666666, 2); // 5.67
toFixed(5.66666666, 2, false); // 5.66
```

## 参数

| 参数      | 说明                      | 类型      | 默认值 | 是否必填 |
| --------- | ------------------------- | --------- | ------ | -------- |
| number    | 要处理的数                | `Value`   | -      | 是       |
| precision | 精度(为0则表示只保留整数) | `number`  | -      | 是       |
| rounded   | 是否四舍五入              | `boolean` | `true` | 否       |

```ts
type Value = string | number
```

## 返回

| 参数 | 说明         | 类型     |
| ---- | ------------ | -------- |
| v    | 指定精度的数 | `string` |
