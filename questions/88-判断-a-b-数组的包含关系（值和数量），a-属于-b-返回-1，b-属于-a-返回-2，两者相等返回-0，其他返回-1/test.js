/**
 * 自动同步自 sync-problem-tests：具体断言由 lib/test/problem-registry.mjs 按题目目录名分发
 * 可改 lib/test/runners/ 或本题 testcases.json（未命中定制 Runner 时）
 */
import { createProblemTest } from '../../lib/test/create-problem-test.mjs';
export default createProblemTest('88-判断-a-b-数组的包含关系（值和数量），a-属于-b-返回-1，b-属于-a-返回-2，两者相等返回-0，其他返回-1');
