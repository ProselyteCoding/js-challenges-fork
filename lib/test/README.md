# 题目测试如何工作

## 分发入口

- `questions/<题目目录>/test.js` 一般为：

  ```js
  import { createProblemTest } from '../../lib/test/create-problem-test.mjs';
  export default createProblemTest('11-array-prototype-map');
  ```

- `lib/test/problem-registry.mjs` 根据**目录名**（如 `11-array-prototype-map`）选择 Runner。
- 未命中任何规则时，回退到 **`testcases.json` + `build-standard-tests.mjs`**（`solution(input)` 模式）。

## 新增一类题的定制测试

1. 在 `lib/test/runners/` 下实现 `runXxx(describe, it, expect, solution, fullName)`。
2. 在 `problem-registry.mjs` 的 `RULES` 数组**靠前**插入更具体的 `match`（顺序很重要）。
3. 执行 `npm run sync:tests`（会重写各题 `test.js` 为统一入口；`1-promise-all` 除外）。

## 约定摘要

| 题型 | 约定 |
|------|------|
| Array 原型方法 | 默认导出挂到 `Array.prototype.myXxx`（见各 Runner） |
| Promise 静态/原型 | 默认导出 `(P) => void`，在子类 `P` 上挂载；测试前会遮蔽继承的 `Promise.*` 以免假通过 |

## 例外

- `1-promise-all` 仍使用题目目录下**手写**的 `test.js`，不由 `sync:tests` 覆盖。
