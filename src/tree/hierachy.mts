import type { Program, AnyNode, VariableDeclarator } from "acorn"
import { HierarchyAstNode } from "./types.mts"


const visitNodes = (nodes: Array<AnyNode | VariableDeclarator | null>): HierarchyAstNode[] => nodes.map(n => visitNode(n));
const visitNode = (node: AnyNode | VariableDeclarator | null): HierarchyAstNode => {
  if (node === null) return { type: "Literal" }
  switch (node.type) {
    case "ArrayExpression":
      return {
        type: node.type,
        children: visitNodes(node.elements)
      };
    case "ArrayPattern":
      return {
        type: node.type,
        children: visitNodes(node.elements)
      };
    case "ArrowFunctionExpression":
      return {
        type: node.type,
        children: [visitNode(node.body)]
      };
    case "AssignmentExpression":
      return {
        type: node.type,
        children: [{
          type: node.operator,
          children: visitNodes([
            node.left,
            node.right
          ])
        }]
      };
    case "AssignmentPattern":
      return {
        type: node.type,
        children: visitNodes([
          node.left,
          node.right
        ])
      };
    case "AwaitExpression":
      return {
        type: node.type,
        children: [
          visitNode(node.argument)
        ]
      };
    case "BinaryExpression":
      return {
        type: node.type,
        children: [{
          type: node.operator,
          children: visitNodes([
            node.left,
            node.right
          ])
        }]
      };
    case "BlockStatement":
      return {
        type: node.type,
        children: visitNodes(node.body)
      };
    case "BreakStatement":
      return {
        type: node.type,
      };
    case "CallExpression":
      return {
        type: node.type,
        children: visitNodes([node.callee, ...node.arguments]),
      };
    case "CatchClause":
      return {
        type: node.type,
        children: [visitNode(node.body)]
      };
    case 'ChainExpression':
      return {
        type: node.type
      };
    case "ClassBody":
      return {
        type: node.type,
        children: visitNodes(node.body)
      };
    case "ClassDeclaration":
      return {
        type: node.type,
        children: [visitNode(node.body)]
      };
    case "ClassExpression":
      return {
        type: node.type,
        children: [visitNode(node.body)]
      };
    case "ConditionalExpression":
      return {
        type: node.type,
        children: [visitNode(node.test), visitNode(node.consequent), visitNode(node.alternate)]
      };
    case "ContinueStatement":
      return { type: node.type, children: node.label ? [visitNode(node.label)] : [] };
    case "DebuggerStatement":
      return { type: node.type };
    case "DoWhileStatement":
      return {
        type: node.type,
        children: [visitNode(node.body)]
      };
    case "EmptyStatement":
      return { type: node.type };
    case "ExportAllDeclaration":
      return {
        type: node.type,
        children: node.exported ? [visitNode(node.exported)]: []
      };
    case "ExportDefaultDeclaration":
      return {
        type: node.type,
        children: [visitNode(node.declaration)]
      };
    case "ExportNamedDeclaration":
      console.log({ node });
      return {
        type: node.type,
        children: [visitNode(node.declaration!)]
      };
    case "ExportSpecifier":
      return {
        type: node.type,
        children: [visitNode(node.exported)]
      };
    case "ExpressionStatement":
      return {
        type: node.type,
        children: [visitNode(node.expression)]
      };
    case "ForInStatement":
      return {
        type: node.type,
        children: [visitNode(node.body)]
      };
    case "ForOfStatement":
      return { type: node.type, children: [visitNode(node.body)] };
    case "ForStatement":
      return { type: node.type, children: [visitNode(node.body)] };
    case "FunctionExpression":
      return { type: node.type, children: [visitNode(node.body)] };
    case "FunctionDeclaration":
      return {
        type: node.type,
        // name: node.id?.name,
        // meta: {
        //   async: node.async
        // },
        children: [
          ...(node.id ? [visitNode(node.id)] : []),
          visitNode(node.body)
        ]
      };
    case "Identifier":
      return {
        type: node.type,
        // value: node.name
        // children: node.body.map(node => visitNode(node))
      };
    case 'IfStatement':
      return {
        type: node.type,
        children: visitNodes([node.test, node.consequent, ...(node.alternate ? [node.alternate]: [])])
      };
    case 'ImportDeclaration':
      return { type: node.type, children: visitNodes(node.specifiers) };
    case "ImportDefaultSpecifier":
      return { type: node.type, children: [visitNode(node.local)] };
    case "ImportExpression":
      return { type: node.type, children: [visitNode(node.source)] };
    case "ImportNamespaceSpecifier":
      return { type: node.type, children: [visitNode(node.local)] };
    case "ImportSpecifier":
      return { type: node.type, children: visitNodes([node.local, node.imported]) };
    case "LabeledStatement":
      return {
        type: node.type,
        children: [visitNode(node.body)]
      };
    case "Literal":
      /**
       * @todo - display that literal?
       */
      return {
        type: node.type,
        // value: node.raw,
        // children: node.body.body.map(node => visitNode(node))
      };
    case "LogicalExpression":
      return {
        type: node.type,
        children: [{
          type: node.operator,
          children: visitNodes([node.left, node.right])
        }]
      };
    case "MemberExpression":
      return {
        type: node.type,
        children: visitNodes([node.object, node.property]),
      };
    case "MetaProperty":
      return {
        type: node.type,
        children: [visitNode(node.property)]
      };
    case "MethodDefinition":
      /**
       * @todo
       */
      return {
        type: node.type,
        children: [visitNode(node.value)]
      };
    case "NewExpression":
      return {
        type: node.type,
        children: visitNodes(node.arguments)
      };
    case "ObjectExpression":
      return {
        type: node.type,
        children: visitNodes(node.properties)
      };
    case "ObjectPattern":
      return {
        type: node.type,
        children: visitNodes(node.properties)
      };
    case "ParenthesizedExpression":
      return {
        type: node.type,
        children: [visitNode(node.expression)]
      };
    case "PrivateIdentifier":
      /**
       * @todo
       */
      return {
        type: node.type,
      };
    case "Program":
      return { type: node.type, children: visitNodes(node.body) };
    case "Property":
      return {
        type: node.type,
        children: visitNodes([
          node.key,
          ...(node.value.type !== "Identifier" ? [node.value] : [])
        ])
      };
    case "PropertyDefinition":
      return {
        type: node.type,
        children: node.value ? [visitNode(node.value)] : []
      };
    case "RestElement":
      return {
        type: node.type,
        children: [visitNode(node.argument)]
      };
    case "ReturnStatement":
      return {
        type: node.type,
        children: [{ type: node.argument?.type!, children: node.argument ? [visitNode(node.argument)] : [] }]
      };
    case "SequenceExpression":
      return {
        type: node.type,
        children: visitNodes(node.expressions)
      };
    case "SpreadElement":
      return {
        type: node.type,
        children: [visitNode(node.argument)]
      };
    case "StaticBlock":
      return {
        type: node.type,
        children: visitNodes(node.body)
      };
    case "Super":
      return { type: node.type };
    case "SwitchCase":
      return {
        type: node.type,
        children: visitNodes(node.consequent)
      };
    case "SwitchStatement":
      return {
        type: node.type,
        children: visitNodes(node.cases)
      };
    case "TaggedTemplateExpression":
      return {
        type: node.type,
        children: visitNodes([node.tag, node.quasi])
      };
    case "TemplateElement":
      return {
        type: node.type,
        // value: node.value.raw
        // children: node.body.map(node => visitNode(node))
      };
    case "TemplateLiteral":
      return {
        type: node.type,
        children: [...node.quasis, ...node.expressions].sort((a, b) => a.start - b.start).map(node => visitNode(node))
      };
    case "ThisExpression":
      return {
        type: node.type,
      };
    case "ThrowStatement":
      return {
        type: node.type,
        children: [visitNode(node.argument)]
      };
    case "TryStatement":
      return {
        type: node.type,
        children: [{
          type: "TryClause",
          children: [visitNode(node.block)]
        }, ...(node.handler ? [visitNode(node.handler)] : []),
        ...(node.finalizer ? [{ type: 'FinallyClause', children: [visitNode(node.finalizer)] }] : [])]
      };
    case "UnaryExpression":
      return {
        type: node.type,
        children: [{
          type: node.operator,
          children: [visitNode(node.argument)]
        }]
      };
    case "UpdateExpression":
      return {
        type: node.type,
        children: [{
          type: node.operator,
        }, visitNode(node.argument)]
      };
    case "VariableDeclaration":
      return {
        type: node.type,
        children: visitNodes(node.declarations)
      };
    case "VariableDeclarator":
      return {
        type: node.type,
        children: visitNodes([
          node.id,
          ...(node.init ? [node.init] : []),
        ])
      };
    case "WhileStatement":
      /**
       * @todo node.test
       */
      return {
        type: node.type,
        children: [visitNode(node.body)]
      };
    case "WithStatement":
      /**
       * @todo node.object
       */
      return {
        type: node.type,
        children: [visitNode(node.body)],
      };
    case "YieldExpression":
      return {
        type: node.type,
        children: node.argument ? [visitNode(node.argument)] : undefined
      };
  }
}
export function getHierarchy(program: Program): HierarchyAstNode {
  return visitNode(program);
}