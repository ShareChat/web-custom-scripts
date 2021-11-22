const fs = require('fs-extra');
const acornLoose = require('acorn-loose');
const escodegen = require('escodegen');
const getCoveragePercentage = require('./getCoveragePercentage');

const createHash = (ast, filePath) => {
  const functionTypes = ['FunctionExpression', 'ArrowFunctionExpression'];
  const hash = {};
  const fileSplit = filePath.split('/');
  const fileName = `${fileSplit[fileSplit.length - 2]}#${
    fileSplit[fileSplit.length - 1].split('.')[0]
  }`;
  let expectedCount = 0;
  let actualCount = 0;

  const filterDeclarationTypes = (e) => {
    switch (e.type) {
      case 'FunctionDeclaration':
        return {
          functionName: e.id.name,
          functionType: e.type,
          hasLeadingComments:
            e.leadingComments?.filter((i) => i.value.startsWith('*\n')).length >
            0,
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
          if (
            filePath === '/Users/shivanisehgal/Desktop/pwa-moj/src/api/index.js'
          ) {
            console.log('hash');
            console.log(subobj);
          }
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
      fileCoverage: `${getCoveragePercentage(actualCount, expectedCount)}%`,
      filePath,
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
  if (filePath === '/Users/shivanisehgal/Desktop/pwa-moj/src/api/index.js') {
    // console.log(ast);
  }
  return createHash(ast, filePath);
};

module.exports = generateAstWithComments;
