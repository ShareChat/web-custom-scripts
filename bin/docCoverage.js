#! /usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const DocumentationCoverage = require('../src/DocCoverage/index');
// const getParentAndGrandParent = require('../src/DocCoverage/DocCoverageUtils/propTypesCoverage');

class DocumentationCoverageCli {
  /**
   * find config file.
   * @returns {string|null} config file path.
   */
  static findConfigFilePath() {
    try {
      const filePath = path.resolve('./.doccoverage.json');
      fs.readFileSync(filePath);
      return filePath;
    } catch (e) {
      // ignore
    }

    try {
      const filePath = path.resolve('./.doccoverage.js');
      fs.readFileSync(filePath);
      return filePath;
    } catch (e) {
      // ignore
    }
    return null;
  }

  /**
   * create config object from config file.
   * @param {string} configFilePath - config file path.
   * @return {DocCoverageConfig} config object.
   * @private
   */
  static createConfigFromJSONFile(configFile) {
    const configFilePath = path.resolve(configFile);
    const ext = path.extname(configFilePath);
    if (ext === '.js') {
      /* eslint-disable global-require */
      // eslint-disable-next-line import/no-dynamic-require
      return require(configFilePath);
    }
    const configJSON = fs.readFileSync(configFilePath, { encode: 'utf8' });
    const config = JSON.parse(configJSON);
    return config;
  }

