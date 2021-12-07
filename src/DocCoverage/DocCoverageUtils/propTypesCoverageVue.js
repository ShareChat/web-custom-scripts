const getAncestors = require('./getAncestors');

class PropTypesCoverageVue {
  /**
   * finds missing prop types.
   * @param {object} ast
   * @returns {Array} missingPropTypes
   */
  static getMissingPropTypes(ast) {
    let hasPropTypes = false;

    /**
     * callback function to be passed in getAncestors
     * finds all propTypes defined in a component and populates them in the propTypesArr
     * @param {Array} ancestors
     */
    const checkIfPropsInObjectNotation = ([, parentObject]) => {
      const parentValue = Object.values(parentObject)[0];
      if (parentValue.value?.type === 'ObjectExpression') {
        hasPropTypes = true;
      }
    };

    getAncestors([], ast, 'props', checkIfPropsInObjectNotation);

    return hasPropTypes;
  }
}

module.exports = PropTypesCoverageVue;
