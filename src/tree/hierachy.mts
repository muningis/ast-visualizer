import type { Program, AnyNode, VariableDeclarator } from "acorn"

type HierarchyAstNode = { name: string; children?: Array<HierarchyAstNode> };
const visitNode = (node: AnyNode | VariableDeclarator): HierarchyAstNode => {
  switch (node.type) {
    case "FunctionDeclaration":
      return {
        name: node.type,
        children: node.body.body.map(node => visitNode(node))
      }
    case "ReturnStatement":
      return {
        name: node.type,
        children: [{ name: node.argument?.type!, children: node.argument ? [visitNode(node.argument)] : [] }]
      }

    case "VariableDeclaration":
      return {
        name: node.type,
        children: node.declarations.map(node => visitNode(node))
      }

    case "VariableDeclarator":
      return {
        name: node.type,
        // children: node.body.body.map(node => visitNode(node))
      }

    case "Literal":
      return {
        name: node.type,
        // children: node.body.body.map(node => visitNode(node))
      }

    case "BlockStatement":
      return {
        name: node.type,
        children: node.body.map(node => visitNode(node))
      }

    case "TemplateLiteral":
      return {
        name: node.type,
        children: [...node.quasis, ...node.expressions].sort((a, b) => a.start - b.start).map(node => visitNode(node))
      }

    case "TemplateElement":
      return {
        name: node.type,
        // children: node.body.map(node => visitNode(node))
      }

    case "Identifier":
      return {
        name: node.type,
        // children: node.body.map(node => visitNode(node))
      }

    case "ExportNamedDeclaration":
      console.log({ node });
      return {
        name: node.type,
        children: [visitNode(node.declaration!)]
      }

    case "ObjectExpression":
      return {
        name: node.type,
        children: node.properties.map(property => visitNode(property))
      }

    case "Property":
      return {
        name: node.type
      }
    default:
      return { name: node.type, children: [] }
  }
}
export function getHierarchy(program: Program) {
  return {
    name: program.type,
    children: program.body.map(node => visitNode(node))
  }
}