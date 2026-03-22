/**
 * 约定：默认导出为 (BasePromise) => void，在 BasePromise 上挂载静态方法 / 原型方法
 * 子类会继承 Promise 的静态/原型方法，测试前会先遮蔽，避免「未实现仍通过」。
 */

function noPolyfillPlaceholder(solution) {
  const src = Function.prototype.toString.call(solution);
  if (src.includes('请在这里实现您的解决方案')) {
    throw new Error('请实现题目并删除模板占位注释');
  }
}

/** @param {typeof Promise} P */
function shadowStatics(P, names) {
  for (const n of names) {
    Object.defineProperty(P, n, {
      value: undefined,
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
}

/** @param {typeof Promise} P */
function shadowPrototype(P, names) {
  for (const n of names) {
    Object.defineProperty(P.prototype, n, {
      value: undefined,
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
}

export function runPromiseAllSettled(describe, it, expect, solution, _fullName) {
  describe('Promise.allSettled', () => {
    it('类型', () => expect(typeof solution).toBe('function'));
    it('占位', () => noPolyfillPlaceholder(solution));
    it('全 fulfilled', async () => {
      class P extends Promise {}
      shadowStatics(P, ['allSettled', 'resolve', 'reject']);
      solution(P);
      const r = await P.allSettled([P.resolve(1), P.resolve(2)]);
      expect(r.map((x) => x.status)).toEqual(['fulfilled', 'fulfilled']);
      expect(r.map((x) => x.value)).toEqual([1, 2]);
    });
    it('含 rejected', async () => {
      class P extends Promise {}
      shadowStatics(P, ['allSettled', 'resolve', 'reject']);
      solution(P);
      const e = new Error('x');
      const r = await P.allSettled([P.resolve(1), P.reject(e)]);
      expect(r[0].status).toBe('fulfilled');
      expect(r[1].status).toBe('rejected');
      expect(r[1].reason).toBe(e);
    });
  });
}

export function runPromiseRace(describe, it, expect, solution, _fullName) {
  describe('Promise.race', () => {
    it('类型', () => expect(typeof solution).toBe('function'));
    it('占位', () => noPolyfillPlaceholder(solution));
    it('先完成者获胜', async () => {
      class P extends Promise {}
      shadowStatics(P, ['race']);
      solution(P);
      const v = await P.race([
        new P((res) => res(1)),
        new P((res) => setTimeout(() => res(2), 50)),
      ]);
      expect(v).toBe(1);
    });
  });
}

export function runPromisePrototypeFinally(describe, it, expect, solution, _fullName) {
  describe('Promise.prototype.finally', () => {
    it('类型', () => expect(typeof solution).toBe('function'));
    it('占位', () => noPolyfillPlaceholder(solution));
    it('fulfill 后执行', async () => {
      class P extends Promise {}
      shadowStatics(P, ['resolve']);
      shadowPrototype(P, ['finally']);
      solution(P);
      let n = 0;
      await P.resolve(1).finally(() => {
        n = 1;
      });
      expect(n).toBe(1);
    });
  });
}

export function runPromisePrototypeCatch(describe, it, expect, solution, _fullName) {
  describe('Promise.prototype.catch', () => {
    it('类型', () => expect(typeof solution).toBe('function'));
    it('占位', () => noPolyfillPlaceholder(solution));
    it('捕获 reject', async () => {
      class P extends Promise {}
      shadowStatics(P, ['reject', 'resolve']);
      shadowPrototype(P, ['catch']);
      solution(P);
      const v = await P.reject(42).catch((e) => e);
      expect(v).toBe(42);
    });
  });
}

export function runPromiseResolve(describe, it, expect, solution, _fullName) {
  describe('Promise.resolve', () => {
    it('类型', () => expect(typeof solution).toBe('function'));
    it('占位', () => noPolyfillPlaceholder(solution));
    it('包装值', async () => {
      class P extends Promise {}
      shadowStatics(P, ['resolve']);
      solution(P);
      expect(await P.resolve(7)).toBe(7);
    });
  });
}

export function runPromiseReject(describe, it, expect, solution, _fullName) {
  describe('Promise.reject', () => {
    it('类型', () => expect(typeof solution).toBe('function'));
    it('占位', () => noPolyfillPlaceholder(solution));
    it('拒绝', async () => {
      class P extends Promise {}
      shadowStatics(P, ['reject', 'resolve']);
      shadowPrototype(P, ['catch']);
      solution(P);
      await expect(P.reject(9)).rejects.toBe(9);
    });
  });
}
