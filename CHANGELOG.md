# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.10](https://github.com/renzp94/number-correct/compare/v0.0.9...v0.0.10) (2023-10-25)


### 其他

* update README ([7bebbb6](https://github.com/renzp94/number-correct/commit/7bebbb67866a86e87f4dfe27b5bc3642c88d209f))
* update README ([4c28be4](https://github.com/renzp94/number-correct/commit/4c28be4a9d60b3ee65d7c993fc7d92fc2926965e))


### 新功能

* 兼容科学计数法 ([c74784b](https://github.com/renzp94/number-correct/commit/c74784b865ae3f143af457f228e96dc8c58f88ae))


### Bug修复

* 修复求余函数两数小数为不同时计算错误的问题 ([ea7e18a](https://github.com/renzp94/number-correct/commit/ea7e18a3c69ee647b5fca8fd7ab4eb30f47d2ebf))

### [0.0.9](https://github.com/renzp94/number-correct/compare/v0.0.8...v0.0.9) (2023-10-22)


### Bug修复

* 修复除法除数为0判断的问题 ([7fb8179](https://github.com/renzp94/number-correct/commit/7fb8179cc97e835a5f9c0fbfb8288e898b1e2122))


### 其他

* update README ([69d64f8](https://github.com/renzp94/number-correct/commit/69d64f8e5709e7ef28595024537ac8b1b531b57c))


### 新功能

* 添加求余功能 ([66c6091](https://github.com/renzp94/number-correct/commit/66c609172472b363e032fa89071a568a8ec360a9))
* 添加数字验证器 ([8c6e7d7](https://github.com/renzp94/number-correct/commit/8c6e7d710b39c13d7daca4445406798142b39dcb))

### [0.0.8](https://github.com/renzp94/number-correct/compare/v0.0.7...v0.0.8) (2023-10-20)


### 其他

* 调整注释说明 ([1a5f431](https://github.com/renzp94/number-correct/commit/1a5f4312290319109aa4846380cac78d08a6049e))
* 添加bun-types ([64986bf](https://github.com/renzp94/number-correct/commit/64986bf908aa9150f8c327b86348555ce39f1762))
* 移除调试信息 ([f84165e](https://github.com/renzp94/number-correct/commit/f84165e80757d7dff48e8f8ca2246606e329fe10))


### 代码重构

* 重写比较大小核心逻辑不使用减法而使用竖式比较 ([409534b](https://github.com/renzp94/number-correct/commit/409534b73a52f62129d774b2a5a874e539b578f9))


### Bug修复

* 修复被减数为负数时计算错误的问题 ([5a68c7b](https://github.com/renzp94/number-correct/commit/5a68c7b7fefeb7aaa887b6c20051b24621049a89))
* 修复减法处理借位时使用错了位数导致计算错误的问题 ([0591310](https://github.com/renzp94/number-correct/commit/0591310da56fec1201faea153782e5bf7e242a56))
* 修复compared函数竖式比较的问题 ([0c219d5](https://github.com/renzp94/number-correct/commit/0c219d528a877bf8e4fd0bd02735341963bef72b))


### 新功能

* 添加除法 ([e8c9867](https://github.com/renzp94/number-correct/commit/e8c986778ee09da85cdbf1326de16e3410a9a504))

### [0.0.7](https://github.com/renzp94/number-correct/compare/v0.0.6...v0.0.7) (2023-10-17)


### 其他

* 更新README ([d07c362](https://github.com/renzp94/number-correct/commit/d07c362f013f88ac3ceb6023375520734d752c81))
* 添加lint忽略目录 ([318677f](https://github.com/renzp94/number-correct/commit/318677f762b900c76af5f50e82fefaa5bcd19d0f))


### 新功能

* 添加乘法功能 ([f6c26a6](https://github.com/renzp94/number-correct/commit/f6c26a6ec3a86b0f64163ccef4dcaa4d2e093094))

### [0.0.6](https://github.com/renzp94/number-correct/compare/v0.0.5...v0.0.6) (2023-10-14)


### Bug修复

* **compared:** 修复compared函数一正一负比大小返回结果错误的问题 ([f71a4c2](https://github.com/renzp94/number-correct/commit/f71a4c2e32ef511d37f8e811f566e893de6edf16))

### [0.0.5](https://github.com/renzp94/number-correct/compare/v0.0.4...v0.0.5) (2023-10-14)


### 新功能

* 添加isGreat(>)、isLess(<)、isEqual(=)、isGreatEqual(>=)、isLessEqual(<=)快捷比较方法 ([ae51548](https://github.com/renzp94/number-correct/commit/ae51548747041d1f18e247db74ad16450d2fe7f0))

### [0.0.4](https://github.com/renzp94/number-correct/compare/v0.0.3...v0.0.4) (2023-10-14)


### 其他

* 移除无用类型声明 ([a9dc933](https://github.com/renzp94/number-correct/commit/a9dc933ceada9a6b4b0b2477dce43794b78138c5))


### 代码重构

* 抽取公共代码方法 ([ee2b380](https://github.com/renzp94/number-correct/commit/ee2b380b0ab7bd1aad4528ffd32f7a9f675b7dde))


### Bug修复

* 修复replaceBeforeInvalidZero函数在全为0时返回[]，应该返回[0]的问题 ([f8e5558](https://github.com/renzp94/number-correct/commit/f8e55582e133349af9e2530c46f85ef1cdba13f8))


### 新功能

* 添加比大小功能 ([3d3cf39](https://github.com/renzp94/number-correct/commit/3d3cf39ebe59335cb2921ee1c7e1e7a1e74bb006))

### [0.0.3](https://github.com/renzp94/number-correct/compare/v0.0.2...v0.0.3) (2023-10-12)


### 代码重构

* 调整文件名及部函数位置 ([72002db](https://github.com/renzp94/number-correct/commit/72002dbe715c7fdd461eae7539e99a51f9533a2e))
* 整理代码，抽离公共逻辑代码 ([bb9f5de](https://github.com/renzp94/number-correct/commit/bb9f5def664a4a3b88df7cb2f79f76d6602c00d6))
* 重构getVData函数 ([8262152](https://github.com/renzp94/number-correct/commit/826215218862bbc20acb6783d219e4be28f68632))


### 新功能

* 添加减法功能 ([7dd4410](https://github.com/renzp94/number-correct/commit/7dd44104fe1fb34a4626f387041ddb6c45312df6))


### Bug修复

* 修复有负数时计算错误的问题 ([bd99e6d](https://github.com/renzp94/number-correct/commit/bd99e6d28a12eff195a69c0c490189807ba01172))


### 其他

* 调整package.json中的module属性 ([f26d8df](https://github.com/renzp94/number-correct/commit/f26d8dfc838fae973bcaab78f02962edd4a98d06))
* 移除调试信息 ([1ea16fe](https://github.com/renzp94/number-correct/commit/1ea16fef3b200028de8c5444fee7b3fb5f4218b4))

### [0.0.2](https://github.com/renzp94/number-correct/compare/v0.0.1...v0.0.2) (2023-10-09)


### 其他

* 更新README及添加dts ([b7d9a95](https://github.com/renzp94/number-correct/commit/b7d9a95737c03804e2229d3af561a891204e6f3c))
* 添加package.json的description ([3ea674a](https://github.com/renzp94/number-correct/commit/3ea674ae124e29dcb80b8bc94f5835b33681dd19))

### 0.0.1 (2023-10-09)


### 新功能

* 添加加法功能 ([d62b1f0](https://github.com/renzp94/number-correct/commit/d62b1f00c45580da9bc14a9913a63acf7abb1335))
