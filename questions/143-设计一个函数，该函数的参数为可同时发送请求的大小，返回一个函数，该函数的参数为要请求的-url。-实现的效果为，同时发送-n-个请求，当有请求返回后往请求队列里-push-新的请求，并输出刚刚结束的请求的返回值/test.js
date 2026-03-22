/**
 * 自动同步自 sync-problem-tests：具体断言由 lib/test/problem-registry.mjs 按题目目录名分发
 * 可改 lib/test/runners/ 或本题 testcases.json（未命中定制 Runner 时）
 */
import { createProblemTest } from '../../lib/test/create-problem-test.mjs';
export default createProblemTest('143-设计一个函数，该函数的参数为可同时发送请求的大小，返回一个函数，该函数的参数为要请求的-url。-实现的效果为，同时发送-n-个请求，当有请求返回后往请求队列里-push-新的请求，并输出刚刚结束的请求的返回值');
