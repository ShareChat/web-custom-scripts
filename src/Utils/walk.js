const fs = require('fs-extra');
const path = require('path');
/**
 * walk recursive in directory.
 * @param {string} dirPath - target directory path.
 * @param {function(entryPath: string)} callback - callback for each file.
 */
function walk(dirPath, callback) {
  const entries = fs.readdirSync(dirPath);
  entries.forEach((entry) => {
    const entryPath = path.resolve(dirPath, entry);
    const stat = fs.statSync(entryPath);
    if (stat.isFile()) {
      callback(entryPath);
    } else if (stat.isDirectory()) {
      walk(entryPath, callback);
    }
  });
}

module.exports = walk;
