/**
 * 12-array-prototype-filter
 * 自定义实现 Array.prototype.filter 方法
 * @param {Function} callbackFn - 回调函数，参数：element, index, array，返回布尔值
 * @param {any} [thisArg] - 回调函数执行时的 this 指向（可选）
 * @returns {Array} - 符合条件的元素组成的新数组
 */
function MyFilter(callbackFn, thisArg) {
    // 1. 校验调用者是否为数组（或类数组），this 就是原数组
    // if (this == null) {
    //     throw new TypeError('Array.prototype.MyFilter called on null or undefined');
    // }
    // if (typeof callbackFn !== 'function') {
    //     throw new TypeError(`${callbackFn} is not a function`);
    // }

    // 2. 将 this 转为数组（处理类数组场景），获取原数组
    const originalArray = Object(this);
    // 3. 获取数组长度（处理稀疏数组）
    const len = originalArray.length >>> 0; // 无符号右移，确保是正整数
    if(len === 0) return null;

    const res = [];

    // 4. 遍历原数组的每一项
    for (let i = 0; i < len; i++) {
        // 只处理数组中实际存在的索引（兼容稀疏数组）
        if (i in originalArray) {
            const element = originalArray[i];
            // 5. 调用回调函数，传递正确的参数和 this 指向
            const isMatch = callbackFn.call(thisArg, element, i, originalArray);
            // 6. 回调返回 true 则加入结果数组
            if (isMatch) {
                res.push(element);
            }
        }
    }

    return res;
}

// 挂载到 Array.prototype 上，让所有数组都能调用
// Array.prototype.MyFilter = MyFilter;

// 导出（如果需要单独导出函数，也可以保留）
export default MyFilter;