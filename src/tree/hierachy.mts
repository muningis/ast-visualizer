import type { Program, AnyNode, VariableDeclarator } from "acorn"
import { HierarchyAstNode } from "./types.mts"

const visitNode = (node: AnyNode | VariableDeclarator): HierarchyAstNode => {
  switch (node.type) {
    case "FunctionDeclaration":
      return {
        type: node.type,
        name: node.id?.name,
        children: [
          ...(node.id ? [visitNode(node.id)] : []),
          ...node.body.body.map(node => visitNode(node))
        ]
      }
    case "ReturnStatement":
      return {
        type: node.type,
        children: [{ type: node.argument?.type!, children: node.argument ? [visitNode(node.argument)] : [] }]
      }
    case "VariableDeclaration":
      return {
        type: node.type,
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

    case "Literal":
      return {
        type: node.type,
        value: node.raw,
        // children: node.body.body.map(node => visitNode(node))
      }

    case "BlockStatement":
      return {
        type: node.type,
        children: node.body.map(node => visitNode(node))
      }

    case "TemplateLiteral":
      return {
        type: node.type,
        children: [...node.quasis, ...node.expressions].sort((a, b) => a.start - b.start).map(node => visitNode(node))
      }

    case "TemplateElement":
      return {
        type: node.type,
        value: node.value.raw
        // children: node.body.map(node => visitNode(node))
      }

    case "Identifier":
      return {
        type: node.type,
        value: node.name
        // children: node.body.map(node => visitNode(node))
      }

    case "ExportNamedDeclaration":
      console.log({ node });
      return {
        type: node.type,
        children: [visitNode(node.declaration!)]
      }

    case "ObjectExpression":
      return {
        type: node.type,
        children: node.properties.map(property => visitNode(property))
      }

    case "Property":
      return {
        type: node.type
      }
    default:
      return { type: node.type, children: [] }
  }
}
export function getHierarchy(program: Program): HierarchyAstNode {
  return {
    type: program.type,
    children: program.body.map(node => visitNode(node))
  }
}