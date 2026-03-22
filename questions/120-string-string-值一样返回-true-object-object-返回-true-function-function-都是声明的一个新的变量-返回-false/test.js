/**
 * 自动同步自 sync-problem-tests：具体断言由 lib/test/problem-registry.mjs 按题目目录名分发
 * 可改 lib/test/runners/ 或本题 testcases.json（未命中定制 Runner 时）
 */
import { createProblemTest } from '../../lib/test/create-problem-test.mjs';
export default createProblemTest('120-string-string-值一样返回-true-object-object-返回-true-function-function-都是声明的一个新的变量-返回-false');
