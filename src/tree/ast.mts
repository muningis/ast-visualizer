import { VariableDeclarator } from "acorn"
import { AnyNode } from "acorn"

export type AstGroup = "Statement" | "Expression" | "Pattern" | "ModuleDeclaration"

export const astGroupByType: Partial<Record<(AnyNode | VariableDeclarator)["type"], AstGroup>> = {
  "ExpressionStatement": "Statement",
  "BlockStatement": "Statement",
  "EmptyStatement": "Statement",
  "DebuggerStatement": "Statement",
  "WithStatement": "Statement",
  "ReturnStatement": "Statement",
  "LabeledStatement": "Statement",
  "BreakStatement": "Statement",
  "ContinueStatement": "Statement",
  "IfStatement": "Statement",
  "SwitchStatement": "Statement",
  "ThrowStatement": "Statement",
  "TryStatement": "Statement",
  "WhileStatement": "Statement",
  "DoWhileStatement": "Statement",
  "ForStatement": "Statement",
  "ForInStatement": "Statement",
  "ForOfStatement": "Statement",

  "FunctionDeclaration": "Statement",
  "VariableDeclaration": "Statement",
  "VariableDeclarator": "Statement",
  "ClassDeclaration": "Statement",

  "Identifier": "Expression",
  "Literal": "Expression",
  "ThisExpression": "Expression",
  "ArrayExpression": "Expression",
  "ObjectExpression": "Expression",
  "FunctionExpression": "Expression",
  "UnaryExpression": "Expression",
  "UpdateExpression": "Expression",
  "BinaryExpression": "Expression",
  "AssignmentExpression": "Expression",
  "LogicalExpression": "Expression",
  "MemberExpression": "Expression",
  "ConditionalExpression": "Expression",
  "CallExpression": "Expression",
  "NewExpression": "Expression",
  "SequenceExpression": "Expression",
  "ArrowFunctionExpression": "Expression",
  "YieldExpression": "Expression",
  "TemplateLiteral": "Expression",
  "TaggedTemplateExpression": "Expression",
  "ClassExpression": "Expression",
  "MetaProperty": "Expression",
  "AwaitExpression": "Expression",
  "ChainExpression": "Expression",
  "ImportExpression": "Expression",
  "ParenthesizedExpression": "Expression",

  "ObjectPattern": "Pattern",
  "ArrayPattern": "Pattern",
  "RestElement": "Pattern",
  "AssignmentPattern": "Pattern",

  "ImportDeclaration": "ModuleDeclaration",
  "ExportNamedDeclaration": "ModuleDeclaration",
  "ExportDefaultDeclaration": "ModuleDeclaration",
  "ExportAllDeclaration": "ModuleDeclaration",


}