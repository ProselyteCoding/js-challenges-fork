/**
 * 自动同步自 sync-problem-tests：具体断言由 lib/test/problem-registry.mjs 按题目目录名分发
 * 可改 lib/test/runners/ 或本题 testcases.json（未命中定制 Runner 时）
 */
import { createProblemTest } from '../../lib/test/create-problem-test.mjs';
export default createProblemTest('133-有一堆整数，请把他们分成三份，确保每一份和尽量相等（11，42，23，4，5，6-4-5-6-11-23-42-56-78-90）');
