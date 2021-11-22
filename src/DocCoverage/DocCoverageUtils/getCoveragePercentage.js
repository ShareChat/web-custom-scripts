const getCoveragePercentage = (actualCount, expectedCount) =>
  Math.floor((10000 * actualCount) / expectedCount) / 100;
module.exports = getCoveragePercentage;
