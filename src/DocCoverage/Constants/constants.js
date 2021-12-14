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
};

const astConstants = {
  PROPS: 'props',
  PROP_TYPES: 'propTypes',
  PROPERTY_DEEFINITION: 'PropertyDefinition',
  INIT: 'init',
};

module.exports = {
  declarationTypes,
  expressionTypes,
  astConstants,
};
