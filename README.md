# number-correct

基于竖式计算方式矫正js数字计算精度

## 什么是竖式计算

竖式计算就是数学中的`列竖式`。如：`123 + 456 = 579`

```js
  1 2 3
+ 4 5 6
--------
  5 7 9
```

此计算方法不管多大的数据都不会出现精度丢失问题，但是唯一的不足就是，返回数据是字符串。


## 安装

```sh
npm install @renzp/number-correct
```

## 使用

```ts
import { plus } from '@renzp/number-correct'

console.log(plus(1,2,3,'44444444444444.0000000000004444444444'));
```