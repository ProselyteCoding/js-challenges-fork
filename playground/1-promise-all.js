export default function (MyPromise) {
  MyPromise.all = function (promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }

      const results = [];
      let remaining = promises.length;

      if (remaining === 0) {
        return resolve(results);
      }

      promises.forEach((p, index) => {
        MyPromise.resolve(p)
          .then((value) => {
            results[index] = value;
            remaining -= 1;
            if (remaining === 0) {
              resolve(results);
            }
          })
          .catch(reject);
      });
    });
  };
}