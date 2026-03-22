/**
 * 自动同步自 sync-problem-tests：具体断言由 lib/test/problem-registry.mjs 按题目目录名分发
 * 可改 lib/test/runners/ 或本题 testcases.json（未命中定制 Runner 时）
 */
import { createProblemTest } from '../../lib/test/create-problem-test.mjs';
export default createProblemTest('232-现在有一个进度条，进度条中间有一串文字，当我的进度条覆盖了文字之后，文字要去进度条反色，怎么实现？');
