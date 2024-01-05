<p align="center"><a href="https://github.com/renzp94/number-correct" target="_blank" rel="noopener noreferrer"><img width="200" src="./logo.png" alt="number-correct logo"></a></p>
<p align="center">
  <a href="https://codecov.io/github/@renzp/number-correct"><img src="https://img.shields.io/codecov/c/github/@renzp/number-correct.svg?sanitize=true" alt="Coverage Status"></a>
  <a href="https://npmcharts.com/compare/@renzp/number-correct?minimal=true"><img src="https://img.shields.io/npm/dm/@renzp/number-correct.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@renzp/number-correct"><img src="https://img.shields.io/npm/v/@renzp/number-correct.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@renzp/number-correct"><img src="https://img.shields.io/npm/l/@renzp/number-correct.svg?sanitize=true" alt="License"></a>
</p>

# number-correct

基于竖式计算方式矫正js数字计算精度

## 什么是竖式计算

竖式计算就是数学中的`列竖式`。如：`123 + 456 = 579`

`加法(+)`
```js
  1 2 3
+ 4 5 6
--------
  5 7 9
```

`减法(-)`
```js
  4 5 6
- 1 2 3
--------
  3 3 3
```

`乘法(*)`
```js
                        1         2       3
  *                     2         4       5
  -------------------------------------------------------
                        500    +  100   + 15   =   615
                 4000 + 800    +  120          =  4920 +
         20000 + 4000 + 600                    = 24600 +
      ---------------------------------------------------
                                                 30135
```

