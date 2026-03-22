/**
 * 标准题型（export default function solution(input)）的通用测试入口。
 * 用例来自同目录下的 testcases.json（由脚本生成，可手动编辑）。
 */

function cloneForTest(value) {
  if (value === undefined || value === null) return value;
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value));
  }
}

/**
 * @param {import('vitest')['describe']} describe
 * @param {import('vitest')['it']} it
 * @param {import('vitest')['expect']} expect
 * @param {(...args: any[]) => any} solution
 * @param {{ cases?: Array<{ name?: string; input: any; expected: any }>; note?: string }} testcases
 */
export function buildStandardSolutionTests(describe, it, expect, solution, testcases) {
  const cases = Array.isArray(testcases?.cases) ? testcases.cases : [];

  describe('标准接口', () => {
    it('solution 应为函数', () => {
      expect(typeof solution).toBe('function');
    });

    it('应删除模板中的占位注释后再提交（否则视为未完成）', () => {
      const src = Function.prototype.toString.call(solution);
      if (src.includes('请在这里实现您的解决方案')) {
        throw new Error('请实现题目逻辑并删掉 template 中的「请在这里实现您的解决方案」');
      }
    });
  });

  describe('功能用例（testcases.json）', () => {
    if (cases.length === 0) {
      it.skip('本题尚未配置 cases：请在同目录 testcases.json 中追加 { "cases": [ { "input": ..., "expected": ... } ] }，或运行 npm run bootstrap:practice 从种子同步', () => {});
      return;
    }

    cases.forEach((c, index) => {
      const title = c.name || `case ${index + 1}`;
      it(title, () => {
        const input = cloneForTest(c.input);
        const out = solution(input);
        expect(out).toEqual(c.expected);
      });
    });
  });
}
