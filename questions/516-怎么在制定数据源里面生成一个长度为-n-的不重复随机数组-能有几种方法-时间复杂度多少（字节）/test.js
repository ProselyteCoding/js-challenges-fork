/**
 * 自动同步自 sync-problem-tests：具体断言由 lib/test/problem-registry.mjs 按题目目录名分发
 * 可改 lib/test/runners/ 或本题 testcases.json（未命中定制 Runner 时）
 */
import { createProblemTest } from '../../lib/test/create-problem-test.mjs';
export default createProblemTest('516-怎么在制定数据源里面生成一个长度为-n-的不重复随机数组-能有几种方法-时间复杂度多少（字节）');
