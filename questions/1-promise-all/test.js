/**
 * @param {Mocha.MochaGlobals['describe']} describe
 * @param {Mocha.MochaGlobals['it']} it
 * @param {import('vitest').expect} expect
 * @param {(MyPromise: typeof Promise) => void} code  题目实现函数
 */
export default function test(describe, it, expect, code) {
  function createMyPromise() {
    class MyPromise extends Promise {}
    if (typeof code === 'function') {
      code(MyPromise);
    }
    return MyPromise;
  }

  describe('Promise.all', () => {
    it('应该按顺序返回所有结果', async () => {
      const MyPromise = createMyPromise();

      const p1 = MyPromise.resolve(1);
      const p2 = MyPromise.resolve(
        new Promise((resolve) => setTimeout(() => resolve(2), 5)),
      );
      const p3 = 3; // 非 Promise 值

      const result = await MyPromise.all([p1, p2, p3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('有任意一个 Promise reject 时应立即 reject', async () => {
      const MyPromise = createMyPromise();

      const error = new Error('fail');
      const p1 = MyPromise.resolve(1);
      const p2 = MyPromise.reject(error);
      const p3 = MyPromise.resolve(3);

      await expect(MyPromise.all([p1, p2, p3])).rejects.toThrowError('fail');
    });

    it('空数组应立即 resolve 空数组', async () => {
      const MyPromise = createMyPromise();
      const result = await MyPromise.all([]);
      expect(result).toEqual([]);
    });

    it('非数组参数应抛出 TypeError', async () => {
      const MyPromise = createMyPromise();
      // @ts-ignore
      await expect(MyPromise.all(123)).rejects.toBeInstanceOf(TypeError);
    });
  });
}