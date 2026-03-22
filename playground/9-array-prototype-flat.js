/**
 * 9-array-prototype-flat
 * @param {any} input - 输入参数
 * @returns {any} - 返回结果
 */
function MyFlat(depth = 1) {
  // 1. 校验调用者是否为数组（非数组调用抛错，贴近原生）
  if (!Array.isArray(this)) {
    throw new TypeError('myFlat must be called on an array');
  }

  // 2. 终止条件：深度≤0 时返回当前数组的副本（避免修改原数组）
  if (depth <= 0) {
    return this.slice();
  }

  // 3. 核心逻辑：reduce + 递归
  return this.reduce((acc, current) => {
    // 如果当前项是数组，递归调用 myFlat（深度-1）；否则直接拼接
    return acc.concat(
      Array.isArray(current) ? current.myFlat(depth - 1) : current
    );
  }, []); // 初始值为空数组，用于收集结果
}

Array.MyFlat = MyFlat;

// 导出解决方案
export default MyFlat;
