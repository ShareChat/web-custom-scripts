const fs = require('fs-extra');

class StorybookCoverage {
  /**
   * if a component is imported in stories, remove it from componentsMap.
   * @returns {object} new components map
   */
  static removeFilesWithStories(filePath, components) {
    const componentsMap = components;
    if (filePath.match(/.stories./g)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const lines = fileData.split('\n');
      const linesWithImports = lines.filter((line) => line.match(/import /));

      for (let i = 0; i < linesWithImports.length; i += 1) {
        const typeOfQuoteUsed = linesWithImports[i].includes("'") ? "'" : '"';
        const startIndex = linesWithImports[i].indexOf(typeOfQuoteUsed);
        const lastIndex = linesWithImports[i].lastIndexOf(typeOfQuoteUsed);
        const fileAddress = linesWithImports[i].slice(
          startIndex + 3, // to remove alias @/ or .. or ./
          lastIndex
        );
        const componentsMapKeys = Object.keys(componentsMap);
        for (let j = 0; j < componentsMapKeys.length; j += 1) {
          if (componentsMapKeys[j].match(fileAddress)) {
            componentsMap[componentsMapKeys[j]].hasStory = true;
            componentsMap[componentsMapKeys[j]].coverage = 100;
          }
        }
      }
    }
    return componentsMap;
  }
}

module.exports = StorybookCoverage;
