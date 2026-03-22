/**
 * 每道题 test.js 的工厂：根据目录名在 problem-registry 中选不同测试逻辑
 */
import { getRunnerForProblem } from './problem-registry.mjs';

/**
 * @param {string} fullName questions 下目录名，如 11-array-prototype-map
 */
export function createProblemTest(fullName) {
  const runner = getRunnerForProblem(fullName);
  return (describe, it, expect, solution) => {
    runner(describe, it, expect, solution, fullName);
  };
}
