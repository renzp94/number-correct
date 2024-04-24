# 快速开始

## 安装

::: code-group

```sh [npm]
$ npm add @renzp/number-correct
```

```sh [pnpm]
$ pnpm add @renzp/number-correct
```

```sh [yarn]
$ yarn add @renzp/number-correct
```

```sh [bun]
$ bun add @renzp/number-correct
```

:::


## 使用

```ts
import { plus } from '@renzp/number-correct'

console.log(plus('1.0000000334', '99999999999999999', 123)); // 100000000000000123.0000000334
```
