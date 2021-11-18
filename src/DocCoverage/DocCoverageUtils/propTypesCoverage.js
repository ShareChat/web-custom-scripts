// const fs = require('fs-extra');

const getParentAndGrandParent = (path, json, value, cb) => {
  Object.entries(json).forEach(([key, val]) => {
    if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
      path.push({ [key]: val });
      getParentAndGrandParent(path, val, value, cb);
      path.pop();
    } else if (Array.isArray(val) && key !== 'params' && key !== 'arguments') {
      val.forEach((v, i) => {
        if (typeof v === 'object') {
          path.push({ [`${key}[${i}]`]: v });
          getParentAndGrandParent(path, v, value, cb);
          path.pop();
        }
      });
    } else if (val === value) {
      const final = path.slice(-3);
      cb(final);
    }
  });
};

class PropTypesCoverage {
  /**
   * if a component is imported in stories, remove it from componentsMap.
   * @returns {object} new components map
   */

  static PropTypesCoverageClassComponents(ast) {
    // console.log(JSON.parse(JSON.stringify(ast)));
    const propsArr = [];
    const propTypesArr = [];
    const populatePropsArray = ([grandParentObject, parentObject]) => {
      const grandParentValue = Object.values(grandParentObject)[0];

      const parentKey = Object.keys(parentObject)[0];
      if (parentKey === 'init') {
        if (
          grandParentValue.id.name &&
          !propsArr.includes(grandParentValue.id.name)
        ) {
          propsArr.push(grandParentValue.id.name);
        } else {
          grandParentValue.id.properties.forEach((p) => {
            if (
              (p.value || p.key) &&
              !propsArr.includes(p.value.name || p.key.name)
            ) {
              propsArr.push(p.value.name || p.key.name);
            }
          });
        }
      } else if (
        (grandParentValue.type === 'BinaryExpression' ||
          grandParentValue.type === 'IfStatement') &&
        !propsArr.includes(grandParentValue[parentKey].property.name)
      ) {
        propsArr.push(grandParentValue[parentKey].property.name);
      } else if (
        grandParentValue.property &&
        !propsArr.includes(grandParentValue.property.name)
      ) {
        propsArr.push(grandParentValue.property.name);
      } else if (grandParentValue.properties) {
        grandParentValue.properties.forEach((p) => {
          if (p.key && !propsArr.includes(p.key.name)) {
            propsArr.push(p.key.name);
          }
        });
      }
    };

    const populatePropTypesArray = ([grandParentObject, parentObject]) => {
      const parentValue = Object.values(parentObject)[0];

      if (
        parentValue.type === 'PropertyDefinition' &&
        parentValue.key.name === 'propTypes'
      ) {
        parentValue.value.properties.forEach((property) => {
          if (!propTypesArr.includes(property.key.name))
            propTypesArr.push(property.key.name);
        });
      }
    };
    getParentAndGrandParent([], ast, 'ClassDeclaration', (arr) => {
      if (arr.length > 0) {
        getParentAndGrandParent([], ast, 'props', populatePropsArray);
        getParentAndGrandParent([], ast, 'propTypes', populatePropTypesArray);
      }
    });

    const missingPropsArr = propsArr.filter(
      (prop) => !propTypesArr.includes(prop)
    );

    return missingPropsArr;
  }
}

module.exports = PropTypesCoverage;
