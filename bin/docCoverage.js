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

  static generateConsoleTable(expectedCount, actualCount, coveragePercent) {
    const array = [
      { myId: 'totalScope', title: 'Total Scopes', value: expectedCount },
      {
        myId: 'documentedScopes',
        title: 'Documented Scopes',
        value: actualCount,
      },
      {
        myId: 'coveragePercentage',
        title: 'Coverage Percentage',
        value: `${coveragePercent}%`,
      },
    ];

    const transformed = array.reduce((acc, { myId, ...x }) => {
      acc[myId] = x;
      return acc;
    }, {});

    return transformed;
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
  static createHash(ast, filePath) {
    const functionTypes = ['FunctionExpression', 'ArrowFunctionExpression'];

    const filterDeclarationTypes = (e) => {
      switch (e.type) {
        case 'FunctionDeclaration':
          return {
            functionName: e.id.name,
            functionType: e.type,
            hasLeadingComments:
              e.leadingComments?.filter((i) => i.value.startsWith('*\n'))
                .length > 0,
          };
        case 'VariableDeclaration':
        case 'ExportNamedDeclaration':
        case 'ExportDefaultDeclaration': {
          let subobj = {};

          if (e.type === 'VariableDeclaration') {
            subobj = e.declarations?.[0];
          }

          if (e.type === 'ExportNamedDeclaration') {
            subobj = e.declaration?.declarations?.[0];
          }

          if (e.type === 'ExportDefaultDeclaration') {
            subobj = e.declaration;
          }

          if (subobj?.init?.type && functionTypes.includes(subobj.init.type)) {
            return {
              functionName: subobj.id.name,
              functionType: e.type,
              hasLeadingComments:
                e.leadingComments?.filter((i) => i.value.startsWith('*\n'))
                  .length > 0,
            };
          }
          return false;
        }

        default:
          return false;
      }
    };

    const hash = {};

    const fileSplit = filePath.split('/');

    const fileName = `${fileSplit[fileSplit.length - 2]}#${
      fileSplit[fileSplit.length - 1].split('.')[0]
    }`;

    let expectedCount = 0;
    let actualCount = 0;

    for (let i = 0; i < ast.body.length; i += 1) {
      const e = ast.body[i];
      const res = filterDeclarationTypes(e);
      if (res) {
        if (!hash[fileName]?.funcCoverage) {
          hash[fileName] = { funcCoverage: {} };
        }

        hash[fileName] = {
          funcCoverage: {
            ...hash[fileName].funcCoverage,
            [res.functionName]: res.hasLeadingComments,
          },
        };

        if (res.hasLeadingComments) {
          actualCount += 1;
        }

        expectedCount += 1;
      }
    }

    if (Object.keys(hash).length > 0) {
      hash[fileName] = {
        ...hash[fileName],
        fileCoverage: `${this.getCoveragePercentage(
          actualCount,
          expectedCount
        )}%`,
        filePath,
      };
      return hash;
    }
    return null;
  }

  static getCoveragePercentage(actualCount, expectedCount) {
    return Math.floor((10000 * actualCount) / expectedCount) / 100;
  }

  static generateJsonSummary(
    astHash,
    expectedCount,
    actualCount,
    coveragePercent
  ) {
    const output = {
      expectedCount,
      actualCount,
      coveragePercent: `${coveragePercent}%`,
      fileWiseCoverage: astHash,
    };

    const dir = './doc-coverage';

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.writeFile(
      `${dir}/docCoverageSummary.json`,
      JSON.stringify(output, null, 4),
      'utf8'
    );
  }

  static getFunctionCount(response) {
    let expectedCount = 0;
    let actualCount = 0;

    Object.keys(response).forEach((property) => {
      const obj = response[property].funcCoverage;
      Object.keys(obj).forEach((innerProperty) => {
        expectedCount += 1;
        if (obj[innerProperty] === true) {
          actualCount += 1;
        }
      });
    });
    return {
      expectedCount,
      actualCount,
    };
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

    return this.createHash(ast, filePath);
  }

  static generateReport(config) {
    const results = [];
    let astHash = {};
    const componentsMap = {};
    let actualCount = 0;
    let expectedCount = 0;
    const isExcluded = (filePath, excludedPaths) => {
      if (excludedPaths && excludedPaths.length > 0) {
        for (let i = 0; i < excludedPaths.length; i += 1) {
          if (filePath.match(excludedPaths[i])) {
            return true;
          }
        }
      }
      return false;
    };
    const checkStorybookCoverage = (filePath) => {
      if (filePath.match(/.stories.js/g)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const lines = fileData.split('\n');
        const linesWithImports = lines.filter((line) => line.match(/import /));

        for (let i = 0; i < linesWithImports.length; i += 1) {
          const typeOfQuoteUsed = linesWithImports[i].includes("'") ? "'" : '"';
          const startIndex = linesWithImports[i].indexOf(typeOfQuoteUsed);
          const lastIndex = linesWithImports[i].lastIndexOf(typeOfQuoteUsed);
          const fileAddress = linesWithImports[i].slice(
            startIndex + 2, // to remove alias @
            lastIndex
          );
          const componentsMapKeys = Object.keys(componentsMap);
          for (let j = 0; j < componentsMapKeys.length; j += 1) {
            if (componentsMapKeys[j].match(fileAddress)) {
              delete componentsMap[componentsMapKeys[j]];
            }
          }
        }
      }
    };
    this.walk(config.source, (filePath) => {
      if (!isExcluded(filePath, config.excludedPaths)) {
        // generates ast doc
        const response = this.generateAstDoc(filePath);

        if (response) {
          astHash = {
            ...astHash,
            ...response,
          };

          const resultObj = this.getFunctionCount(response);
          expectedCount += resultObj.expectedCount;
          actualCount += resultObj.actualCount;
        }
      }
      if (
        filePath.match(`/${config.componentsFolderName}/`) &&
        !isExcluded(filePath, config.excludedComponentPathsForStories)
      ) {
        componentsMap[filePath] = false;
      }
      if (!config.storiesFolderPath || config.storiesFolderPath === '')
        checkStorybookCoverage(filePath); // if story files are inside src folder
      results.push(filePath);
    });

    const coveragePercent = this.getCoveragePercentage(
      actualCount,
      expectedCount
    );
    const numOfComponents = Object.keys(componentsMap).length;
    this.walk(config.storiesFolderPath, (filePath) => {
      checkStorybookCoverage(filePath);
    });

    const numOfComponentsWithStories =
      numOfComponents - Object.keys(componentsMap).length;
    const storybookCoveragePercent =
      numOfComponents === 0
        ? 0
        : Math.floor((10000 * numOfComponentsWithStories) / numOfComponents) /
          100;

    console.log('numOfComponents: ', numOfComponents);
    console.log('numOfComponentsWithStories: ', numOfComponentsWithStories);
    console.log('storybook coverage: ', storybookCoveragePercent);

    this.generateJsonSummary(
      astHash,
      expectedCount,
      actualCount,
      coveragePercent
    );

    const consoleResponse = this.generateConsoleTable(
      expectedCount,
      actualCount,
      coveragePercent
    );

    console.log(
      '###########################################################\n'
    );
    console.table(consoleResponse);
    console.log('Note: A detailed json is generated in doc-coverage directory');
    console.log(
      '\n###########################################################'
    );
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
      process.exit(1);
    }
  }
}
DocumentationCoverage.exec();