`除法(/)`
```js

// ==============
3 / 8

a = [3]

1、取和除数相同位数的值：3，此时a变成[]
2、比较3 < 8 则差值为3，停止记录并统计记录为0，则求出第一个商为0。
3、判断a没有值，需要进行补位操作。
4、进行差值补位操作，差值为30.记录小数点。

执行步骤2: 30 > 8 -> 30 - 8 = 22 记录1.
执行步骤2: 22 > 8 -> 22 - 8 = 14 记录1.
执行步骤2: 14 > 8 -> 14 - 8 =  6 记录1.
执行步骤2:  6 < 8 差值为6，停止记录并统计记录为3，则求出第二个商为3.
执行步骤3：发现a中没值，判断差值6不为0，则需要进行补位操作。
执行步骤4：差值为60.此时有小数点，则不记录小数点。
执行步骤2: 60 > 8 -> 60 - 8 = 52 记录1.
执行步骤2: 52 > 8 -> 52 - 8 = 44 记录1.
执行步骤2: 44 > 8 -> 44 - 8 = 36 记录1.
执行步骤2: 36 > 8 -> 36 - 8 = 28 记录1.
执行步骤2: 28 > 8 -> 28 - 8 = 20 记录1.
执行步骤2: 20 > 8 -> 20 - 8 = 12 记录1.
执行步骤2: 12 > 8 -> 12 - 8 =  4 记录1.
执行步骤2:  4 < 8 差值为4，停止记录并统计记录为7，则求出第二个商为7.
执行步骤3：发现a中没值，判断差值4不为0，则需要进行补位操作。
执行步骤4：差值为40.此时有小数点，则不记录小数点。
执行步骤2: 40 > 8 -> 40 - 8 = 32 记录1.
执行步骤2: 32 > 8 -> 32 - 8 = 24 记录1.
执行步骤2: 24 > 8 -> 24 - 8 = 16 记录1.
执行步骤2: 16 > 8 -> 16 - 8 =  8 记录1.
执行步骤2:  8 = 8 ->  8 - 8 =  0 记录1.
执行步骤2:  0 < 8 差值为0，停止记录并统计记录为5，则求出第三个商为5.

5、差值为0且a为空，则说明求商完成。按照顺序合并商：0.375

3 / 8 = 0.375

// ==============
4221 / 20

a = [4 2 2 1]

1、取和除数相同位数的值：42，此时a变成[2 1]
2、比较42 > 20 -> 42 - 20 = 22 记录 1。
执行步骤2: 差值22 > 20 -> 22 - 20 = 2 记录 1.
执行步骤2: 差值2 < 20 停止记录并统计记录为2。则第一个商求出为：2.

3、判断a有值，则取出一个与差值合并，即：差值为22，a为[1]。
执行步骤2: 22 > 20 -> 22 - 20 = 2 记录1。
执行步骤2: 2 < 20，差值为2，停止记录并统计记录为1。则求出第二个商为：1.
执行步骤2：差值为21,a为[]
执行步骤2: 21 > 20 -> 21 - 20 = 1 记录1.
执行步骤2: 1 < 20，差值为1，停止记录并统计记录为1。则求出第三个商为：1.
执行步骤3：发现a中没值，判断差值1不为0，则需要进行补位操作。

4、进行差值补位操作，差值为10.记录小数点。
执行步骤2: 10 < 20 差值为10，停止记录并统计记录为0，则求出第四个商为：0。
执行步骤4: 差值为100.此时有小数点，则不记录小数点。
执行步骤2: 100 > 20 -> 100 - 20 = 80 记录1.
执行步骤2: 80  > 20 ->  80 - 20 = 60 记录1.
执行步骤2: 60  > 20 ->  60 - 20 = 40 记录1.
执行步骤2: 40  > 20 ->  40 - 20 = 20 记录1.
执行步骤2: 20  = 20 ->  20 - 20 = 0 记录1.
执行步骤2: 0 < 20 差值为0，停止记录并统计记录为5，则求出第五个商为5.

5、差值为0且a为空，则说明求商完成。按照顺序合并商：211.05

4221 / 20 = 211.05

// ==============
5666 / 20 / 30

a、将多个被除数相乘：20 * 30 = 600
b、计算5666 / 600

a = [5 6 6 6]

1、取和除数相同位数的值：566，此时a变成[6]
2、比较566 < 600 则差值为566，停止记录并统计记录为0，则求出第一个商为0。

3、判断a有值，则取出一个与差值合并，即：差值为5666，a为[]。
执行步骤2: 5666 > 600 -> 5666 - 600 = 5066 记录1.
执行步骤2: 5066 > 600 -> 5066 - 600 = 4466 记录1.
执行步骤2: 4466 > 600 -> 4466 - 600 = 3866 记录1.
执行步骤2: 3866 > 600 -> 3866 - 600 = 3266 记录1.
执行步骤2: 3266 > 600 -> 3266 - 600 = 2666 记录1.
执行步骤2: 2666 > 600 -> 2666 - 600 = 2066 记录1.
执行步骤2: 2066 > 600 -> 2066 - 600 = 1466 记录1.
执行步骤2: 1466 > 600 -> 1466 - 600 =  866 记录1.
执行步骤2: 866  > 600 ->  866 - 600 =  266 记录1.
执行步骤2: 266 < 600 差值为266，停止记录并统计记录为9，则求出第二个商为9.
执行步骤3：发现a中没值，判断差值266不为0，则需要进行补位操作。

4、进行差值补位操作，差值为4660.记录小数点。
执行步骤2: 2660 > 600 -> 2660 - 600 = 2060 记录1.
执行步骤2: 2060 > 600 -> 2060 - 600 = 1460 记录1.
执行步骤2: 1460 > 600 -> 1460 - 600 = 860  记录1.
执行步骤2:  860 > 600 ->  860 - 600 = 260  记录1.
执行步骤2: 260 < 600 差值为260，停止记录并统计记录为4，则求出第三个商为4.
执行步骤3：发现a中没值，判断差值260不为0，则需要进行补位操作。
执行步骤4：差值为2600.此时有小数点，则不记录小数点。
执行步骤2: 2600 > 600 -> 2600 - 600 = 2000 记录1.
执行步骤2: 2000 > 600 -> 2000 - 600 = 1400 记录1.
执行步骤2: 1400 > 600 -> 1400 - 600 =  800 记录1.
执行步骤2:  800 > 600 ->  800 - 600 =  200 记录1.
执行步骤2: 200 < 600 差值为200，停止记录并统计记录为4，则求出第二个商为4.
执行步骤3：发现a中没值，判断差值200不为0，则需要进行补位操作。
执行步骤4：差值为2000.此时有小数点，则不记录小数点。
执行步骤2: 2000 > 600 -> 2000 - 600 = 1400 记录1.
执行步骤2: 1400 > 600 -> 1400 - 600 =  800 记录1.
执行步骤2:  800 > 600 ->  800 - 600 =  200 记录1.
执行步骤2: 200 < 600 差值为200，停止记录并统计记录为3，则求出第二个商为3.
执行步骤3：发现a中没值，判断差值200不为0，则需要进行补位操作。
执行步骤4：差值为2000.此时有小数点，则不记录小数点。
执行步骤2: 2000 > 600 -> 2000 - 600 = 1400 记录1.
执行步骤2: 1400 > 600 -> 1400 - 600 =  800 记录1.
执行步骤2:  800 > 600 ->  800 - 600 =  200 记录1.
执行步骤2: 200 < 600 差值为200，停止记录并统计记录为3，则求出第二个商为3.

5、已经除不尽了，默认精度为10.则整理商为9.4433333333

5666 / 20 / 30 = 9.4433333333

// ==============
8.45 / 3.26

a、将小数变为整数，为 845 / 326，并记录除数小数为2位，被除数小数为2位

a = [8 4 5]

1、取和除数相同位数的值：845，此时a变成[]
2、比较845 > 326 -> 845 - 326 = 519 记录 1。
执行步骤2: 519 > 326 -> 519 - 326 = 193 记录 1.
执行步骤2: 193 < 326 差值为193，停止记录并统计记录为2，则求出第一个商为2.

3、判断a没有值，需要进行补位操作。
4、进行差值补位操作，差值为1930.记录小数点。
执行步骤2: 1930 > 326 -> 1930 - 326 = 1604 记录1.
执行步骤2: 1604 > 326 -> 1604 - 326 = 1278 记录1.
执行步骤2: 1278 > 326 -> 1278 - 326 =  952 记录1.
执行步骤2:  952 > 326 ->  952 - 326 =  626 记录1.
执行步骤2:  626 > 326 ->  626 - 326 =  300 记录1.
执行步骤2:  300 < 326 差值为300，停止记录并统计记录为5，则求出第二个商为5.
执行步骤3：发现a中没值，判断差值300不为0，则需要进行补位操作。
执行步骤4：差值为3000.此时有小数点，则不记录小数点。
执行步骤2: 3000 > 326 -> 3000 - 326 = 2674 记录1.
执行步骤2: 2674 > 326 -> 2674 - 326 = 2348 记录1.
执行步骤2: 2348 > 326 -> 2348 - 326 = 2022 记录1.
执行步骤2: 2022 > 326 -> 2022 - 326 = 1696 记录1.
执行步骤2: 1696 > 326 -> 1696 - 326 = 1370 记录1.
执行步骤2: 1370 > 326 -> 1370 - 326 = 1044 记录1.
执行步骤2: 1044 > 326 -> 1044 - 326 =  718 记录1.
执行步骤2:  718 > 326 ->  718 - 326 =  392 记录1.
执行步骤2:  392 > 326 ->  392 - 326 =   66 记录1.
执行步骤2:   66 < 326 差值为66，停止记录并统计记录为9，则求出第三个商为9.
执行步骤3：发现a中没值，判断差值66不为0，则需要进行补位操作。
执行步骤4：差值为660.此时有小数点，则不记录小数点。
执行步骤2: 660 > 326 -> 660 - 326 = 334 记录1.
执行步骤2: 334 > 326 -> 334 - 326 =   8 记录1.
执行步骤2: 8 < 326 差值为8，停止记录并统计记录为2，则求出第四个商为2.
执行步骤3：发现a中没值，判断差值8不为0，则需要进行补位操作。
执行步骤4：差值为80.此时有小数点，则不记录小数点。
执行步骤2: 80 < 326 差值为80，停止记录并统计记录为0，则求出第五个商为0.
执行步骤3：发现a中没值，判断差值8不为0，则需要进行补位操作。
执行步骤4：差值为800.此时有小数点，则不记录小数点。
执行步骤2: 800 > 326 -> 800 - 326 = 474 记录1.
执行步骤2: 474 > 326 -> 474 - 326 = 148 记录1.
执行步骤2: 148 < 326 差值为148，停止记录并统计记录为2，则求出第六个商为2.
执行步骤3：发现a中没值，判断差值148不为0，则需要进行补位操作。
执行步骤4：差值为1480.此时有小数点，则不记录小数点。
执行步骤2: 1480 > 326 -> 1480 - 326 = 1154 记录1.
执行步骤2: 1154 > 326 -> 1154 - 326 =  828 记录1.
执行步骤2:  828 > 326 ->  828 - 326 =  502 记录1.
执行步骤2:  502 > 326 ->  502 - 326 =  176 记录1.
执行步骤2:  176 < 326 差值为176，停止记录并统计记录为4，则求出第七个商为4.
执行步骤3：发现a中没值，判断差值176不为0，则需要进行补位操作。
执行步骤4：差值为1760.此时有小数点，则不记录小数点。
执行步骤2: 1760 > 326 -> 1760 - 326 = 1434 记录1.
执行步骤2: 1434 > 326 -> 1434 - 326 = 1108 记录1.
执行步骤2: 1108 > 326 -> 1108 - 326 =  782 记录1.
执行步骤2:  782 > 326 ->  782 - 326 =  456 记录1.
执行步骤2:  456 > 326 ->  456 - 326 =  130 记录1.
执行步骤2:  130 < 326 差值为130，停止记录并统计记录为5，则求出第八个商为5.
执行步骤3：发现a中没值，判断差值130不为0，则需要进行补位操作。
执行步骤4：差值为1300.此时有小数点，则不记录小数点。
执行步骤2: 1300 > 326 -> 1300 - 326 = 974 记录1.
执行步骤2:  974 > 326 ->  974 - 326 = 648 记录1.
执行步骤2:  648 > 326 ->  648 - 326 = 322 记录1.
执行步骤2:  322 < 326 差值为322，停止记录并统计记录为3，则求出第九个商为3.
执行步骤3：发现a中没值，判断差值322不为0，则需要进行补位操作。
执行步骤4：差值为3220.此时有小数点，则不记录小数点。
执行步骤2: 3220 > 326 ->  3220 - 326 =  2894 记录1.
执行步骤2: 2894 > 326 ->  2894 - 326 =  2568 记录1.
执行步骤2: 2568 > 326 ->  2568 - 326 =  2242 记录1.
执行步骤2: 2242 > 326 ->  2242 - 326 =  1916 记录1.
执行步骤2: 1916 > 326 ->  1916 - 326 =  1590 记录1.
执行步骤2: 1590 > 326 ->  1590 - 326 =  1264 记录1.
执行步骤2: 1264 > 326 ->  1264 - 326 =   938 记录1.
执行步骤2:  938 > 326 ->   938 - 326 =   612 记录1.
执行步骤2:  612 > 326 ->   612 - 326 =   286 记录1.
执行步骤2:  286 < 326 差值为286，停止记录并统计记录为9，则求出第十个商为9.
执行步骤3：发现a中没值，判断差值286不为0，则需要进行补位操作。
执行步骤4：差值为2860.此时有小数点，则不记录小数点。
执行步骤2: 2860 > 326 ->  2860 - 326 =  2534 记录1.
执行步骤2: 2534 > 326 ->  2534 - 326 =  2208 记录1.
执行步骤2: 2208 > 326 ->  2208 - 326 =  1882 记录1.
执行步骤2: 1882 > 326 ->  1882 - 326 =  1556 记录1.
执行步骤2: 1556 > 326 ->  1556 - 326 =  1230 记录1.
执行步骤2: 1230 > 326 ->  1230 - 326 =   904 记录1.
执行步骤2:  904 > 326 ->   904 - 326 =   578 记录1.
执行步骤2:  578 > 326 ->   578 - 326 =   252 记录1.
执行步骤2:  252 < 326 差值为252，停止记录并统计记录为8，则求出第十一个商为8.

5、精度默认为10，则整理商为2.5920245398

8.45 / 3.26 = 2.5920245398
```

