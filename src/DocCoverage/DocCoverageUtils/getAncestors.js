/**
 * traverses in obj and searches for the passed value.
 * on finding the value, it calls the callback with an array [{greatGrandParent}, {grandParent}, {parent}]
 * @param {Array} path
 * @param {object} obj
 * @param {string} value
 * @param {Function} callback
 */
const getAncestors = (path, obj, value, callback) => {
  if (obj)
    Object.entries(obj).forEach(([key, val]) => {
      if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
        path.push({ [key]: val });
        getAncestors(path, val, value, callback);
        path.pop();
      } else if (
        Array.isArray(val) &&
        key !== 'params' &&
        key !== 'arguments'
      ) {
        val.forEach((v, i) => {
          if (typeof v === 'object' && val !== null) {
            path.push({ [`${key}[${i}]`]: v });
            getAncestors(path, v, value, callback);
            path.pop();
          }
        });
      } else if (val === value) {
        callback(path.slice(-3));
      }
    });
};

module.exports = getAncestors;
