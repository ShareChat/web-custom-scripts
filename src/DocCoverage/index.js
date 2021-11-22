#! /usr/bin/env node

const fs = require('fs-extra');
const acornLoose = require('acorn-loose');
const escodegen = require('escodegen');
const walk = require('../Utils/walk');
const storybookCoverage = require('./DocCoverageUtils/storybookCoverage');
const printOutputSummary = require('./DocCoverageUtils/printOutputSummary');

class DocumentationCoverage {
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

  static generateJsonSummary(astHash, data) {
    const output = {
      ...data,
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
  static generateAstDoc(filePath, config) {
    const file = fs.readFileSync(filePath, 'utf8');
    const comments = [];
    const tokens = [];

    const ast = acornLoose.parse(file, {
      ecmaVersion: config.ecmaVersion ?? 2020,
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

    let componentsMap = {};
    let totalComponents = 0;
    walk(config.source, (filePath) => {
      // Find total scopes(expectCount) and documented scopes(actualCount)
      if (!isExcluded(filePath, config.excludedPaths)) {
        // generates ast doc
        const response = this.generateAstDoc(filePath, config);
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

      // Populate components Map with all component file paths
      if (
        filePath.match(`/${config.componentsFolderName}/`) &&
        !isExcluded(filePath, config.excludedComponentPaths)
      ) {
        componentsMap[filePath] = false;
      }
      totalComponents = Object.keys(componentsMap).length;

      // if story files are inside src folder
      if (!config.storiesFolderPath || config.storiesFolderPath === '')
        componentsMap = storybookCoverage.removeFilesWithStories(
          filePath,
          componentsMap
        );
      results.push(filePath);
    });
    walk(config.storiesFolderPath, (filePath) => {
      componentsMap = storybookCoverage.removeFilesWithStories(
        filePath,
        componentsMap
      );
    });

    const componentsWithStories =
      totalComponents - Object.keys(componentsMap).length;
    const storybookCoveragePercent =
      totalComponents === 0
        ? 0
        : Math.floor((10000 * componentsWithStories) / totalComponents) / 100;

    const coveragePercent = this.getCoveragePercentage(
      actualCount,
      expectedCount
    );

    const summary = {
      jsdocCoverage: {
        expectedCount,
        actualCount,
        coveragePercent,
      },
      storyBookCoverage: {
        totalComponents,
        componentsWithStories,
        storybookCoveragePercent,
      },
      totalCoverage: {
        totalExpectedCount: totalComponents + expectedCount,
        totalActualCount: componentsWithStories + actualCount,
        totalCoveragePercent: this.getCoveragePercentage(
          componentsWithStories + actualCount,
          totalComponents + expectedCount
        ),
      },
    };

    this.generateJsonSummary(astHash, summary);
    printOutputSummary(summary);
  }
}
module.exports = DocumentationCoverage;
