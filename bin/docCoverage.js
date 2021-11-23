#! /usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const DocumentationCoverage = require('../src/DocCoverage/index');
// const getParentAndGrandParent = require('../src/DocCoverage/DocCoverageUtils/propTypesCoverage');

class DocumentationCoverageCli {
  /**
   * find config file.
   * @returns {string|null} config file path.
   */
  static findConfigFilePath() {
    try {
      const filePath = path.resolve('./.doccoverage.json');
      fs.readFileSync(filePath);
      return filePath;
    } catch (e) {
      // ignore
    }

    try {
      const filePath = path.resolve('./.doccoverage.js');
      fs.readFileSync(filePath);
      return filePath;
    } catch (e) {
      // ignore
    }
    return null;
  }

  /**
   * create config object from config file.
   * @param {string} configFilePath - config file path.
   * @return {DocCoverageConfig} config object.
   * @private
   */
  static createConfigFromJSONFile(configFile) {
    const configFilePath = path.resolve(configFile);
    const ext = path.extname(configFilePath);
    if (ext === '.js') {
      /* eslint-disable global-require */
      // eslint-disable-next-line import/no-dynamic-require
      return require(configFilePath);
    }
    const configJSON = fs.readFileSync(configFilePath, { encode: 'utf8' });
    const config = JSON.parse(configJSON);
    return config;
  }

  static exec() {
    let config;
    const configPath = this.findConfigFilePath();
    if (configPath) {
      config = this.createConfigFromJSONFile(configPath);
    }
    if (config) {
      DocumentationCoverage.generateReport(config);
    } else {
      const defaultConfig = {
        source: './src',
        excludedPaths: [
          '/assets/',
          '/components/',
          '/containers/',
          '/__test__/',
          '/config./',
        ],
        excludedComponentPaths: ['/__test__/'],
        foldersWithJSXFiles: ['components', 'containers'],
        storiesFolderPath: './stories',
      };
      DocumentationCoverage.generateReport(defaultConfig);
    }
  }
}
DocumentationCoverageCli.exec();
