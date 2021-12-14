const fs = require('fs-extra');
const acornLoose = require('acorn-loose');
const escodegen = require('escodegen');
const getCoveragePercentage = require('./getCoveragePercentage');
const { declarationTypes, expressionTypes } = require('../Constants/constants');

const createHash = (ast, filePath) => {
  const functionTypes = [
    expressionTypes.FUNCTION_EXPRESSION,
    expressionTypes.ARROW_FUNCTION_EXPRESSION,
  ];
  const hash = {};
  let expectedCount = 0;
  let actualCount = 0;

  const filterDeclarationTypes = (e) => {
    switch (e.type) {
      case declarationTypes.FUNCTION_DECLARATION:
        return {
          functionName: e.id.name,
          functionType: e.type,
          hasLeadingComments:
            e.leadingComments?.filter((i) => i.value.startsWith('*\n')).length >
            0,
        };
      case declarationTypes.VARIABLE_DECLARATION:
      case declarationTypes.EXPORT_NAMED_DECLARATION:
      case declarationTypes.EXPORT_DEFAULT_DECLARATION: {
        let subobj = {};

        if (e.type === declarationTypes.VARIABLE_DECLARATION) {
          subobj = e.declarations?.[0];
        }

        if (e.type === declarationTypes.EXPORT_NAMED_DECLARATION) {
          if (e.declaration?.declarations) {
            subobj = e.declaration?.declarations?.[0];
          } else if (e.declaration) {
            subobj = e.declaration;
          }
        }

        if (e.type === declarationTypes.EXPORT_DEFAULT_DECLARATION && e.id) {
          subobj = e.declaration;
        }

        if (
          (subobj?.init?.type && functionTypes.includes(subobj.init.type)) ||
          subobj.type === declarationTypes.FUNCTION_DECLARATION
        ) {
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

  for (let i = 0; i < ast.body.length; i += 1) {
    const e = ast.body[i];
    const res = filterDeclarationTypes(e);

    if (res) {
      if (!hash[filePath]?.funcCoverage) {
        hash[filePath] = { funcCoverage: {} };
      }

      hash[filePath] = {
        funcCoverage: {
          ...hash[filePath].funcCoverage,
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
    hash[filePath] = {
      ...hash[filePath],
      fileCoverage: `${getCoveragePercentage(actualCount, expectedCount)}%`,
    };
    return hash;
  }
  return null;
};

const generateAstWithComments = (filePath, config) => {
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

  return createHash(ast, filePath);
};

module.exports = generateAstWithComments;
