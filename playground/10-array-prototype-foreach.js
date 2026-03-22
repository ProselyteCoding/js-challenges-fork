/**
 * 10-array-prototype-foreach
 * @param {any} input - 输入参数
 * @returns {any} - 返回结果
 */
function MyForEach(callbackFn, thisArg) {
    const originalArray = Object(this);
    const length = originalArray.length >>> 0;

    for(let i = 0 ; i < length ; i++) {
        if(i in originalArray) {
            const element = originalArray[i];
            callbackFn.call(thisArg, element, i, originalArray);
        }
    }

    return undefined;
}

Array.prototype.MyForEach = MyForEach;

// 导出解决方案
export default MyForEach;
