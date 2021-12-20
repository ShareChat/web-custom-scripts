const getAncestors = require('./getAncestors');
const {
  declarationTypes,
  expressionTypes,
  astConstants,
} = require('../Constants/constants');

class PropTypesCoverageReact {
  /**
   * finds missing prop types.
   * @param {object} ast
   * @returns {Array} missingPropTypes
   */
  static getMissingPropTypes(ast) {
    let hasPropTypes = false;
    let compName;
    const propsArr = [];
    const propTypesArr = [];
    let isClassComponent = false;
    const uniquePush = (arr, item) => {
      if (item && !arr.includes(item)) {
        arr.push(item);
      }
    };

    /**
     * callback function to be passed in getAncestors
     * finds props used in a component and populates them in the propsArr
     * @param {Array} ancestors
     */
    const populatePropsArray = ([
      greatGrandParentObject,
      grandParentObject,
    ]) => {
      // for simplicity calling them grandParent and parent
      const grandParentValue = Object.values(greatGrandParentObject)[0];
      const parentKey = Object.keys(grandParentObject)[0];
      const parentValue = Object.values(grandParentObject)[0];

      const expressionTypesArr = [
        expressionTypes.BINARY_EXPRESSION,
        expressionTypes.IF_STATEMENT,
        expressionTypes.ASSIGNMENT_EXPRESSION,
        expressionTypes.MEMBER_EXPRESSION,
        expressionTypes.LOGICAL_EXPRESSION,
        expressionTypes.CALL_EXPRESSION,
      ];
      if (parentKey === astConstants.INIT) {
        if (grandParentValue.id.name) {
          uniquePush(propsArr, grandParentValue.id.name);
        } else {
          grandParentValue.id.properties.forEach((p) =>
            uniquePush(propsArr, p.key?.name || p.value?.name)
          );
        }
      } else if (expressionTypesArr.includes(grandParentValue.type)) {
        if (parentValue.property?.name !== astConstants.PROPS) {
          uniquePush(propsArr, parentValue.property?.name);
        } else {
          uniquePush(propsArr, grandParentValue.property?.name);
        }
      } else if (grandParentValue.property) {
        uniquePush(propsArr, grandParentValue.property.name);
      } else if (grandParentValue.properties) {
        grandParentValue.properties.forEach((p) => {
          if (p.key?.name !== astConstants.PROPS)
            uniquePush(propsArr, p.key?.name);
        });
      } else {
        parentValue.id?.properties?.forEach((p) => {
          if (p.key?.name !== astConstants.PROPS)
            uniquePush(propsArr, p.key?.name);
        });
      }
    };

    /**
     * finds all props used in a functional component and populates them in the propsArr
     * @param {Object} scope
     */
    const populatePropsArrayFunctionalComp = (scope) => {
      if (
        scope.type === declarationTypes.VARIABLE_DECLARATION &&
        scope.declarations[0].id.name === compName
      ) {
        if (
          scope.declarations[0].init?.left?.type ===
          expressionTypes.ARROW_FUNCTION_EXPRESSION
        ) {
          scope.declarations[0].init?.left?.params[0].properties.forEach(
            (p) => {
              uniquePush(propsArr, p.key?.name);
            }
          );
        } else if (
          scope.declarations[0].init.params?.[0]?.name === astConstants.PROPS
        ) {
          // not destructured
          scope.declarations[0].init.body.body.forEach((s) => {
            if (
              s.type === declarationTypes.VARIABLE_DECLARATION &&
              s.declarations[0].init.name === astConstants.PROPS
            ) {
              s.declarations[0].id.properties.forEach((p) =>
                uniquePush(propsArr, p.key?.name)
              );
            }
          });
        } else if (scope.declarations[0].init.params) {
          // destructured
          scope.declarations[0].init.params[0].properties.forEach((p) =>
            uniquePush(propsArr, p.key?.name)
          );
        } else if (scope.declarations[0].init.left) {
          scope.declarations[0].init.left.left?.params?.[0].properties.forEach(
            (p) => uniquePush(propsArr, p.key?.name)
          );
        }
        getAncestors([], scope, astConstants.PROPS, populatePropsArray);
      } else if (
        scope.type === declarationTypes.FUNCTION_DECLARATION &&
        scope.id.name === compName
      ) {
        scope.params[0].properties?.forEach((p) =>
          uniquePush(propsArr, p.key?.name)
        );
      }
      getAncestors([], scope, astConstants.PROPS, populatePropsArray);
    };

    /**
     * callback function to be passed in getAncestors
     * finds all propTypes defined inside a Class based component (using static syntax) and populates them in the propTypesArr
     * @param {Array} ancestors
     */
    const populatePropTypesArrayStatic = ([, parentObject]) => {
      hasPropTypes = true;
      const parentValue = Object.values(parentObject)[0];
      if (
        parentValue.type === astConstants.PROPERTY_DEFINITION &&
        parentValue.key.name === astConstants.PROP_TYPES
      ) {
        parentValue.value.properties.forEach((property) =>
          uniquePush(propTypesArr, property.key.name)
        );
      }
    };

    /**
     * callback function to be passed in getAncestors
     * finds all propTypes defined outside a Class based component and populates them in the propTypesArr
     * @param {Array} ancestors
     */
    const populatePropTypesArray = (astObj) => {
      astObj.body.forEach((scope) => {
        if (
          scope.type === expressionTypes.EXPRESSION_STATEMENT &&
          scope.expression.left?.property?.name === astConstants.PROP_TYPES
        ) {
          hasPropTypes = true;
          compName = scope.expression.left.object.name;
          scope.expression.right.properties.forEach((p) =>
            uniquePush(propTypesArr, p.key?.name)
          );
        }
      });
    };

    getAncestors([], ast, declarationTypes.CLASS_DECLARATION, () => {
      isClassComponent = true;
      getAncestors([], ast, astConstants.PROPS, populatePropsArray);
      getAncestors(
        [],
        ast,
        astConstants.PROP_TYPES,
        populatePropTypesArrayStatic
      );
      populatePropTypesArray(ast);
    });

    if (!isClassComponent) {
      populatePropTypesArray(ast);
      if (hasPropTypes) {
        ast.body.forEach((scope) => {
          if (
            scope.type === declarationTypes.EXPORT_DEFAULT_DECLARATION &&
            scope.declaration.id?.name === compName
          ) {
            populatePropsArrayFunctionalComp(scope.declaration);
          } else if (
            scope.type === declarationTypes.EXPORT_NAMED_DECLARATION &&
            scope.declaration?.declarations?.[0].id?.name === compName
          ) {
            populatePropsArrayFunctionalComp(scope.declaration);
          } else {
            populatePropsArrayFunctionalComp(scope);
          }
        });
      }
    }

    const missingPropsArr = propsArr.filter(
      (prop) => !propTypesArr.includes(prop)
    );

    return [isClassComponent, propsArr, missingPropsArr];
  }
}

module.exports = PropTypesCoverageReact;
