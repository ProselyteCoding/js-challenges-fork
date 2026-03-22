/**
 * 自动同步自 sync-problem-tests：具体断言由 lib/test/problem-registry.mjs 按题目目录名分发
 * 可改 lib/test/runners/ 或本题 testcases.json（未命中定制 Runner 时）
 */
import { createProblemTest } from '../../lib/test/create-problem-test.mjs';
export default createProblemTest('141-写一个-mysetintervalfn,-a,-b，每次间隔-a,a+b,a+2b-的时间，然后写一个-myclear，停止上面的-mysetinterval');
