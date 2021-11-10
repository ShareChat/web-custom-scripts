#! /usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const acornLoose = require('acorn-loose');
const escodegen = require('escodegen');

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
  static walk(dirPath, callback) {
    const entries = fs.readdirSync(dirPath);
    entries.forEach((entry) => {
      const entryPath = path.resolve(dirPath, entry);
      const stat = fs.statSync(entryPath);
      if (stat.isFile()) {
        callback(entryPath);
      } else if (stat.isDirectory()) {
        this.walk(entryPath, callback);
      }
    });
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

  /**
   * create config object from package.json.
   * @return {DocCoverageConfig|null} config object.
   * @private
   */
  static createConfigFromPackageJSON() {
    try {
      const filePath = path.resolve('./package.json');
      const packageJSON = fs.readFileSync(filePath, 'utf8').toString();
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
   * filter function types.
   * @returns {Array}
   * @private
   */
  static filterAstType(ast) {
    const allowedDocType = [
      'FunctionExpression',
      'ArrowFunctionExpression',
      'FunctionDeclaration',
      'VariableDeclaration',
      'ExportNamedDeclaration',
      'ExportDefaultDeclaration',
    ];
    return ast.body.filter((e) => allowedDocType.includes(e.type));
  }

  /**
   * generates AST object
   * @returns {Object}
   * @private
   */
  static generateAstDoc(filePath) {
    const file = fs.readFileSync(filePath, 'utf8');
    const comments = [];
    const tokens = [];

    const ast = acornLoose.parse(file, {
      ecmaVersion: 2020,
      // collect ranges for each node
      ranges: true,
      // collect comments in Esprima's format !imp
      onComment: comments,
      // collect token ranges
      onToken: tokens,
    });

    // attachs comments to ast doc
    escodegen.attachComments(ast, comments, tokens);

    return this.filterAstType(ast);
  }

  static generateReport(config) {
    const results = [];
    let actualCount = 0;
    let expectedCount = 0;
    const isExcluded = (filePath) => {
      if (config.excludedPaths && config.excludedPaths.length > 0) {
        for (let i = 0; i < config.excludedPaths.length; i += 1) {
          if (filePath.match(config.excludedPaths[i])) {
            return true;
          }
        }
      }
      return false;
    };
    this.walk(config.source, (filePath) => {
      if (!isExcluded(filePath)) {
        // generates ast doc
        const astDoc = this.generateAstDoc(filePath);

        const numOfScopes = astDoc.length;

        const numOfDocumentationComments = astDoc.filter(
          (e) => e.leadingComments && e.leadingComments.length > 0
        ).length;

        expectedCount += numOfScopes;
        actualCount += numOfDocumentationComments;
      }
      results.push(filePath);
    });
    const coveragePercent =
      expectedCount === 0
        ? 0
        : Math.floor((10000 * actualCount) / expectedCount) / 100;
    console.log('Total Scopes: ', expectedCount);
    console.log('Documented Scopes: ', actualCount);
    console.log('Coverage Percentage: ', coveragePercent);
  }

  static exec() {
    let config;
    const configPath = this.findConfigFilePath();
    if (configPath) {
      config = this.createConfigFromJSONFile(configPath);
    } else {
      config = this.createConfigFromPackageJSON();
    }
    if (config) {
      this.generateReport(config);
    } else {
      // this._showHelp(); //TO DO: implement _showHelp
      process.exit(1);
    }
  }
}
DocumentationCoverage.exec();
