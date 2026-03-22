/**
 * 「实现 Array.prototype.xxx」类题目：约定将默认导出挂到 Array.prototype 的 my* 方法上（与原生区分）
 */

function mount(name, fn) {
  // eslint-disable-next-line no-extend-native
  Array.prototype[name] = fn;
}

function unmount(name) {
  delete Array.prototype[name];
}

function noPlaceholder(solution) {
  const src = Function.prototype.toString.call(solution);
  if (src.includes('请在这里实现您的解决方案')) {
    throw new Error('请实现题目并删除模板占位注释');
  }
}

/**
 * @param {string} method 挂在 prototype 上的方法名，如 myFlat
 * @param {(name: string) => void} suite
 */
function withProto(describe, it, expect, solution, method, title, suite) {
  describe(title, () => {
    it('默认导出为函数', () => {
      expect(typeof solution).toBe('function');
    });

    it('不应仍为模板占位', () => {
      noPlaceholder(solution);
    });

    afterEach(() => {
      unmount(method);
    });

    suite(method, mount, unmount);
  });
}

export function runFlat(describe, it, expect, solution, _fullName) {
  const method = 'myFlat';
  withProto(
    describe,
    it,
    expect,
    solution,
    method,
    'Array.prototype.flat（myFlat）',
    (m, mountFn) => {
      it('深度 1 打平一层', () => {
        mountFn(m, solution);
        expect([1, [2, [3]]][m](1)).toEqual([1, 2, [3]]);
      });
      it('深度足够时完全展开', () => {
        mountFn(m, solution);
        expect([1, [2, [3]]][m](2)).toEqual([1, 2, 3]);
      });
      it('空数组', () => {
        mountFn(m, solution);
        expect([][m](1)).toEqual([]);
      });
    },
  );
}

export function runMap(describe, it, expect, solution, _fullName) {
  const method = 'myMap';
  withProto(describe, it, expect, solution, method, 'Array.prototype.map（myMap）', (m, mountFn) => {
    it('基本映射', () => {
      mountFn(m, solution);
      expect([1, 2, 3][m]((x) => x * 2)).toEqual([2, 4, 6]);
    });
    it('可传 thisArg', () => {
      mountFn(m, solution);
      const ctx = { k: 10 };
      expect([1][m](function () { return this.k; }, ctx)).toEqual([10]);
    });
  });
}

export function runFilter(describe, it, expect, solution, _fullName) {
  const method = 'myFilter';
  withProto(describe, it, expect, solution, method, 'Array.prototype.filter（myFilter）', (m, mountFn) => {
    it('筛选偶数', () => {
      mountFn(m, solution);
      expect([1, 2, 3, 4][m]((x) => x % 2 === 0)).toEqual([2, 4]);
    });
  });
}

export function runReduce(describe, it, expect, solution, _fullName) {
  const method = 'myReduce';
  withProto(describe, it, expect, solution, method, 'Array.prototype.reduce（myReduce）', (m, mountFn) => {
    it('有初始值累加', () => {
      mountFn(m, solution);
      expect([1, 2, 3, 4][m]((a, b) => a + b, 0)).toBe(10);
    });
    it('无初始值', () => {
      mountFn(m, solution);
      expect([1, 2, 3][m]((a, b) => a + b)).toBe(6);
    });
  });
}

export function runForEach(describe, it, expect, solution, _fullName) {
  const method = 'myForEach';
  withProto(describe, it, expect, solution, method, 'Array.prototype.forEach（myForEach）', (m, mountFn) => {
    it('遍历累加副作用', () => {
      mountFn(m, solution);
      let s = 0;
      [1, 2, 3][m]((x) => {
        s += x;
      });
      expect(s).toBe(6);
    });
  });
}

export function runFill(describe, it, expect, solution, _fullName) {
  const method = 'myFill';
  withProto(describe, it, expect, solution, method, 'Array.prototype.fill（myFill）', (m, mountFn) => {
    it('填充区间', () => {
      mountFn(m, solution);
      const a = new Array(3);
      a[m](1, 0, 3);
      expect(a).toEqual([1, 1, 1]);
    });
  });
}

export function runIncludes(describe, it, expect, solution, _fullName) {
  const method = 'myIncludes';
  withProto(describe, it, expect, solution, method, 'Array.prototype.includes（myIncludes）', (m, mountFn) => {
    it('包含与不含', () => {
      mountFn(m, solution);
      expect([1, 2, 3][m](2)).toBe(true);
      expect([1, 2, 3][m](4)).toBe(false);
    });
  });
}

export function runPush(describe, it, expect, solution, _fullName) {
  const method = 'myPush';
  withProto(describe, it, expect, solution, method, 'Array.prototype.push（myPush）', (m, mountFn) => {
    it('追加并返回长度', () => {
      mountFn(m, solution);
      const a = [1];
      const len = a[m](2, 3);
      expect(a).toEqual([1, 2, 3]);
      expect(len).toBe(3);
    });
  });
}

export function runUnshift(describe, it, expect, solution, _fullName) {
  const method = 'myUnshift';
  withProto(describe, it, expect, solution, method, 'Array.prototype.unshift（myUnshift）', (m, mountFn) => {
    it('头部插入并返回长度', () => {
      mountFn(m, solution);
      const a = [2, 3];
      const len = a[m](1);
      expect(a).toEqual([1, 2, 3]);
      expect(len).toBe(3);
    });
  });
}

export function runCopy(describe, it, expect, solution, _fullName) {
  const method = 'myCopy';
  withProto(describe, it, expect, solution, method, 'Array.prototype.copy（myCopy）', (m, mountFn) => {
    it('浅拷贝新数组', () => {
      mountFn(m, solution);
      const a = [1, { x: 1 }];
      const b = a[m]();
      expect(b).toEqual(a);
      expect(b).not.toBe(a);
    });
  });
}

export function runGetLevel(describe, it, expect, solution, _fullName) {
  const method = 'myGetLevel';
  withProto(describe, it, expect, solution, method, 'Array.prototype.getLevel（myGetLevel）', (m, mountFn) => {
    it('嵌套深度', () => {
      mountFn(m, solution);
      expect([1, [2, [3]]][m]()).toBe(3);
    });
  });
}

export function runSort(describe, it, expect, solution, _fullName) {
  const method = 'mySort';
  withProto(describe, it, expect, solution, method, 'Array.prototype.sort（mySort）', (m, mountFn) => {
    it('默认字典序', () => {
      mountFn(m, solution);
      const a = [3, 1, 2];
      a[m]();
      expect(a).toEqual([1, 2, 3]);
    });
  });
}

export function runIterator(describe, it, expect, solution, _fullName) {
  const method = 'myIterator';
  withProto(describe, it, expect, solution, method, 'Array.prototype[Symbol.iterator]（myIterator 模拟）', (m, mountFn) => {
    it('可迭代', () => {
      mountFn(m, solution);
      const a = [1, 2];
      const itor = a[m]();
      expect(typeof itor.next).toBe('function');
      expect(itor.next().value).toBe(1);
      expect(itor.next().value).toBe(2);
      expect(itor.next().done).toBe(true);
    });
  });
}
