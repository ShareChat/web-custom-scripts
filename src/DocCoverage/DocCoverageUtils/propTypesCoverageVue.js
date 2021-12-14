const getAncestors = require('./getAncestors');
const { expressionTypes, astConstants } = require('../Constants/constants');

class PropTypesCoverageVue {
  /**
   * finds missing prop types.
   * @param {object} ast
   * @returns {boolean} hasPropTypes
   */
  static getMissingPropTypes(ast) {
    let hasPropTypes = false;

    /**
     * callback function to be passed in getAncestors
     * checks if props are in object notation
     * @param {Array} ancestors
     */
    const checkIfPropsInObjectNotation = ([, parentObject]) => {
      const parentValue = Object.values(parentObject)[0];
      if (parentValue.value?.type === expressionTypes.OBJECT_EXPRESSION) {
        hasPropTypes = true;
      }
    };

    getAncestors([], ast, astConstants.PROPS, checkIfPropsInObjectNotation);

    return hasPropTypes;
  }
}

module.exports = PropTypesCoverageVue;