> 此计算方法不管多大的数据都不会出现精度丢失问题，同时可以直接计算字符串，返回数据是字符串。

## 安装

```sh
npm install @renzp/number-correct
```

## 使用

```ts
import { plus } from '@renzp/number-correct'

console.log(plus(1,2,3,'44444444444444.0000000000004444444444'));
```

## 功能列表

### 算术

- [x] : `plus` - 加法(+)
- [x] : `minus` - 减法(-)
- [x] : `times` - 乘法(*)
- [x] : `divide` - 除法(/)
- [x] : `mod` - 取余(%)
- [x] : `toFixed` - 保留多少位小数(默认四舍五入)

### 比较

- [x] : `compared` - 通用比较方法
- [x] : `isGreat` - 大于(>)
- [x] : `isLess` - 小于(<)
- [x] : `isEqual` - 等于(=)
- [x] : `isGreatEqual` - 大于等于(>=)
- [x] : `isLessEqual` - 小于等于(>=)

### VNumber类

竖式计算类，可以链式调用。

```js
import { VNumber } from '@renzp/number-correct'
const vn = new VNumber(1)
// ((1 + 1 - 2 + 2) * 3 + 2) / 2
vn.plus(1).minus(2).plus(2).times(3).plus(2).divide(2)
console.log(vn.value) // 4
```