  static exec() {
    let config;
    const configPath = this.findConfigFilePath();
    if (configPath) {
      config = this.createConfigFromJSONFile(configPath);
    }
    if (config) {
      DocumentationCoverage.generateReport(config);
    } else {
      process.exit(1);
    }
  }
}
DocumentationCoverageCli.exec();
// const obj1 = {
//   type: 'Program',
//   start: 0,
//   end: 2842,
//   body: [
//     {
//       type: 'ImportDeclaration',
//       start: 0,
//       end: 26,
//       specifiers: [
//         {
//           type: 'ImportDefaultSpecifier',
//           start: 7,
//           end: 12,
//           local: {
//             type: 'Identifier',
//             start: 7,
//             end: 12,
//             name: 'React',
//           },
//         },
//       ],
//       source: {
//         type: 'Literal',
//         start: 18,
//         end: 25,
//         value: 'react',
//         raw: '"react"',
//       },
//     },
//     {
//       type: 'ImportDeclaration',
//       start: 27,
//       end: 62,
//       specifiers: [
//         {
//           type: 'ImportDefaultSpecifier',
//           start: 34,
//           end: 43,
//           local: {
//             type: 'Identifier',
//             start: 34,
//             end: 43,
//             name: 'PropTypes',
//           },
//         },
//       ],
//       source: {
//         type: 'Literal',
//         start: 49,
//         end: 61,
//         value: 'prop-types',
//         raw: '"prop-types"',
//       },
//     },
//     {
//       type: 'ImportDeclaration',
//       start: 63,
//       end: 103,
//       specifiers: [
//         {
//           type: 'ImportDefaultSpecifier',
//           start: 70,
//           end: 79,
//           local: {
//             type: 'Identifier',
//             start: 70,
//             end: 79,
//             name: '_throttle',
//           },
//         },
//       ],
//       source: {
//         type: 'Literal',
//         start: 85,
//         end: 102,
//         value: 'lodash/throttle',
//         raw: '"lodash/throttle"',
//       },
//     },
//     {
//       type: 'ImportDeclaration',
//       start: 105,
//       end: 182,
//       specifiers: [
//         {
//           type: 'ImportSpecifier',
//           start: 114,
//           end: 129,
//           imported: {
//             type: 'Identifier',
//             start: 114,
//             end: 129,
//             name: 'supportsPassive',
//           },
//           local: {
//             type: 'Identifier',
//             start: 114,
//             end: 129,
//             name: 'supportsPassive',
//           },
//         },
//         {
//           type: 'ImportSpecifier',
//           start: 131,
//           end: 163,
//           imported: {
//             type: 'Identifier',
//             start: 131,
//             end: 163,
//             name: 'SCROLL_ACCURATE_THROTTLE_TIMEOUT',
//           },
//           local: {
//             type: 'Identifier',
//             start: 131,
//             end: 163,
//             name: 'SCROLL_ACCURATE_THROTTLE_TIMEOUT',
//           },
//         },
//       ],
//       source: {
//         type: 'Literal',
//         start: 171,
//         end: 181,
//         value: '@/config',
//         raw: '"@/config"',
//       },
//     },
//     {
//       type: 'ClassDeclaration',
//       start: 184,
//       end: 2817,
//       id: {
//         type: 'Identifier',
//         start: 190,
//         end: 196,
//         name: 'Header',
//       },
//       superClass: {
//         type: 'MemberExpression',
//         start: 205,
//         end: 224,
//         object: {
//           type: 'Identifier',
//           start: 205,
//           end: 210,
//           name: 'React',
//         },
//         property: {
//           type: 'Identifier',
//           start: 211,
//           end: 224,
//           name: 'PureComponent',
//         },
//         computed: false,
//         optional: false,
//       },
//       body: {
//         type: 'ClassBody',
//         start: 225,
//         end: 2817,
//         body: [
//           {
//             type: 'PropertyDefinition',
//             start: 228,
//             end: 547,
//             static: true,
//             computed: false,
//             key: {
//               type: 'Identifier',
//               start: 235,
//               end: 244,
//               name: 'propTypes',
//             },
//             value: {
//               type: 'ObjectExpression',
//               start: 247,
//               end: 546,
//               properties: [
//                 {
//                   type: 'Property',
//                   start: 251,
//                   end: 278,
//                   method: false,
//                   shorthand: false,
//                   computed: false,
//                   key: {
//                     type: 'Identifier',
//                     start: 251,
//                     end: 260,
//                     name: 'behaviour',
//                   },
//                   value: {
//                     type: 'MemberExpression',
//                     start: 262,
//                     end: 278,
//                     object: {
//                       type: 'Identifier',
//                       start: 262,
//                       end: 271,
//                       name: 'PropTypes',
//                     },
//                     property: {
//                       type: 'Identifier',
//                       start: 272,
//                       end: 278,
//                       name: 'string',
//                     },
//                     computed: false,
//                     optional: false,
//                   },
//                   kind: 'init',
//                 },
//                 {
//                   type: 'Property',
//                   start: 282,
//                   end: 306,
//                   method: false,
//                   shorthand: false,
//                   computed: false,
//                   key: {
//                     type: 'Identifier',
//                     start: 282,
//                     end: 288,
//                     name: 'offset',
//                   },
//                   value: {
//                     type: 'MemberExpression',
//                     start: 290,
//                     end: 306,
//                     object: {
//                       type: 'Identifier',
//                       start: 290,
//                       end: 299,
//                       name: 'PropTypes',
//                     },
//                     property: {
//                       type: 'Identifier',
//                       start: 300,
//                       end: 306,
//                       name: 'number',
//                     },
//                     computed: false,
//                     optional: false,
//                   },
//                   kind: 'init',
//                 },
//                 {
//                   type: 'Property',
//                   start: 310,
//                   end: 338,
//                   method: false,
//                   shorthand: false,
//                   computed: false,
//                   key: {
//                     type: 'Identifier',
//                     start: 310,
//                     end: 320,
//                     name: 'classNames',
//                   },
//                   value: {
//                     type: 'MemberExpression',
//                     start: 322,
//                     end: 338,
//                     object: {
//                       type: 'Identifier',
//                       start: 322,
//                       end: 331,
//                       name: 'PropTypes',
//                     },
//                     property: {
//                       type: 'Identifier',
//                       start: 332,
//                       end: 338,
//                       name: 'string',
//                     },
//                     computed: false,
//                     optional: false,
//                   },
//                   kind: 'init',
//                 },
//                 {
//                   type: 'Property',
//                   start: 342,
//                   end: 366,
//                   method: false,
//                   shorthand: false,
//                   computed: false,
//                   key: {
//                     type: 'Identifier',
//                     start: 342,
//                     end: 348,
//                     name: 'height',
//                   },
//                   value: {
//                     type: 'MemberExpression',
//                     start: 350,
//                     end: 366,
//                     object: {
//                       type: 'Identifier',
//                       start: 350,
//                       end: 359,
//                       name: 'PropTypes',
//                     },
//                     property: {
//                       type: 'Identifier',
//                       start: 360,
//                       end: 366,
//                       name: 'string',
//                     },
//                     computed: false,
//                     optional: false,
//                   },
//                   kind: 'init',
//                 },
//                 {
//                   type: 'Property',
//                   start: 370,
//                   end: 391,
//                   method: false,
//                   shorthand: false,
//                   computed: false,
//                   key: {
//                     type: 'Identifier',
//                     start: 370,
//                     end: 373,
//                     name: 'top',
//                   },
//                   value: {
//                     type: 'MemberExpression',
//                     start: 375,
//                     end: 391,
//                     object: {
//                       type: 'Identifier',
//                       start: 375,
//                       end: 384,
//                       name: 'PropTypes',
//                     },
//                     property: {
//                       type: 'Identifier',
//                       start: 385,
//                       end: 391,
//                       name: 'string',
//                     },
//                     computed: false,
//                     optional: false,
//                   },
//                   kind: 'init',
//                 },
//                 {
//                   type: 'Property',
//                   start: 395,
//                   end: 419,
//                   method: false,
//                   shorthand: false,
//                   computed: false,
//                   key: {
//                     type: 'Identifier',
//                     start: 395,
//                     end: 401,
//                     name: 'ZIndex',
//                   },
//                   value: {
//                     type: 'MemberExpression',
//                     start: 403,
//                     end: 419,
//                     object: {
//                       type: 'Identifier',
//                       start: 403,
//                       end: 412,
//                       name: 'PropTypes',
//                     },
//                     property: {
//                       type: 'Identifier',
//                       start: 413,
//                       end: 419,
//                       name: 'string',
//                     },
//                     computed: false,
//                     optional: false,
//                   },
//                   kind: 'init',
//                 },
//                 {
//                   type: 'Property',
//                   start: 423,
//                   end: 450,
//                   method: false,
//                   shorthand: false,
//                   computed: false,
//                   key: {
//                     type: 'Identifier',
//                     start: 423,
//                     end: 434,
//                     name: 'transparent',
//                   },
//                   value: {
//                     type: 'MemberExpression',
//                     start: 436,
//                     end: 450,
//                     object: {
//                       type: 'Identifier',
//                       start: 436,
//                       end: 445,
//                       name: 'PropTypes',
//                     },
//                     property: {
//                       type: 'Identifier',
//                       start: 446,
//                       end: 450,
//                       name: 'bool',
//                     },
//                     computed: false,
//                     optional: false,
//                   },
//                   kind: 'init',
//                 },
//                 {
//                   type: 'Property',
//                   start: 454,
//                   end: 477,
//                   method: false,
//                   shorthand: false,
//                   computed: false,
//                   key: {
//                     type: 'Identifier',
//                     start: 454,
//                     end: 461,
//                     name: 'noFixed',
//                   },
//                   value: {
//                     type: 'MemberExpression',
//                     start: 463,
//                     end: 477,
//                     object: {
//                       type: 'Identifier',
//                       start: 463,
//                       end: 472,
//                       name: 'PropTypes',
//                     },
//                     property: {
//                       type: 'Identifier',
//                       start: 473,
//                       end: 477,
//                       name: 'bool',
//                     },
//                     computed: false,
//                     optional: false,
//                   },
//                   kind: 'init',
//                 },
//                 {
//                   type: 'Property',
//                   start: 481,
//                   end: 512,
//                   method: false,
//                   shorthand: false,
//                   computed: false,
//                   key: {
//                     type: 'Identifier',
//                     start: 481,
//                     end: 496,
//                     name: 'scrollSensitive',
//                   },
//                   value: {
//                     type: 'MemberExpression',
//                     start: 498,
//                     end: 512,
//                     object: {
//                       type: 'Identifier',
//                       start: 498,
//                       end: 507,
//                       name: 'PropTypes',
//                     },
//                     property: {
//                       type: 'Identifier',
//                       start: 508,
//                       end: 512,
//                       name: 'bool',
//                     },
//                     computed: false,
//                     optional: false,
//                   },
//                   kind: 'init',
//                 },
//                 {
//                   type: 'Property',
//                   start: 516,
//                   end: 543,
//                   method: false,
//                   shorthand: false,
//                   computed: false,
//                   key: {
//                     type: 'Identifier',
//                     start: 516,
//                     end: 527,
//                     name: 'posRelative',
//                   },
//                   value: {
//                     type: 'MemberExpression',
//                     start: 529,
//                     end: 543,
//                     object: {
//                       type: 'Identifier',
//                       start: 529,
//                       end: 538,
//                       name: 'PropTypes',
//                     },
//                     property: {
//                       type: 'Identifier',
//                       start: 539,
//                       end: 543,
//                       name: 'bool',
//                     },
//                     computed: false,
//                     optional: false,
//                   },
//                   kind: 'init',
//                 },
//               ],
//             },
//           },
//           {
//             type: 'MethodDefinition',
//             start: 550,
//             end: 938,
//             static: false,
//             computed: false,
//             key: {
//               type: 'Identifier',
//               start: 550,
//               end: 561,
//               name: 'constructor',
//             },
//             kind: 'constructor',
//             value: {
//               type: 'FunctionExpression',
//               start: 561,
//               end: 938,
//               id: null,
//               expression: false,
//               generator: false,
//               async: false,
//               params: [
//                 {
//                   type: 'Identifier',
//                   start: 562,
//                   end: 567,
//                   name: 'props',
//                 },
//               ],
//               body: {
//                 type: 'BlockStatement',
//                 start: 569,
//                 end: 938,
//                 body: [
//                   {
//                     type: 'ExpressionStatement',
//                     start: 573,
//                     end: 586,
//                     expression: {
//                       type: 'CallExpression',
//                       start: 573,
//                       end: 585,
//                       callee: {
//                         type: 'Super',
//                         start: 573,
//                         end: 578,
//                       },
//                       arguments: [
//                         {
//                           type: 'Identifier',
//                           start: 579,
//                           end: 584,
//                           name: 'props',
//                         },
//                       ],
//                       optional: false,
//                     },
//                   },
//                   {
//                     type: 'ExpressionStatement',
//                     start: 590,
//                     end: 652,
//                     expression: {
//                       type: 'AssignmentExpression',
//                       start: 590,
//                       end: 651,
//                       operator: '=',
//                       left: {
//                         type: 'MemberExpression',
//                         start: 590,
//                         end: 614,
//                         object: {
//                           type: 'ThisExpression',
//                           start: 590,
//                           end: 594,
//                         },
//                         property: {
//                           type: 'Identifier',
//                           start: 595,
//                           end: 614,
//                           name: '_shouldHideOnScroll',
//                         },
//                         computed: false,
//                         optional: false,
//                       },
//                       right: {
//                         type: 'BinaryExpression',
//                         start: 617,
//                         end: 651,
//                         left: {
//                           type: 'MemberExpression',
//                           start: 617,
//                           end: 632,
//                           object: {
//                             type: 'Identifier',
//                             start: 617,
//                             end: 622,
//                             name: 'props',
//                           },
//                           property: {
//                             type: 'Identifier',
//                             start: 623,
//                             end: 632,
//                             name: 'behaviour',
//                           },
//                           computed: false,
//                           optional: false,
//                         },
//                         operator: '===',
//                         right: {
//                           type: 'Literal',
//                           start: 637,
//                           end: 651,
//                           value: 'showOnScroll',
//                           raw: '"showOnScroll"',
//                         },
//                       },
//                     },
//                   },
//                   {
//                     type: 'IfStatement',
//                     start: 656,
//                     end: 935,
//                     test: {
//                       type: 'MemberExpression',
//                       start: 660,
//                       end: 681,
//                       object: {
//                         type: 'Identifier',
//                         start: 660,
//                         end: 665,
//                         name: 'props',
//                       },
//                       property: {
//                         type: 'Identifier',
//                         start: 666,
//                         end: 681,
//                         name: 'scrollSensitive',
//                       },
//                       computed: false,
//                       optional: false,
//                     },
//                     consequent: {
//                       type: 'BlockStatement',
//                       start: 683,
//                       end: 935,
//                       body: [
//                         {
//                           type: 'ExpressionStatement',
//                           start: 688,
//                           end: 757,
//                           expression: {
//                             type: 'AssignmentExpression',
//                             start: 688,
//                             end: 756,
//                             operator: '=',
//                             left: {
//                               type: 'MemberExpression',
//                               start: 688,
//                               end: 698,
//                               object: {
//                                 type: 'ThisExpression',
//                                 start: 688,
//                                 end: 692,
//                               },
//                               property: {
//                                 type: 'Identifier',
//                                 start: 693,
//                                 end: 698,
//                                 name: 'state',
//                               },
//                               computed: false,
//                               optional: false,
//                             },
//                             right: {
//                               type: 'ObjectExpression',
//                               start: 701,
//                               end: 756,
//                               properties: [
//                                 {
//                                   type: 'Property',
//                                   start: 707,
//                                   end: 751,
//                                   method: false,
//                                   shorthand: false,
//                                   computed: false,
//                                   key: {
//                                     type: 'Identifier',
//                                     start: 707,
//                                     end: 725,
//                                     name: 'shouldHideOnScroll',
//                                   },
//                                   value: {
//                                     type: 'MemberExpression',
//                                     start: 727,
//                                     end: 751,
//                                     object: {
//                                       type: 'ThisExpression',
//                                       start: 727,
//                                       end: 731,
//                                     },
//                                     property: {
//                                       type: 'Identifier',
//                                       start: 732,
//                                       end: 751,
//                                       name: '_shouldHideOnScroll',
//                                     },
//                                     computed: false,
//                                     optional: false,
//                                   },
//                                   kind: 'init',
//                                 },
//                               ],
//                             },
//                           },
//                         },
//                         {
//                           type: 'ExpressionStatement',
//                           start: 762,
//                           end: 805,
//                           expression: {
//                             type: 'AssignmentExpression',
//                             start: 762,
//                             end: 804,
//                             operator: '=',
//                             left: {
//                               type: 'MemberExpression',
//                               start: 762,
//                               end: 776,
//                               object: {
//                                 type: 'ThisExpression',
//                                 start: 762,
//                                 end: 766,
//                               },
//                               property: {
//                                 type: 'Identifier',
//                                 start: 767,
//                                 end: 776,
//                                 name: '_onScroll',
//                               },
//                               computed: false,
//                               optional: false,
//                             },
//                             right: {
//                               type: 'CallExpression',
//                               start: 779,
//                               end: 804,
//                               callee: {
//                                 type: 'MemberExpression',
//                                 start: 779,
//                                 end: 798,
//                                 object: {
//                                   type: 'MemberExpression',
//                                   start: 779,
//                                   end: 793,
//                                   object: {
//                                     type: 'ThisExpression',
//                                     start: 779,
//                                     end: 783,
//                                   },
//                                   property: {
//                                     type: 'Identifier',
//                                     start: 784,
//                                     end: 793,
//                                     name: '_onScroll',
//                                   },
//                                   computed: false,
//                                   optional: false,
//                                 },
//                                 property: {
//                                   type: 'Identifier',
//                                   start: 794,
//                                   end: 798,
//                                   name: 'bind',
//                                 },
//                                 computed: false,
//                                 optional: false,
//                               },
//                               arguments: [
//                                 {
//                                   type: 'ThisExpression',
//                                   start: 799,
//                                   end: 803,
//                                 },
//                               ],
//                               optional: false,
//                             },
//                           },
//                         },
//                         {
//                           type: 'ExpressionStatement',
//                           start: 809,
//                           end: 903,
//                           expression: {
//                             type: 'AssignmentExpression',
//                             start: 809,
//                             end: 902,
//                             operator: '=',
//                             left: {
//                               type: 'MemberExpression',
//                               start: 809,
//                               end: 827,
//                               object: {
//                                 type: 'ThisExpression',
//                                 start: 809,
//                                 end: 813,
//                               },
//                               property: {
//                                 type: 'Identifier',
//                                 start: 814,
//                                 end: 827,
//                                 name: 'throttledFunc',
//                               },
//                               computed: false,
//                               optional: false,
//                             },
//                             right: {
//                               type: 'CallExpression',
//                               start: 830,
//                               end: 902,
//                               callee: {
//                                 type: 'Identifier',
//                                 start: 830,
//                                 end: 839,
//                                 name: '_throttle',
//                               },
//                               arguments: [
//                                 {
//                                   type: 'MemberExpression',
//                                   start: 845,
//                                   end: 859,
//                                   object: {
//                                     type: 'ThisExpression',
//                                     start: 845,
//                                     end: 849,
//                                   },
//                                   property: {
//                                     type: 'Identifier',
//                                     start: 850,
//                                     end: 859,
//                                     name: '_onScroll',
//                                   },
//                                   computed: false,
//                                   optional: false,
//                                 },
//                                 {
//                                   type: 'Identifier',
//                                   start: 865,
//                                   end: 897,
//                                   name: 'SCROLL_ACCURATE_THROTTLE_TIMEOUT',
//                                 },
//                               ],
//                               optional: false,
//                             },
//                           },
//                         },
//                         {
//                           type: 'ExpressionStatement',
//                           start: 908,
//                           end: 931,
//                           expression: {
//                             type: 'AssignmentExpression',
//                             start: 908,
//                             end: 930,
//                             operator: '=',
//                             left: {
//                               type: 'MemberExpression',
//                               start: 908,
//                               end: 926,
//                               object: {
//                                 type: 'ThisExpression',
//                                 start: 908,
//                                 end: 912,
//                               },
//                               property: {
//                                 type: 'Identifier',
//                                 start: 913,
//                                 end: 926,
//                                 name: 'lastScrollTop',
//                               },
//                               computed: false,
//                               optional: false,
//                             },
//                             right: {
//                               type: 'Literal',
//                               start: 929,
//                               end: 930,
//                               value: 0,
//                               raw: '0',
//                             },
//                           },
//                         },
//                       ],
//                     },
//                     alternate: null,
//                   },
//                 ],
//               },
//             },
//           },
//           {
//             type: 'MethodDefinition',
//             start: 940,
//             end: 1141,
//             static: false,
//             computed: false,
//             key: {
//               type: 'Identifier',
//               start: 940,
//               end: 957,
//               name: 'componentDidMount',
//             },
//             kind: 'method',
//             value: {
//               type: 'FunctionExpression',
//               start: 957,
//               end: 1141,
//               id: null,
//               expression: false,
//               generator: false,
//               async: false,
//               params: [],
//               body: {
//                 type: 'BlockStatement',
//                 start: 960,
//                 end: 1141,
//                 body: [
//                   {
//                     type: 'ExpressionStatement',
//                     start: 964,
//                     end: 987,
//                     expression: {
//                       type: 'AssignmentExpression',
//                       start: 964,
//                       end: 986,
//                       operator: '=',
//                       left: {
//                         type: 'MemberExpression',
//                         start: 964,
//                         end: 979,
//                         object: {
//                           type: 'ThisExpression',
//                           start: 964,
//                           end: 968,
//                         },
//                         property: {
//                           type: 'Identifier',
//                           start: 969,
//                           end: 979,
//                           name: 'IS_MOUNTED',
//                         },
//                         computed: false,
//                         optional: false,
//                       },
//                       right: {
//                         type: 'Literal',
//                         start: 982,
//                         end: 986,
//                         value: true,
//                         raw: 'true',
//                       },
//                     },
//                   },
//                   {
//                     type: 'IfStatement',
//                     start: 991,
//                     end: 1138,
//                     test: {
//                       type: 'MemberExpression',
//                       start: 995,
//                       end: 1021,
//                       object: {
//                         type: 'MemberExpression',
//                         start: 995,
//                         end: 1005,
//                         object: {
//                           type: 'ThisExpression',
//                           start: 995,
//                           end: 999,
//                         },
//                         property: {
//                           type: 'Identifier',
//                           start: 1000,
//                           end: 1005,
//                           name: 'props',
//                         },
//                         computed: false,
//                         optional: false,
//                       },
//                       property: {
//                         type: 'Identifier',
//                         start: 1006,
//                         end: 1021,
//                         name: 'scrollSensitive',
//                       },
//                       computed: false,
//                       optional: false,
//                     },
//                     consequent: {
//                       type: 'BlockStatement',
//                       start: 1023,
//                       end: 1138,
//                       body: [
//                         {
//                           type: 'ExpressionStatement',
//                           start: 1028,
//                           end: 1134,
//                           expression: {
//                             type: 'CallExpression',
//                             start: 1028,
//                             end: 1133,
//                             callee: {
//                               type: 'MemberExpression',
//                               start: 1028,
//                               end: 1069,
//                               object: {
//                                 type: 'CallExpression',
//                                 start: 1028,
//                                 end: 1052,
//                                 callee: {
//                                   type: 'MemberExpression',
//                                   start: 1028,
//                                   end: 1050,
//                                   object: {
//                                     type: 'ThisExpression',
//                                     start: 1028,
//                                     end: 1032,
//                                   },
//                                   property: {
//                                     type: 'Identifier',
//                                     start: 1033,
//                                     end: 1050,
//                                     name: '_getScrollElement',
//                                   },
//                                   computed: false,
//                                   optional: false,
//                                 },
//                                 arguments: [],
//                                 optional: false,
//                               },
//                               property: {
//                                 type: 'Identifier',
//                                 start: 1053,
//                                 end: 1069,
//                                 name: 'addEventListener',
//                               },
//                               computed: false,
//                               optional: false,
//                             },
//                             arguments: [
//                               {
//                                 type: 'Literal',
//                                 start: 1075,
//                                 end: 1083,
//                                 value: 'scroll',
//                                 raw: '"scroll"',
//                               },
//                               {
//                                 type: 'MemberExpression',
//                                 start: 1089,
//                                 end: 1107,
//                                 object: {
//                                   type: 'ThisExpression',
//                                   start: 1089,
//                                   end: 1093,
//                                 },
//                                 property: {
//                                   type: 'Identifier',
//                                   start: 1094,
//                                   end: 1107,
//                                   name: 'throttledFunc',
//                                 },
//                                 computed: false,
//                                 optional: false,
//                               },
//                               {
//                                 type: 'Identifier',
//                                 start: 1113,
//                                 end: 1128,
//                                 name: 'supportsPassive',
//                               },
//                             ],
//                             optional: false,
//                           },
//                         },
//                       ],
//                     },
//                     alternate: null,
//                   },
//                 ],
//               },
//             },
//           },
//           {
//             type: 'MethodDefinition',
//             start: 1143,
//             end: 1351,
//             static: false,
//             computed: false,
//             key: {
//               type: 'Identifier',
//               start: 1143,
//               end: 1163,
//               name: 'componentWillUnmount',
//             },
//             kind: 'method',
//             value: {
//               type: 'FunctionExpression',
//               start: 1163,
//               end: 1351,
//               id: null,
//               expression: false,
//               generator: false,
//               async: false,
//               params: [],
//               body: {
//                 type: 'BlockStatement',
//                 start: 1166,
//                 end: 1351,
//                 body: [
//                   {
//                     type: 'ExpressionStatement',
//                     start: 1170,
//                     end: 1194,
//                     expression: {
//                       type: 'AssignmentExpression',
//                       start: 1170,
//                       end: 1193,
//                       operator: '=',
//                       left: {
//                         type: 'MemberExpression',
//                         start: 1170,
//                         end: 1185,
//                         object: {
//                           type: 'ThisExpression',
//                           start: 1170,
//                           end: 1174,
//                         },
//                         property: {
//                           type: 'Identifier',
//                           start: 1175,
//                           end: 1185,
//                           name: 'IS_MOUNTED',
//                         },
//                         computed: false,
//                         optional: false,
//                       },
//                       right: {
//                         type: 'Literal',
//                         start: 1188,
//                         end: 1193,
//                         value: false,
//                         raw: 'false',
//                       },
//                     },
//                   },
//                   {
//                     type: 'IfStatement',
//                     start: 1198,
//                     end: 1348,
//                     test: {
//                       type: 'MemberExpression',
//                       start: 1202,
//                       end: 1228,
//                       object: {
//                         type: 'MemberExpression',
//                         start: 1202,
//                         end: 1212,
//                         object: {
//                           type: 'ThisExpression',
//                           start: 1202,
//                           end: 1206,
//                         },
//                         property: {
//                           type: 'Identifier',
//                           start: 1207,
//                           end: 1212,
//                           name: 'props',
//                         },
//                         computed: false,
//                         optional: false,
//                       },
//                       property: {
//                         type: 'Identifier',
//                         start: 1213,
//                         end: 1228,
//                         name: 'scrollSensitive',
//                       },
//                       computed: false,
//                       optional: false,
//                     },
//                     consequent: {
//                       type: 'BlockStatement',
//                       start: 1230,
//                       end: 1348,
//                       body: [
//                         {
//                           type: 'ExpressionStatement',
//                           start: 1235,
//                           end: 1344,
//                           expression: {
//                             type: 'CallExpression',
//                             start: 1235,
//                             end: 1343,
//                             callee: {
//                               type: 'MemberExpression',
//                               start: 1235,
//                               end: 1279,
//                               object: {
//                                 type: 'CallExpression',
//                                 start: 1235,
//                                 end: 1259,
//                                 callee: {
//                                   type: 'MemberExpression',
//                                   start: 1235,
//                                   end: 1257,
//                                   object: {
//                                     type: 'ThisExpression',
//                                     start: 1235,
//                                     end: 1239,
//                                   },
//                                   property: {
//                                     type: 'Identifier',
//                                     start: 1240,
//                                     end: 1257,
//                                     name: '_getScrollElement',
//                                   },
//                                   computed: false,
//                                   optional: false,
//                                 },
//                                 arguments: [],
//                                 optional: false,
//                               },
//                               property: {
//                                 type: 'Identifier',
//                                 start: 1260,
//                                 end: 1279,
//                                 name: 'removeEventListener',
//                               },
//                               computed: false,
//                               optional: false,
//                             },
//                             arguments: [
//                               {
//                                 type: 'Literal',
//                                 start: 1285,
//                                 end: 1293,
//                                 value: 'scroll',
//                                 raw: '"scroll"',
//                               },
//                               {
//                                 type: 'MemberExpression',
//                                 start: 1299,
//                                 end: 1317,
//                                 object: {
//                                   type: 'ThisExpression',
//                                   start: 1299,
//                                   end: 1303,
//                                 },
//                                 property: {
//                                   type: 'Identifier',
//                                   start: 1304,
//                                   end: 1317,
//                                   name: 'throttledFunc',
//                                 },
//                                 computed: false,
//                                 optional: false,
//                               },
//                               {
//                                 type: 'Identifier',
//                                 start: 1323,
//                                 end: 1338,
//                                 name: 'supportsPassive',
//                               },
//                             ],
//                             optional: false,
//                           },
//                         },
//                       ],
//                     },
//                     alternate: null,
//                   },
//                 ],
//               },
//             },
//           },
//           {
//             type: 'MethodDefinition',
//             start: 1354,
//             end: 1395,
//             static: false,
//             computed: false,
//             key: {
//               type: 'Identifier',
//               start: 1354,
//               end: 1371,
//               name: '_getScrollElement',
//             },
//             kind: 'method',
//             value: {
//               type: 'FunctionExpression',
//               start: 1371,
//               end: 1395,
//               id: null,
//               expression: false,
//               generator: false,
//               async: false,
//               params: [],
//               body: {
//                 type: 'BlockStatement',
//                 start: 1374,
//                 end: 1395,
//                 body: [
//                   {
//                     type: 'ReturnStatement',
//                     start: 1378,
//                     end: 1392,
//                     argument: {
//                       type: 'Identifier',
//                       start: 1385,
//                       end: 1391,
//                       name: 'window',
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//           {
//             type: 'MethodDefinition',
//             start: 1397,
//             end: 2144,
//             static: false,
//             computed: false,
//             key: {
//               type: 'Identifier',
//               start: 1397,
//               end: 1406,
//               name: '_onScroll',
//             },
//             kind: 'method',
//             value: {
//               type: 'FunctionExpression',
//               start: 1406,
//               end: 2144,
//               id: null,
//               expression: false,
//               generator: false,
//               async: false,
//               params: [],
//               body: {
//                 type: 'BlockStatement',
//                 start: 1409,
//                 end: 2144,
//                 body: [
//                   {
//                     type: 'VariableDeclaration',
//                     start: 1413,
//                     end: 1452,
//                     declarations: [
//                       {
//                         type: 'VariableDeclarator',
//                         start: 1419,
//                         end: 1451,
//                         id: {
//                           type: 'Identifier',
//                           start: 1419,
//                           end: 1425,
//                           name: 'offset',
//                         },
//                         init: {
//                           type: 'LogicalExpression',
//                           start: 1428,
//                           end: 1451,
//                           left: {
//                             type: 'MemberExpression',
//                             start: 1428,
//                             end: 1445,
//                             object: {
//                               type: 'MemberExpression',
//                               start: 1428,
//                               end: 1438,
//                               object: {
//                                 type: 'ThisExpression',
//                                 start: 1428,
//                                 end: 1432,
//                               },
//                               property: {
//                                 type: 'Identifier',
//                                 start: 1433,
//                                 end: 1438,
//                                 name: 'props',
//                               },
//                               computed: false,
//                               optional: false,
//                             },
//                             property: {
//                               type: 'Identifier',
//                               start: 1439,
//                               end: 1445,
//                               name: 'offset',
//                             },
//                             computed: false,
//                             optional: false,
//                           },
//                           operator: '||',
//                           right: {
//                             type: 'Literal',
//                             start: 1449,
//                             end: 1451,
//                             value: 48,
//                             raw: '48',
//                           },
//                         },
//                       },
//                     ],
//                     kind: 'const',
//                   },
//                   {
//                     type: 'VariableDeclaration',
//                     start: 1455,
//                     end: 1497,
//                     declarations: [
//                       {
//                         type: 'VariableDeclarator',
//                         start: 1461,
//                         end: 1496,
//                         id: {
//                           type: 'ObjectPattern',
//                           start: 1461,
//                           end: 1483,
//                           properties: [
//                             {
//                               type: 'Property',
//                               start: 1463,
//                               end: 1481,
//                               method: false,
//                               shorthand: true,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 start: 1463,
//                                 end: 1481,
//                                 name: 'shouldHideOnScroll',
//                               },
//                               kind: 'init',
//                               value: {
//                                 type: 'Identifier',
//                                 start: 1463,
//                                 end: 1481,
//                                 name: 'shouldHideOnScroll',
//                               },
//                             },
//                           ],
//                         },
//                         init: {
//                           type: 'MemberExpression',
//                           start: 1486,
//                           end: 1496,
//                           object: {
//                             type: 'ThisExpression',
//                             start: 1486,
//                             end: 1490,
//                           },
//                           property: {
//                             type: 'Identifier',
//                             start: 1491,
//                             end: 1496,
//                             name: 'state',
//                           },
//                           computed: false,
//                           optional: false,
//                         },
//                       },
//                     ],
//                     kind: 'const',
//                   },
//                   {
//                     type: 'VariableDeclaration',
//                     start: 1501,
//                     end: 1548,
//                     declarations: [
//                       {
//                         type: 'VariableDeclarator',
//                         start: 1505,
//                         end: 1547,
//                         id: {
//                           type: 'Identifier',
//                           start: 1505,
//                           end: 1520,
//                           name: 'scrollContainer',
//                         },
//                         init: {
//                           type: 'CallExpression',
//                           start: 1523,
//                           end: 1547,
//                           callee: {
//                             type: 'MemberExpression',
//                             start: 1523,
//                             end: 1545,
//                             object: {
//                               type: 'ThisExpression',
//                               start: 1523,
//                               end: 1527,
//                             },
//                             property: {
//                               type: 'Identifier',
//                               start: 1528,
//                               end: 1545,
//                               name: '_getScrollElement',
//                             },
//                             computed: false,
//                             optional: false,
//                           },
//                           arguments: [],
//                           optional: false,
//                         },
//                       },
//                     ],
//                     kind: 'let',
//                   },
//                   {
//                     type: 'VariableDeclaration',
//                     start: 1551,
//                     end: 1618,
//                     declarations: [
//                       {
//                         type: 'VariableDeclarator',
//                         start: 1555,
//                         end: 1617,
//                         id: {
//                           type: 'Identifier',
//                           start: 1555,
//                           end: 1557,
//                           name: 'st',
//                         },
//                         init: {
//                           type: 'LogicalExpression',
//                           start: 1560,
//                           end: 1617,
//                           left: {
//                             type: 'LogicalExpression',
//                             start: 1560,
//                             end: 1612,
//                             left: {
//                               type: 'MemberExpression',
//                               start: 1560,
//                               end: 1585,
//                               object: {
//                                 type: 'Identifier',
//                                 start: 1560,
//                                 end: 1575,
//                                 name: 'scrollContainer',
//                               },
//                               property: {
//                                 type: 'Identifier',
//                                 start: 1576,
//                                 end: 1585,
//                                 name: 'scrollTop',
//                               },
//                               computed: false,
//                               optional: false,
//                             },
//                             operator: '||',
//                             right: {
//                               type: 'MemberExpression',
//                               start: 1589,
//                               end: 1612,
//                               object: {
//                                 type: 'Identifier',
//                                 start: 1589,
//                                 end: 1604,
//                                 name: 'scrollContainer',
//                               },
//                               property: {
//                                 type: 'Identifier',
//                                 start: 1605,
//                                 end: 1612,
//                                 name: 'scrollY',
//                               },
//                               computed: false,
//                               optional: false,
//                             },
//                           },
//                           operator: '||',
//                           right: {
//                             type: 'Literal',
//                             start: 1616,
//                             end: 1617,
//                             value: 0,
//                             raw: '0',
//                           },
//                         },
//                       },
//                     ],
//                     kind: 'let',
//                   },
//                   {
//                     type: 'VariableDeclaration',
//                     start: 1621,
//                     end: 1668,
//                     declarations: [
//                       {
//                         type: 'VariableDeclarator',
//                         start: 1627,
//                         end: 1667,
//                         id: {
//                           type: 'Identifier',
//                           start: 1627,
//                           end: 1631,
//                           name: 'diff',
//                         },
//                         init: {
//                           type: 'CallExpression',
//                           start: 1634,
//                           end: 1667,
//                           callee: {
//                             type: 'MemberExpression',
//                             start: 1634,
//                             end: 1642,
//                             object: {
//                               type: 'Identifier',
//                               start: 1634,
//                               end: 1638,
//                               name: 'Math',
//                             },
//                             property: {
//                               type: 'Identifier',
//                               start: 1639,
//                               end: 1642,
//                               name: 'abs',
//                             },
//                             computed: false,
//                             optional: false,
//                           },
//                           arguments: [
//                             {
//                               type: 'BinaryExpression',
//                               start: 1643,
//                               end: 1666,
//                               left: {
//                                 type: 'Identifier',
//                                 start: 1643,
//                                 end: 1645,
//                                 name: 'st',
//                               },
//                               operator: '-',
//                               right: {
//                                 type: 'MemberExpression',
//                                 start: 1648,
//                                 end: 1666,
//                                 object: {
//                                   type: 'ThisExpression',
//                                   start: 1648,
//                                   end: 1652,
//                                 },
//                                 property: {
//                                   type: 'Identifier',
//                                   start: 1653,
//                                   end: 1666,
//                                   name: 'lastScrollTop',
//                                 },
//                                 computed: false,
//                                 optional: false,
//                               },
//                             },
//                           ],
//                           optional: false,
//                         },
//                       },
//                     ],
//                     kind: 'const',
//                   },
//                   {
//                     type: 'VariableDeclaration',
//                     start: 1672,
//                     end: 1706,
//                     declarations: [
//                       {
//                         type: 'VariableDeclarator',
//                         start: 1676,
//                         end: 1705,
//                         id: {
//                           type: 'Identifier',
//                           start: 1676,
//                           end: 1684,
//                           name: 'newValue',
//                         },
//                         init: {
//                           type: 'Identifier',
//                           start: 1687,
//                           end: 1705,
//                           name: 'shouldHideOnScroll',
//                         },
//                       },
//                     ],
//                     kind: 'let',
//                   },
//                   {
//                     type: 'IfStatement',
//                     start: 1709,
//                     end: 1932,
//                     test: {
//                       type: 'BinaryExpression',
//                       start: 1713,
//                       end: 1727,
//                       left: {
//                         type: 'Identifier',
//                         start: 1713,
//                         end: 1717,
//                         name: 'diff',
//                       },
//                       operator: '>=',
//                       right: {
//                         type: 'Identifier',
//                         start: 1721,
//                         end: 1727,
//                         name: 'offset',
//                       },
//                     },
//                     consequent: {
//                       type: 'BlockStatement',
//                       start: 1729,
//                       end: 1868,
//                       body: [
//                         {
//                           type: 'IfStatement',
//                           start: 1734,
//                           end: 1864,
//                           test: {
//                             type: 'BinaryExpression',
//                             start: 1738,
//                             end: 1761,
//                             left: {
//                               type: 'Identifier',
//                               start: 1738,
//                               end: 1740,
//                               name: 'st',
//                             },
//                             operator: '>',
//                             right: {
//                               type: 'MemberExpression',
//                               start: 1743,
//                               end: 1761,
//                               object: {
//                                 type: 'ThisExpression',
//                                 start: 1743,
//                                 end: 1747,
//                               },
//                               property: {
//                                 type: 'Identifier',
//                                 start: 1748,
//                                 end: 1761,
//                                 name: 'lastScrollTop',
//                               },
//                               computed: false,
//                               optional: false,
//                             },
//                           },
//                           consequent: {
//                             type: 'BlockStatement',
//                             start: 1763,
//                             end: 1811,
//                             body: [
//                               {
//                                 type: 'ExpressionStatement',
//                                 start: 1769,
//                                 end: 1806,
//                                 expression: {
//                                   type: 'AssignmentExpression',
//                                   start: 1769,
//                                   end: 1805,
//                                   operator: '=',
//                                   left: {
//                                     type: 'Identifier',
//                                     start: 1769,
//                                     end: 1777,
//                                     name: 'newValue',
//                                   },
//                                   right: {
//                                     type: 'UnaryExpression',
//                                     start: 1780,
//                                     end: 1805,
//                                     operator: '!',
//                                     prefix: true,
//                                     argument: {
//                                       type: 'MemberExpression',
//                                       start: 1781,
//                                       end: 1805,
//                                       object: {
//                                         type: 'ThisExpression',
//                                         start: 1781,
//                                         end: 1785,
//                                       },
//                                       property: {
//                                         type: 'Identifier',
//                                         start: 1786,
//                                         end: 1805,
//                                         name: '_shouldHideOnScroll',
//                                       },
//                                       computed: false,
//                                       optional: false,
//                                     },
//                                   },
//                                 },
//                               },
//                             ],
//                           },
//                           alternate: {
//                             type: 'BlockStatement',
//                             start: 1817,
//                             end: 1864,
//                             body: [
//                               {
//                                 type: 'ExpressionStatement',
//                                 start: 1823,
//                                 end: 1859,
//                                 expression: {
//                                   type: 'AssignmentExpression',
//                                   start: 1823,
//                                   end: 1858,
//                                   operator: '=',
//                                   left: {
//                                     type: 'Identifier',
//                                     start: 1823,
//                                     end: 1831,
//                                     name: 'newValue',
//                                   },
//                                   right: {
//                                     type: 'MemberExpression',
//                                     start: 1834,
//                                     end: 1858,
//                                     object: {
//                                       type: 'ThisExpression',
//                                       start: 1834,
//                                       end: 1838,
//                                     },
//                                     property: {
//                                       type: 'Identifier',
//                                       start: 1839,
//                                       end: 1858,
//                                       name: '_shouldHideOnScroll',
//                                     },
//                                     computed: false,
//                                     optional: false,
//                                   },
//                                 },
//                               },
//                             ],
//                           },
//                         },
//                       ],
//                     },
//                     alternate: {
//                       type: 'IfStatement',
//                       start: 1874,
//                       end: 1932,
//                       test: {
//                         type: 'BinaryExpression',
//                         start: 1878,
//                         end: 1885,
//                         left: {
//                           type: 'Identifier',
//                           start: 1878,
//                           end: 1880,
//                           name: 'st',
//                         },
//                         operator: '==',
//                         right: {
//                           type: 'Literal',
//                           start: 1884,
//                           end: 1885,
//                           value: 0,
//                           raw: '0',
//                         },
//                       },
//                       consequent: {
//                         type: 'BlockStatement',
//                         start: 1887,
//                         end: 1932,
//                         body: [
//                           {
//                             type: 'ExpressionStatement',
//                             start: 1892,
//                             end: 1928,
//                             expression: {
//                               type: 'AssignmentExpression',
//                               start: 1892,
//                               end: 1927,
//                               operator: '=',
//                               left: {
//                                 type: 'Identifier',
//                                 start: 1892,
//                                 end: 1900,
//                                 name: 'newValue',
//                               },
//                               right: {
//                                 type: 'MemberExpression',
//                                 start: 1903,
//                                 end: 1927,
//                                 object: {
//                                   type: 'ThisExpression',
//                                   start: 1903,
//                                   end: 1907,
//                                 },
//                                 property: {
//                                   type: 'Identifier',
//                                   start: 1908,
//                                   end: 1927,
//                                   name: '_shouldHideOnScroll',
//                                 },
//                                 computed: false,
//                                 optional: false,
//                               },
//                             },
//                           },
//                         ],
//                       },
//                       alternate: null,
//                     },
//                   },
//                   {
//                     type: 'IfStatement',
//                     start: 1978,
//                     end: 2113,
//                     test: {
//                       type: 'BinaryExpression',
//                       start: 1982,
//                       end: 2013,
//                       left: {
//                         type: 'Identifier',
//                         start: 1982,
//                         end: 2000,
//                         name: 'shouldHideOnScroll',
//                       },
//                       operator: '!==',
//                       right: {
//                         type: 'Identifier',
//                         start: 2005,
//                         end: 2013,
//                         name: 'newValue',
//                       },
//                     },
//                     consequent: {
//                       type: 'BlockStatement',
//                       start: 2015,
//                       end: 2113,
//                       body: [
//                         {
//                           type: 'IfStatement',
//                           start: 2020,
//                           end: 2109,
//                           test: {
//                             type: 'MemberExpression',
//                             start: 2024,
//                             end: 2039,
//                             object: {
//                               type: 'ThisExpression',
//                               start: 2024,
//                               end: 2028,
//                             },
//                             property: {
//                               type: 'Identifier',
//                               start: 2029,
//                               end: 2039,
//                               name: 'IS_MOUNTED',
//                             },
//                             computed: false,
//                             optional: false,
//                           },
//                           consequent: {
//                             type: 'BlockStatement',
//                             start: 2041,
//                             end: 2109,
//                             body: [
//                               {
//                                 type: 'ExpressionStatement',
//                                 start: 2047,
//                                 end: 2104,
//                                 expression: {
//                                   type: 'CallExpression',
//                                   start: 2047,
//                                   end: 2103,
//                                   callee: {
//                                     type: 'MemberExpression',
//                                     start: 2047,
//                                     end: 2060,
//                                     object: {
//                                       type: 'ThisExpression',
//                                       start: 2047,
//                                       end: 2051,
//                                     },
//                                     property: {
//                                       type: 'Identifier',
//                                       start: 2052,
//                                       end: 2060,
//                                       name: 'setState',
//                                     },
//                                     computed: false,
//                                     optional: false,
//                                   },
//                                   arguments: [
//                                     {
//                                       type: 'ObjectExpression',
//                                       start: 2061,
//                                       end: 2102,
//                                       properties: [
//                                         {
//                                           type: 'Property',
//                                           start: 2068,
//                                           end: 2096,
//                                           method: false,
//                                           shorthand: false,
//                                           computed: false,
//                                           key: {
//                                             type: 'Identifier',
//                                             start: 2068,
//                                             end: 2086,
//                                             name: 'shouldHideOnScroll',
//                                           },
//                                           value: {
//                                             type: 'Identifier',
//                                             start: 2088,
//                                             end: 2096,
//                                             name: 'newValue',
//                                           },
//                                           kind: 'init',
//                                         },
//                                       ],
//                                     },
//                                   ],
//                                   optional: false,
//                                 },
//                               },
//                             ],
//                           },
//                           alternate: null,
//                         },
//                       ],
//                     },
//                     alternate: null,
//                   },
//                   {
//                     type: 'ExpressionStatement',
//                     start: 2117,
//                     end: 2141,
//                     expression: {
//                       type: 'AssignmentExpression',
//                       start: 2117,
//                       end: 2140,
//                       operator: '=',
//                       left: {
//                         type: 'MemberExpression',
//                         start: 2117,
//                         end: 2135,
//                         object: {
//                           type: 'ThisExpression',
//                           start: 2117,
//                           end: 2121,
//                         },
//                         property: {
//                           type: 'Identifier',
//                           start: 2122,
//                           end: 2135,
//                           name: 'lastScrollTop',
//                         },
//                         computed: false,
//                         optional: false,
//                       },
//                       right: {
//                         type: 'Identifier',
//                         start: 2138,
//                         end: 2140,
//                         name: 'st',
//                       },
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//           {
//             type: 'MethodDefinition',
//             start: 2147,
//             end: 2815,
//             static: false,
//             computed: false,
//             key: {
//               type: 'Identifier',
//               start: 2147,
//               end: 2153,
//               name: 'render',
//             },
//             kind: 'method',
//             value: {
//               type: 'FunctionExpression',
//               start: 2153,
//               end: 2815,
//               id: null,
//               expression: false,
//               generator: false,
//               async: false,
//               params: [],
//               body: {
//                 type: 'BlockStatement',
//                 start: 2156,
//                 end: 2815,
//                 body: [
//                   {
//                     type: 'VariableDeclaration',
//                     start: 2160,
//                     end: 2374,
//                     declarations: [
//                       {
//                         type: 'VariableDeclarator',
//                         start: 2166,
//                         end: 2373,
//                         id: {
//                           type: 'ObjectPattern',
//                           start: 2166,
//                           end: 2360,
//                           properties: [
//                             {
//                               type: 'Property',
//                               start: 2171,
//                               end: 2186,
//                               method: false,
//                               shorthand: true,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 start: 2171,
//                                 end: 2181,
//                                 name: 'classNames',
//                               },
//                               kind: 'init',
//                               value: {
//                                 type: 'AssignmentPattern',
//                                 start: 2171,
//                                 end: 2186,
//                                 left: {
//                                   type: 'Identifier',
//                                   start: 2171,
//                                   end: 2181,
//                                   name: 'classNames',
//                                 },
//                                 right: {
//                                   type: 'Literal',
//                                   start: 2184,
//                                   end: 2186,
//                                   value: '',
//                                   raw: '""',
//                                 },
//                               },
//                             },
//                             {
//                               type: 'Property',
//                               start: 2191,
//                               end: 2209,
//                               method: false,
//                               shorthand: true,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 start: 2191,
//                                 end: 2197,
//                                 name: 'height',
//                               },
//                               kind: 'init',
//                               value: {
//                                 type: 'AssignmentPattern',
//                                 start: 2191,
//                                 end: 2209,
//                                 left: {
//                                   type: 'Identifier',
//                                   start: 2191,
//                                   end: 2197,
//                                   name: 'height',
//                                 },
//                                 right: {
//                                   type: 'Literal',
//                                   start: 2200,
//                                   end: 2209,
//                                   value: 'H($2xl)',
//                                   raw: '"H($2xl)"',
//                                 },
//                               },
//                             },
//                             {
//                               type: 'Property',
//                               start: 2214,
//                               end: 2226,
//                               method: false,
//                               shorthand: true,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 start: 2214,
//                                 end: 2217,
//                                 name: 'top',
//                               },
//                               kind: 'init',
//                               value: {
//                                 type: 'AssignmentPattern',
//                                 start: 2214,
//                                 end: 2226,
//                                 left: {
//                                   type: 'Identifier',
//                                   start: 2214,
//                                   end: 2217,
//                                   name: 'top',
//                                 },
//                                 right: {
//                                   type: 'Literal',
//                                   start: 2220,
//                                   end: 2226,
//                                   value: 'T(0)',
//                                   raw: '"T(0)"',
//                                 },
//                               },
//                             },
//                             {
//                               type: 'Property',
//                               start: 2231,
//                               end: 2247,
//                               method: false,
//                               shorthand: true,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 start: 2231,
//                                 end: 2237,
//                                 name: 'ZIndex',
//                               },
//                               kind: 'init',
//                               value: {
//                                 type: 'AssignmentPattern',
//                                 start: 2231,
//                                 end: 2247,
//                                 left: {
//                                   type: 'Identifier',
//                                   start: 2231,
//                                   end: 2237,
//                                   name: 'ZIndex',
//                                 },
//                                 right: {
//                                   type: 'Literal',
//                                   start: 2240,
//                                   end: 2247,
//                                   value: 'Z(50)',
//                                   raw: '"Z(50)"',
//                                 },
//                               },
//                             },
//                             {
//                               type: 'Property',
//                               start: 2252,
//                               end: 2260,
//                               method: false,
//                               shorthand: true,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 start: 2252,
//                                 end: 2260,
//                                 name: 'children',
//                               },
//                               kind: 'init',
//                               value: {
//                                 type: 'Identifier',
//                                 start: 2252,
//                                 end: 2260,
//                                 name: 'children',
//                               },
//                             },
//                             {
//                               type: 'Property',
//                               start: 2265,
//                               end: 2284,
//                               method: false,
//                               shorthand: true,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 start: 2265,
//                                 end: 2276,
//                                 name: 'transparent',
//                               },
//                               kind: 'init',
//                               value: {
//                                 type: 'AssignmentPattern',
//                                 start: 2265,
//                                 end: 2284,
//                                 left: {
//                                   type: 'Identifier',
//                                   start: 2265,
//                                   end: 2276,
//                                   name: 'transparent',
//                                 },
//                                 right: {
//                                   type: 'Literal',
//                                   start: 2279,
//                                   end: 2284,
//                                   value: false,
//                                   raw: 'false',
//                                 },
//                               },
//                             },
//                             {
//                               type: 'Property',
//                               start: 2289,
//                               end: 2304,
//                               method: false,
//                               shorthand: true,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 start: 2289,
//                                 end: 2296,
//                                 name: 'noFixed',
//                               },
//                               kind: 'init',
//                               value: {
//                                 type: 'AssignmentPattern',
//                                 start: 2289,
//                                 end: 2304,
//                                 left: {
//                                   type: 'Identifier',
//                                   start: 2289,
//                                   end: 2296,
//                                   name: 'noFixed',
//                                 },
//                                 right: {
//                                   type: 'Literal',
//                                   start: 2299,
//                                   end: 2304,
//                                   value: false,
//                                   raw: 'false',
//                                 },
//                               },
//                             },
//                             {
//                               type: 'Property',
//                               start: 2309,
//                               end: 2332,
//                               method: false,
//                               shorthand: true,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 start: 2309,
//                                 end: 2324,
//                                 name: 'scrollSensitive',
//                               },
//                               kind: 'init',
//                               value: {
//                                 type: 'AssignmentPattern',
//                                 start: 2309,
//                                 end: 2332,
//                                 left: {
//                                   type: 'Identifier',
//                                   start: 2309,
//                                   end: 2324,
//                                   name: 'scrollSensitive',
//                                 },
//                                 right: {
//                                   type: 'Literal',
//                                   start: 2327,
//                                   end: 2332,
//                                   value: false,
//                                   raw: 'false',
//                                 },
//                               },
//                             },
//                             {
//                               type: 'Property',
//                               start: 2337,
//                               end: 2356,
//                               method: false,
//                               shorthand: true,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 start: 2337,
//                                 end: 2348,
//                                 name: 'posRelative',
//                               },
//                               kind: 'init',
//                               value: {
//                                 type: 'AssignmentPattern',
//                                 start: 2337,
//                                 end: 2356,
//                                 left: {
//                                   type: 'Identifier',
//                                   start: 2337,
//                                   end: 2348,
//                                   name: 'posRelative',
//                                 },
//                                 right: {
//                                   type: 'Literal',
//                                   start: 2351,
//                                   end: 2356,
//                                   value: false,
//                                   raw: 'false',
//                                 },
//                               },
//                             },
//                           ],
//                         },
//                         init: {
//                           type: 'MemberExpression',
//                           start: 2363,
//                           end: 2373,
//                           object: {
//                             type: 'ThisExpression',
//                             start: 2363,
//                             end: 2367,
//                           },
//                           property: {
//                             type: 'Identifier',
//                             start: 2368,
//                             end: 2373,
//                             name: 'props',
//                           },
//                           computed: false,
//                           optional: false,
//                         },
//                       },
//                     ],
//                     kind: 'const',
//                   },
//                   {
//                     type: 'VariableDeclaration',
//                     start: 2377,
//                     end: 2440,
//                     declarations: [
//                       {
//                         type: 'VariableDeclarator',
//                         start: 2381,
//                         end: 2439,
//                         id: {
//                           type: 'Identifier',
//                           start: 2381,
//                           end: 2385,
//                           name: 'bgcp',
//                         },
//                         init: {
//                           type: 'ConditionalExpression',
//                           start: 2388,
//                           end: 2439,
//                           test: {
//                             type: 'UnaryExpression',
//                             start: 2388,
//                             end: 2400,
//                             operator: '!',
//                             prefix: true,
//                             argument: {
//                               type: 'Identifier',
//                               start: 2389,
//                               end: 2400,
//                               name: 'transparent',
//                             },
//                           },
//                           consequent: {
//                             type: 'Literal',
//                             start: 2403,
//                             end: 2434,
//                             value: 'Bxsh($bxshheader) Bgc($white)',
//                             raw: '"Bxsh($bxshheader) Bgc($white)"',
//                           },
//                           alternate: {
//                             type: 'TemplateLiteral',
//                             start: 2437,
//                             end: 2439,
//                             expressions: [],
//                             quasis: [
//                               {
//                                 type: 'TemplateElement',
//                                 start: 2438,
//                                 end: 2438,
//                                 value: {
//                                   raw: '',
//                                   cooked: '',
//                                 },
//                                 tail: true,
//                               },
//                             ],
//                           },
//                         },
//                       },
//                     ],
//                     kind: 'let',
//                   },
//                   {
//                     type: 'VariableDeclaration',
//                     start: 2443,
//                     end: 2483,
//                     declarations: [
//                       {
//                         type: 'VariableDeclarator',
//                         start: 2447,
//                         end: 2482,
//                         id: {
//                           type: 'Identifier',
//                           start: 2447,
//                           end: 2450,
//                           name: 'pos',
//                         },
//                         init: {
//                           type: 'ConditionalExpression',
//                           start: 2453,
//                           end: 2482,
//                           test: {
//                             type: 'Identifier',
//                             start: 2453,
//                             end: 2460,
//                             name: 'noFixed',
//                           },
//                           consequent: {
//                             type: 'TemplateLiteral',
//                             start: 2463,
//                             end: 2471,
//                             expressions: [],
//                             quasis: [
//                               {
//                                 type: 'TemplateElement',
//                                 start: 2464,
//                                 end: 2470,
//                                 value: {
//                                   raw: 'Pos(a)',
//                                   cooked: 'Pos(a)',
//                                 },
//                                 tail: true,
//                               },
//                             ],
//                           },
//                           alternate: {
//                             type: 'TemplateLiteral',
//                             start: 2474,
//                             end: 2482,
//                             expressions: [],
//                             quasis: [
//                               {
//                                 type: 'TemplateElement',
//                                 start: 2475,
//                                 end: 2481,
//                                 value: {
//                                   raw: 'Pos(f)',
//                                   cooked: 'Pos(f)',
//                                 },
//                                 tail: true,
//                               },
//                             ],
//                           },
//                         },
//                       },
//                     ],
//                     kind: 'let',
//                   },
//                   {
//                     type: 'ExpressionStatement',
//                     start: 2486,
//                     end: 2521,
//                     expression: {
//                       type: 'AssignmentExpression',
//                       start: 2486,
//                       end: 2520,
//                       operator: '=',
//                       left: {
//                         type: 'Identifier',
//                         start: 2486,
//                         end: 2489,
//                         name: 'pos',
//                       },
//                       right: {
//                         type: 'ConditionalExpression',
//                         start: 2492,
//                         end: 2520,
//                         test: {
//                           type: 'Identifier',
//                           start: 2492,
//                           end: 2503,
//                           name: 'posRelative',
//                         },
//                         consequent: {
//                           type: 'Literal',
//                           start: 2506,
//                           end: 2514,
//                           value: 'Pos(r)',
//                           raw: '"Pos(r)"',
//                         },
//                         alternate: {
//                           type: 'Identifier',
//                           start: 2517,
//                           end: 2520,
//                           name: 'pos',
//                         },
//                       },
//                     },
//                   },
//                   {
//                     type: 'VariableDeclaration',
//                     start: 2525,
//                     end: 2628,
//                     declarations: [
//                       {
//                         type: 'VariableDeclarator',
//                         start: 2529,
//                         end: 2627,
//                         id: {
//                           type: 'Identifier',
//                           start: 2529,
//                           end: 2538,
//                           name: 'hideClass',
//                         },
//                         init: {
//                           type: 'ConditionalExpression',
//                           start: 2544,
//                           end: 2627,
//                           test: {
//                             type: 'LogicalExpression',
//                             start: 2544,
//                             end: 2592,
//                             left: {
//                               type: 'Identifier',
//                               start: 2544,
//                               end: 2559,
//                               name: 'scrollSensitive',
//                             },
//                             operator: '&&',
//                             right: {
//                               type: 'MemberExpression',
//                               start: 2563,
//                               end: 2592,
//                               object: {
//                                 type: 'MemberExpression',
//                                 start: 2563,
//                                 end: 2573,
//                                 object: {
//                                   type: 'ThisExpression',
//                                   start: 2563,
//                                   end: 2567,
//                                 },
//                                 property: {
//                                   type: 'Identifier',
//                                   start: 2568,
//                                   end: 2573,
//                                   name: 'state',
//                                 },
//                                 computed: false,
//                                 optional: false,
//                               },
//                               property: {
//                                 type: 'Identifier',
//                                 start: 2574,
//                                 end: 2592,
//                                 name: 'shouldHideOnScroll',
//                               },
//                               computed: false,
//                               optional: false,
//                             },
//                           },
//                           consequent: {
//                             type: 'Literal',
//                             start: 2599,
//                             end: 2618,
//                             value: 'TranslateY(-250%)',
//                             raw: '"TranslateY(-250%)"',
//                           },
//                           alternate: {
//                             type: 'Literal',
//                             start: 2625,
//                             end: 2627,
//                             value: '',
//                             raw: '""',
//                           },
//                         },
//                       },
//                     ],
//                     kind: 'let',
//                   },
//                   {
//                     type: 'ReturnStatement',
//                     start: 2632,
//                     end: 2812,
//                     argument: {
//                       type: 'JSXElement',
//                       start: 2644,
//                       end: 2807,
//                       openingElement: {
//                         type: 'JSXOpeningElement',
//                         start: 2644,
//                         end: 2779,
//                         attributes: [
//                           {
//                             type: 'JSXAttribute',
//                             start: 2656,
//                             end: 2774,
//                             name: {
//                               type: 'JSXIdentifier',
//                               start: 2656,
//                               end: 2665,
//                               name: 'className',
//                             },
//                             value: {
//                               type: 'JSXExpressionContainer',
//                               start: 2666,
//                               end: 2774,
//                               expression: {
//                                 type: 'TemplateLiteral',
//                                 start: 2667,
//                                 end: 2773,
//                                 expressions: [
//                                   {
//                                     type: 'Identifier',
//                                     start: 2670,
//                                     end: 2673,
//                                     name: 'pos',
//                                   },
//                                   {
//                                     type: 'Identifier',
//                                     start: 2677,
//                                     end: 2683,
//                                     name: 'height',
//                                   },
//                                   {
//                                     type: 'Identifier',
//                                     start: 2687,
//                                     end: 2690,
//                                     name: 'top',
//                                   },
//                                   {
//                                     type: 'Identifier',
//                                     start: 2711,
//                                     end: 2717,
//                                     name: 'ZIndex',
//                                   },
//                                   {
//                                     type: 'Identifier',
//                                     start: 2721,
//                                     end: 2725,
//                                     name: 'bgcp',
//                                   },
//                                   {
//                                     type: 'Identifier',
//                                     start: 2748,
//                                     end: 2757,
//                                     name: 'hideClass',
//                                   },
//                                   {
//                                     type: 'Identifier',
//                                     start: 2761,
//                                     end: 2771,
//                                     name: 'classNames',
//                                   },
//                                 ],
//                                 quasis: [
//                                   {
//                                     type: 'TemplateElement',
//                                     start: 2668,
//                                     end: 2668,
//                                     value: {
//                                       raw: '',
//                                       cooked: '',
//                                     },
//                                     tail: false,
//                                   },
//                                   {
//                                     type: 'TemplateElement',
//                                     start: 2674,
//                                     end: 2675,
//                                     value: {
//                                       raw: ' ',
//                                       cooked: ' ',
//                                     },
//                                     tail: false,
//                                   },
//                                   {
//                                     type: 'TemplateElement',
//                                     start: 2684,
//                                     end: 2685,
//                                     value: {
//                                       raw: ' ',
//                                       cooked: ' ',
//                                     },
//                                     tail: false,
//                                   },
//                                   {
//                                     type: 'TemplateElement',
//                                     start: 2691,
//                                     end: 2709,
//                                     value: {
//                                       raw: ' Start(0) W(100%) ',
//                                       cooked: ' Start(0) W(100%) ',
//                                     },
//                                     tail: false,
//                                   },
//                                   {
//                                     type: 'TemplateElement',
//                                     start: 2718,
//                                     end: 2719,
//                                     value: {
//                                       raw: ' ',
//                                       cooked: ' ',
//                                     },
//                                     tail: false,
//                                   },
//                                   {
//                                     type: 'TemplateElement',
//                                     start: 2726,
//                                     end: 2746,
//                                     value: {
//                                       raw: ' Trs($trstransform) ',
//                                       cooked: ' Trs($trstransform) ',
//                                     },
//                                     tail: false,
//                                   },
//                                   {
//                                     type: 'TemplateElement',
//                                     start: 2758,
//                                     end: 2759,
//                                     value: {
//                                       raw: ' ',
//                                       cooked: ' ',
//                                     },
//                                     tail: false,
//                                   },
//                                   {
//                                     type: 'TemplateElement',
//                                     start: 2772,
//                                     end: 2772,
//                                     value: {
//                                       raw: '',
//                                       cooked: '',
//                                     },
//                                     tail: true,
//                                   },
//                                 ],
//                               },
//                             },
//                           },
//                         ],
//                         name: {
//                           type: 'JSXIdentifier',
//                           start: 2645,
//                           end: 2651,
//                           name: 'header',
//                         },
//                         selfClosing: false,
//                       },
//                       closingElement: {
//                         type: 'JSXClosingElement',
//                         start: 2798,
//                         end: 2807,
//                         name: {
//                           type: 'JSXIdentifier',
//                           start: 2800,
//                           end: 2806,
//                           name: 'header',
//                         },
//                       },
//                       children: [
//                         {
//                           type: 'JSXText',
//                           start: 2779,
//                           end: 2784,
//                           value: '\n\t\t\t\t',
//                           raw: '\n\t\t\t\t',
//                         },
//                         {
//                           type: 'JSXExpressionContainer',
//                           start: 2784,
//                           end: 2794,
//                           expression: {
//                             type: 'Identifier',
//                             start: 2785,
//                             end: 2793,
//                             name: 'children',
//                           },
//                         },
//                         {
//                           type: 'JSXText',
//                           start: 2794,
//                           end: 2798,
//                           value: '\n\t\t\t',
//                           raw: '\n\t\t\t',
//                         },
//                       ],
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//         ],
//       },
//     },
//     {
//       type: 'ExportDefaultDeclaration',
//       start: 2819,
//       end: 2841,
//       declaration: {
//         type: 'Identifier',
//         start: 2834,
//         end: 2840,
//         name: 'Header',
//       },
//     },
//   ],
//   sourceType: 'module',
// };

