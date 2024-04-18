import type { Program, AnyNode, VariableDeclarator } from "acorn"
import { HierarchyAstNode } from "./types.mts"
import { children } from "solid-js/types/server/reactive.js"

const visitNode = (node: AnyNode | VariableDeclarator | null): HierarchyAstNode => {
  if (node === null) return { type: "Literal", value: "null" }
  switch (node.type) {
    case "ArrayExpression":
      return {
        type: node.type,
        children: node.elements.map(element => visitNode(element))
      }
    case "ArrayPattern":
      return { type: node.type }
    case "ArrowFunctionExpression":
      return {
        type: node.type,
        children: [visitNode(node.body)]
      }
    case "AssignmentExpression":
      return { type: node.type }
    case "AssignmentPattern":
      return { type: node.type }
    case "AwaitExpression":
      return { type: node.type }
    case "BinaryExpression":
      return {
        type: node.type,
        value: node.operator,
        children: [visitNode(node.left), visitNode(node.right)]
      }
    case "BlockStatement":
      return {
        type: node.type,
        children: node.body.map(node => visitNode(node))
      }
    case "BreakStatement":
      return { type: node.type }
    case "CallExpression":
      return {
        type: node.type,
        children: [visitNode(node.callee), ...node.arguments.map(arg => visitNode(arg))],
      }
    case "CatchClause":
      return { type: node.type }
    case 'ChainExpression':
      return { type: node.type }
    case "ClassBody":
      return { type: node.type }
    case "ClassDeclaration":
      return { type: node.type }
    case "ClassExpression":
      return { type: node.type }
    case "ConditionalExpression":
      return { type: node.type }
    case "ContinueStatement":
      return { type: node.type }
    case "DebuggerStatement":
      return { type: node.type }
    case "DoWhileStatement":
      return { type: node.type }
    case "EmptyStatement":
      return { type: node.type }
    case "ExportAllDeclaration":
      return { type: node.type }
    case "ExportDefaultDeclaration":
      return { type: node.type }
    case "ExportNamedDeclaration":
      console.log({ node });
      return {
        type: node.type,
        children: [visitNode(node.declaration!)]
      }
    case "ExportSpecifier":
      return { type: node.type }
    case "ExpressionStatement":
      return {
        type: node.type,
        children: [visitNode(node.expression)]
      }
    case "ForInStatement":
      return { type: node.type }
    case "ForOfStatement":
      return { type: node.type }
    case "ForStatement":
      return { type: node.type }
    case "FunctionExpression":
      return { type: node.type }
    case "FunctionDeclaration":
      return {
        type: node.type,
        name: node.id?.name,
        meta: {
          async: node.async
        },
        children: [
          ...(node.id ? [visitNode(node.id)] : []),
          ...node.body.body.map(node => visitNode(node))
        ]
      }
    case "Identifier":
      return {
        type: node.type,
        value: node.name
        // children: node.body.map(node => visitNode(node))
      }
    case 'IfStatement':
      return { type: node.type }
    case 'ImportDeclaration':
      return { type: node.type }
    case "ImportDefaultSpecifier":
      return { type: node.type }
    case "ImportExpression":
      return { type: node.type }
    case "ImportNamespaceSpecifier":
      return { type: node.type }
    case "ImportSpecifier":
      return { type: node.type }
    case "LabeledStatement":
      return { type: node.type }
    case "Literal":
      return {
        type: node.type,
        value: node.raw,
        // children: node.body.body.map(node => visitNode(node))
      }
    case "LogicalExpression":
      return { type: node.type }
    case "MemberExpression":
      return {
        type: node.type,
        children: [visitNode(node.object), visitNode(node.property)],
      }
    case "MetaProperty":
      return { type: node.type }
    case "MethodDefinition":
      return { type: node.type }
    case "NewExpression":
      return { type: node.type }
    case "ObjectExpression":
      return {
        type: node.type,
        children: node.properties.map(property => visitNode(property))
      }
    case "ObjectPattern":
      return {
        type: node.type,
        children: node.properties.map(property => visitNode(property))
      }
    case "ParenthesizedExpression":
      return { type: node.type }
    case "PrivateIdentifier":
      return { type: node.type }
    case "Program":
      return { type: node.type, children: node.body.map(node => visitNode(node)) }
    case "Property":
      console.log({ node });
      return {
        type: node.type,
        children: [
          visitNode(node.key),
          ...(node.value.type !== "Identifier" ? [visitNode(node.value)] : [])
        ]
      }
    case "PropertyDefinition":
      return { type: node.type }
    case "RestElement":
      return { type: node.type }
    case "ReturnStatement":
      return {
        type: node.type,
        children: [{ type: node.argument?.type!, children: node.argument ? [visitNode(node.argument)] : [] }]
      }
    case "SequenceExpression":
      return { type: node.type }
    case "SpreadElement":
      return {
        type: node.type,
        children: [visitNode(node.argument)]
      }
    case "StaticBlock":
      return { type: node.type }
    case "Super":
      return { type: node.type }
    case "SwitchCase":
      return { type: node.type }
    case "SwitchStatement":
      return { type: node.type }
    case "TaggedTemplateExpression":
      return { type: node.type }
    case "TemplateElement":
      return {
        type: node.type,
        value: node.value.raw
        // children: node.body.map(node => visitNode(node))
      }
    case "TemplateLiteral":
      return {
        type: node.type,
        children: [...node.quasis, ...node.expressions].sort((a, b) => a.start - b.start).map(node => visitNode(node))
      }
    case "ThisExpression":
      return { type: node.type }
    case "ThrowStatement":
      return { type: node.type }
    case "TryStatement":
      return { type: node.type }
    case "UnaryExpression":
      return { type: node.type }
    case "UpdateExpression":
      return { type: node.type }
    case "VariableDeclaration":
      return {
        type: node.type,
        value: node.kind,
        children: node.declarations.map(node => visitNode(node))
      }
    case "VariableDeclarator":
      return {
        type: node.type,
        children: [
          ...[visitNode(node.id)],
          ...(node.init ? [visitNode(node.init)] : []),
        ]
      }
    case "WhileStatement":
      return { type: node.type }
    case "WithStatement":
      return { type: node.type }
    case "YieldExpression":
      return { type: node.type }
  }
}
export function getHierarchy(program: Program): HierarchyAstNode {
  return visitNode(program);
}