const fs = require('fs-extra');
const acornLoose = require('acorn-loose');
const isIgnored = require('./checkIfIgnored');

// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = () => this.toString();

/**
 * parses JS and generates Abstract Syntax Tree object
 * @returns {Object}
 * @private
 */
const generateAst = (filePath, config) => {
  const file = fs.readFileSync(filePath, 'utf8');
  if (!isIgnored(file, config.framework)) {
    const comments = [];
    const tokens = [];
    const ast = acornLoose.parse(file, {
      ecmaVersion: config.ecmaVersion ?? 'latest',
      // collect ranges for each node
      ranges: true,
      // collect comments in Esprima's format !imp
      onComment: comments,
      // collect token ranges
      onToken: tokens,
    });
    return JSON.parse(JSON.stringify(ast));
  }
  return null;
};

module.exports = generateAst;