// const propsArr = [];
// const propTypesArr = [];
// const populatePropsArray = ([grandParentObject, parentObject]) => {
//   const grandParentValue = Object.values(grandParentObject)[0];
//   const parentKey = Object.keys(parentObject)[0];
//   if (parentKey === 'init') {
//     grandParentValue.id.properties.forEach((p) => {
//       if (!propsArr.includes(p.value.name || p.key.name))
//         propsArr.push(p.value.name || p.key.name);
//     });
//   } else if (
//     (grandParentValue.type === 'BinaryExpression' ||
//       grandParentValue.type === 'IfStatement') &&
//     !propsArr.includes(grandParentValue[parentKey].property.name)
//   ) {
//     propsArr.push(grandParentValue[parentKey].property.name);
//   } else if (!propsArr.includes(grandParentValue.property.name)) {
//     propsArr.push(grandParentValue.property.name);
//   }
// };
// const populatePropTypesArray = ([grandParentObject, parentObject]) => {
//   const parentValue = Object.values(parentObject)[0];

//   if (
//     parentValue.type === 'PropertyDefinition' &&
//     parentValue.key.name === 'propTypes'
//   ) {
//     parentValue.value.properties.forEach((property) => {
//       if (!propTypesArr.includes(property.key.name))
//         propTypesArr.push(property.key.name);
//     });
//   }
// };
// getParentAndGrandParent([], obj1, 'props', populatePropsArray);
// getParentAndGrandParent([], obj1, 'propTypes', populatePropTypesArray);
// console.log('propsArr');
// console.log(propsArr.length);
// console.log('propTypesArr');

// console.log(propTypesArr.length);
// console.log('missing props: ');
// const missingPropsArr = propsArr.filter((prop) => !propTypesArr.includes(prop));
// console.log(missingPropsArr);
