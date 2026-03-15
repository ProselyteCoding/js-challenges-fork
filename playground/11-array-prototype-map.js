/**
 * 11-array-prototype-map
 * @param {any} input - 输入参数
 * @returns {any} - 返回结果
 */
function MyMap(callbackFn, thisArg) {
    const originalArray = Object(this);
    const length = originalArray.length >>> 0;
    if(length === 0) return null;

    const res = [];

    for(let i = 0 ; i < length ; i++) {
        if(i in originalArray) {
            const element = originalArray[i];
            res[i] = callbackFn.call(thisArg, element, i, originalArray);
        }
    }
    
    return res;
}

// 导出解决方案
export default MyMap;
