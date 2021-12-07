const getAncestors = require('./getAncestors');

class PropTypesCoverageReact {
  /**
   * finds missing prop types.
   * @param {object} ast
   * @returns {Array} missingPropTypes
   */
  static getMissingPropTypes(ast) {
    let hasPropTypes = false;
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
     * finds all props used in a component and populates them in the propsArr
     * @param {Array} ancestors
     */
    const populatePropsArray = ([
      greatGrandParentObject,
      grandParentObject,
    ]) => {
      // for simplicity calling them grandParent and parent
      const grandParentValue = Object.values(greatGrandParentObject)[0];
      const parentKey = Object.keys(grandParentObject)[0];

      if (parentKey === 'init') {
        if (grandParentValue.id.name) {
          uniquePush(propsArr, grandParentValue.id.name);
        } else {
          grandParentValue.id.properties.forEach((p) =>
            uniquePush(propsArr, p.key?.name || p.value?.name)
          );
        }
      } else if (
        grandParentValue.type === 'BinaryExpression' ||
        grandParentValue.type === 'IfStatement' ||
        grandParentValue.type === 'AssignmentExpression' ||
        grandParentValue.type === 'MemberExpression' ||
        grandParentValue.type === 'LogicalExpression' ||
        grandParentValue.type === 'CallExpression'
      ) {
        if (grandParentValue[parentKey].property.name !== 'props') {
          uniquePush(propsArr, grandParentValue[parentKey].property.name);
        } else {
          uniquePush(propsArr, grandParentValue.property.name);
        }
      } else if (grandParentValue.property) {
        uniquePush(propsArr, grandParentValue.property.name);
      } else {
        grandParentValue.properties?.forEach((p) => {
          if (p.key?.name !== 'props') uniquePush(propsArr, p.key?.name);
        });
      }
    };

    /**
     * callback function to be passed in getAncestors
     * finds all propTypes defined in a Class based component and populates them in the propTypesArr
     * @param {Array} ancestors
     */
    const populatePropTypesArray = ([, parentObject]) => {
      hasPropTypes = true;
      const parentValue = Object.values(parentObject)[0];
      if (
        parentValue.type === 'PropertyDefinition' &&
        parentValue.key.name === 'propTypes'
      ) {
        parentValue.value.properties.forEach((property) =>
          uniquePush(propTypesArr, property.key.name)
        );
      }
    };

    getAncestors([], ast, 'ClassDeclaration', () => {
      isClassComponent = true;
      getAncestors([], ast, 'props', populatePropsArray);
      getAncestors([], ast, 'propTypes', populatePropTypesArray);
    });
    if (!isClassComponent) {
      let compName;
      ast.body.forEach((scope) => {
        if (
          scope.type === 'ExpressionStatement' &&
          scope.expression.left?.property?.name === 'propTypes'
        ) {
          hasPropTypes = true;
          compName = scope.expression.left.object.name;
          scope.expression.right.properties.forEach((p) =>
            uniquePush(propTypesArr, p.key?.name)
          );
        }
      });
      if (hasPropTypes) {
        ast.body.forEach((scope) => {
          if (
            scope.type === 'VariableDeclaration' &&
            scope.declarations[0].id.name === compName
          ) {
            if (scope.declarations[0].init.params?.[0]?.name === 'props') {
              // not destructured
              scope.declarations[0].init.body.body.forEach((s) => {
                if (
                  s.type === 'VariableDeclaration' &&
                  s.declarations[0].init.name === 'props'
                ) {
                  s.declarations[0].id.properties.forEach((p) =>
                    uniquePush(propsArr, p.key?.name)
                  );
                }
              });
            } else {
              // destructured
              scope.declarations[0].init.params?.[0].properties.forEach((p) =>
                uniquePush(propsArr, p.key?.name)
              );
            }
            getAncestors([], scope, 'props', populatePropsArray);
          } else if (
            scope.type === 'FunctionDeclaration' &&
            scope.id.name === compName
          ) {
            scope.params[0].properties?.forEach((p) =>
              uniquePush(propsArr, p.key?.name)
            );
            getAncestors([], scope, 'props', populatePropsArray);
          }
        });
      }
    }

    const missingPropsArr = propsArr.filter(
      (prop) => !propTypesArr.includes(prop)
    );

    return [
      isClassComponent,
      propsArr,
      !isClassComponent && !hasPropTypes ? null : missingPropsArr,
    ];
  }
}

module.exports = PropTypesCoverageReact;
