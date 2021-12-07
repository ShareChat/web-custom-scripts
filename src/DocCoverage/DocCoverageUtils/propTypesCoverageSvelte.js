const getAncestors = require('./getAncestors');

class PropTypesCoverageSvelte {
  /**
   * finds missing prop types.
   * @param {object} ast
   * @returns {Array} missingPropTypes
   */
  static getMissingPropTypes(ast) {
    const propsArr = [];
    const propTypesArr = [];
    const uniquePush = (arr, item) => {
      if (item && !arr.includes(item)) {
        arr.push(item);
      }
    };

    /**
     * finds all props defined in a component and populates them in the propsArr
     * @param {Object} astObject
     */
    const populatePropsArray = (astObject) => {
      astObject.body.forEach((node) => {
        if (node.type === 'ExportNamedDeclaration') {
          node.declaration?.declarations?.map((declaration) =>
            uniquePush(propsArr, declaration.id.name)
          );
        }
      });
    };

    /**
     * callback function to be passed in getAncestors
     * finds all propTypes defined in a component and populates them in the propTypesArr
     * @param {Array} ancestors
     */
    const populatePropTypesArray = ([, parentObject]) => {
      const parentValue = Object.values(parentObject)[0];
      if (
        parentValue.type === 'VariableDeclarator' &&
        parentValue.id.name === 'propTypes'
      ) {
        parentValue.init.properties.forEach((property) =>
          uniquePush(propTypesArr, property.key.name)
        );
      }
    };

    populatePropsArray(ast);
    getAncestors([], ast, 'propTypes', populatePropTypesArray);

    const missingPropsArr = propsArr.filter(
      (prop) => !propTypesArr.includes(prop)
    );

    return [propsArr, missingPropsArr];
  }
}

module.exports = PropTypesCoverageSvelte;
