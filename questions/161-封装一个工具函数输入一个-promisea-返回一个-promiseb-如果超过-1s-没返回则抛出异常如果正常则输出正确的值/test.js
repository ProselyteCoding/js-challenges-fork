/**
 * 自动同步自 sync-problem-tests：具体断言由 lib/test/problem-registry.mjs 按题目目录名分发
 * 可改 lib/test/runners/ 或本题 testcases.json（未命中定制 Runner 时）
 */
import { createProblemTest } from '../../lib/test/create-problem-test.mjs';
export default createProblemTest('161-封装一个工具函数输入一个-promisea-返回一个-promiseb-如果超过-1s-没返回则抛出异常如果正常则输出正确的值');
