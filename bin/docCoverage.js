#! /usr/bin/env node

const fs = require("fs-extra");
const path = require("path");

class DocumentationCoverage {
  /**
   * Generate documentation.
   * @param {DocCoverageConfig} config - config for calculation coverage
   */

  /**
   * walk recursive in directory.
   * @param {string} dirPath - target directory path.
   * @param {function(entryPath: string)} callback - callback for each file.
   * @private
   */
  static _walk(dirPath, callback) {
    const entries = fs.readdirSync(dirPath); //gives an array of all files and folders in dirPath
    for (const entry of entries) {
      const entryPath = path.resolve(dirPath, entry); //generates complete path (/Users/...) as dirpath(./src) is relative
      const stat = fs.statSync(entryPath); //has functions which tell if given node is a file or dir
      if (stat.isFile()) {
        callback(entryPath);
      } else if (stat.isDirectory()) {
        this._walk(entryPath, callback);
      }
    }
  }

  /**
   * create config object from config file.
   * @param {string} configFilePath - config file path.
   * @return {DocCoverageConfig} config object.
   * @private
   */
  static _createConfigFromJSONFile(configFilePath) {
    configFilePath = path.resolve(configFilePath);
    const ext = path.extname(configFilePath);
    if (ext === ".js") {
      return require(configFilePath);
    } else {
      const configJSON = fs.readFileSync(configFilePath, { encode: "utf8" });
      const config = JSON.parse(configJSON);
      return config;
    }
  }

  /**
   * create config object from config file.
   * @param {string} configFilePath - config file path.
   * @return {DocCoverageConfig} config object.
   * @private
   */
  static _createConfigFromJSONFile(configFilePath) {
    configFilePath = path.resolve(configFilePath);
    const ext = path.extname(configFilePath);
    if (ext === ".js") {
      return require(configFilePath);
    } else {
      const configJSON = fs.readFileSync(configFilePath, { encode: "utf8" });
      const config = JSON.parse(configJSON);
      return config;
    }
  }

  /**
   * create config object from package.json.
   * @return {DocCoverageConfig|null} config object.
   * @private
   */
  static _createConfigFromPackageJSON() {
    try {
      const filePath = path.resolve("./package.json");
      const packageJSON = fs.readFileSync(filePath, "utf8").toString();
      const packageObj = JSON.parse(packageJSON);
      return packageObj.docCoverage;
    } catch (e) {
      // ignore
    }

    return null;
  }

  /**
   * find config file.
   * @returns {string|null} config file path.
   * @private
   */
  static _findConfigFilePath() {
    try {
      const filePath = path.resolve("./.doccoverage.json");
      fs.readFileSync(filePath);
      return filePath;
    } catch (e) {
      // ignore
    }

    try {
      const filePath = path.resolve("./.doccoverage.js");
      fs.readFileSync(filePath);
      return filePath;
    } catch (e) {
      // ignore
    }

    return null;
  }

  static _generateReport(config) {
    let results = [];
    let actualCount = 0;
    let expectedCount = 0;
    const isExcluded = (path) => {
      if (config.excludedPaths && config.excludedPaths.length > 0) {
        for (let i = 0; i < config.excludedPaths.length; i++) {
          if (path.match(config.excludedPaths[i])) {
            return true;
          }
        }
      }
      return false;
    };
    this._walk(config.source, (filePath) => {
      console.log(isExcluded(filePath));
      if (!isExcluded(filePath)) {
        const fileData = fs.readFileSync(filePath, "utf8");
        const numOfExports = fileData.match(/export /g)?.length;
        const numOfDocumentationComments =
          fileData.match(/\/\*\*\s*\n([^\*]|(\*(?!\/)))*\*\//g)?.length ?? 0;
        expectedCount++;
        if (fileData.startsWith("/**" && !numOfExports)) {
          actualCount++;
        } else if (numOfExports && numOfExports > 0) {
          expectedCount--;
          expectedCount += numOfExports;
          actualCount +=
            numOfDocumentationComments > numOfExports
              ? numOfExports
              : numOfDocumentationComments; //see careerUtils.js
        }
      }
      results.push(filePath);
    });
    const coveragePercent =
      expectedCount === 0
        ? 0
        : Math.floor((10000 * actualCount) / expectedCount) / 100;
    console.log("Total Scopes: " + expectedCount);
    console.log("Documented Scopes: " + actualCount);
    console.log("Coverage Percentage: " + coveragePercent);
  }

  static _exec() {
    let config;
    const configPath = this._findConfigFilePath();
    if (configPath) {
      config = this._createConfigFromJSONFile(configPath);
    } else {
      config = this._createConfigFromPackageJSON();
    }
    if (config) {
      this._generateReport(config);
    } else {
      this._showHelp(); //TO DO: implement _showHelp
      process.exit(1);
    }
  }
}
DocumentationCoverage._exec();
