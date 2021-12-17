const declarationTypes = {
  FUNCTION_DECLARATION: 'FunctionDeclaration',
  VARIABLE_DECLARATION: 'VariableDeclaration',
  EXPORT_NAMED_DECLARATION: 'ExportNamedDeclaration',
  EXPORT_DEFAULT_DECLARATION: 'ExportDefaultDeclaration',
  VARIABLE_DECLARATOR: 'VariableDeclarator',
  CLASS_DECLARATION: 'ClassDeclaration',
};

const expressionTypes = {
  FUNCTION_EXPRESSION: 'FunctionExpression',
  ARROW_FUNCTION_EXPRESSION: 'ArrowFunctionExpression',
  BINARY_EXPRESSION: 'BinaryExpression',
  ASSIGNMENT_EXPRESSION: 'AssignmentExpression',
  IF_STATEMENT: 'IfStatement',
  MEMBER_EXPRESSION: 'MemberExpression',
  LOGICAL_EXPRESSION: 'LogicalExpression',
  CALL_EXPRESSION: 'CallExpression',
  OBJECT_EXPRESSION: 'ObjectExpression',
  EXPRESSION_STATEMENT: 'ExpressionStatement',
};

const astConstants = {
  PROPS: 'props',
  PROP_TYPES: 'propTypes',
  PROPERTY_DEFINITION: 'PropertyDefinition',
  INIT: 'init',
};

const frameworks = {
  REACT: 'react',
  VUE: 'vue',
  SVELTE: 'svelte',
};

const docIgnoreComment = '/* !Doc Coverage Ignore */';

module.exports = {
  declarationTypes,
  expressionTypes,
  astConstants,
  frameworks,
  docIgnoreComment,
};
