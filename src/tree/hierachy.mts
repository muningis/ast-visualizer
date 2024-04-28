import type { Program, AnyNode, VariableDeclarator, Pattern, Expression } from "acorn"
import { AstNode } from "./types.mts"
import { nanoid } from "nanoid";

export function visitNodes(nodes: Array<AnyNode | VariableDeclarator | null>, parentId: string): AstNode[] {
  return nodes.flatMap(node => visitNode(node, parentId));
}
export function visitNode(node: AnyNode | VariableDeclarator | null | undefined, parentId: string, meta?: Record<string, string>): AstNode[] {
  const id = nanoid();
  if (!node) return [];
  const baseNode = { id, parentId, type: node.type, meta };
  switch (node.type) {
    case "ArrayExpression":
      return [baseNode, ...visitNodes(node.elements, id)];
    case "ArrayPattern":
      return [baseNode, ...visitNodes(node.elements, id)];
    case "ArrowFunctionExpression":
      return [baseNode, ...visitNode(node.body, id)];
    case "AssignmentExpression":
      /** @todo */
      return [baseNode, ...visitNodes([node.left, node.right], id)];
    case "AssignmentPattern":
      return [baseNode, ...visitNodes([node.left, node.right], id)];
    case "AwaitExpression":
      return [baseNode, ...visitNode(node.argument, id)];
    case "BinaryExpression":
      /** @todo */
      return [{...baseNode, operator: node.operator}, ...visitNodes([node.left, node.right], id)];
    case "BlockStatement":
      return [{...baseNode, content: "{/* ... */}"}, ...visitNodes(node.body, id)];
    case 'BreakStatement':
      return [baseNode];
    case "CallExpression":
      /** @todo */
      switch (node.callee.type) {
        case "Identifier": return [{...baseNode, name: node.callee.name}];
        default: return [baseNode];
      }
    case "CatchClause":
      return [baseNode, ...visitNode(node.body, id)];
    case "ChainExpression":
      return [baseNode];
    case "ClassBody":
      return [baseNode, ...visitNodes(node.body, id)];
    case "ClassDeclaration":
      return [baseNode, ...visitNode(node.body, id)];
    case "ClassExpression":
      return [baseNode, ...visitNode(node.body, id)];
    case "ConditionalExpression":
      /** @todo */
      // return [baseNode, ...visitNodes([node.test, node.consequent, node.alternate], id)];
      return [
        baseNode,
        ...visitNode(node.test, id),
        ...visitNode(node.consequent, id, { type: "consequent" }),
        ...visitNode(node.alternate, id, { type: "alternate" }),
      ];
    case "ContinueStatement":
      return [baseNode, ...(node.label ? visitNode(node.label, id) : [])];
    case "DebuggerStatement":
      return [baseNode];
    case "DoWhileStatement":
      return [baseNode, ...visitNode(node.body, id)];
    case "EmptyStatement":
      return [baseNode];
    case "ExportAllDeclaration":
      return [baseNode, ...(node.exported ? visitNode(node.exported, id): [])];
    case "ExportDefaultDeclaration":
      return [baseNode, ...visitNode(node.declaration, id)];
    case "ExportNamedDeclaration":
      return [baseNode, ...visitNode(node.declaration!, id)];
    case "ExportSpecifier":
      return [baseNode, ...visitNode(node.exported, id)];
    case "ExpressionStatement":
      return [baseNode, ...visitNode(node.expression, id)];
    case "ForInStatement":
      return [baseNode, ...visitNode(node.body, id)];
    case "ForOfStatement":
      return [baseNode, ...visitNode(node.body, id)];
    case "ForStatement":
      return [baseNode, ...visitNode(node.body, id)];
    case "FunctionDeclaration":
      return [{
        ...baseNode,
        content: getContent(node)
      }, ...visitNode(node.body, id)];
    case "FunctionExpression":
      return [baseNode, ...visitNode(node.body, id)];
    case "Identifier":
      return [{...baseNode, name: node.name }];
    case "IfStatement":
      /** @todo */
      return [
        baseNode,
        ...visitNode(node.test, id),
        ...visitNode(node.consequent, id, { type: "consequent" }),
        ...visitNode(node.alternate, id, { type: "alternate" }),
      ];
    case "ImportDeclaration":
      return [baseNode, ...visitNodes(node.specifiers, id)];
    case "ImportDefaultSpecifier":
      return [baseNode, ...visitNode(node.local, id)];
    case "ImportExpression":
      return [baseNode, ...visitNode(node.source, id)];
    case "ImportNamespaceSpecifier":
      return [baseNode, ...visitNode(node.local, id)];
    case "ImportSpecifier":
      return [baseNode, ...visitNodes([node.local, node.imported], id)];
    case "LabeledStatement":
      return [baseNode, ...visitNode(node.body, id)];
    case "Literal":
      /** @todo - regexes */
      return [{...baseNode, value: node.raw }];
    case "LogicalExpression":
      /** @todo - show node.operator */
      return [baseNode, ...visitNodes([node.left, node.right], id)];
    case "MemberExpression":
      return [baseNode, ...visitNodes([node.object, node.property], id)];
    case "MetaProperty":
      return [baseNode, ...visitNode(node.property, id)];
    case "MethodDefinition":
      return [baseNode, ...visitNode(node.value, id)];
    case "NewExpression":
      return [baseNode, ...visitNodes(node.arguments, id)];
    case "ObjectExpression":
      return [baseNode, ...visitNodes(node.properties, id)];
    case "ObjectPattern":
      return [baseNode, ...visitNodes(node.properties, id)];
    case "ParenthesizedExpression":
      return [baseNode, ...visitNode(node.expression, id)];
    case "PrivateIdentifier":
      /** @todo */
      return [baseNode];
    case "Program":
      return [baseNode, ...visitNodes(node.body, id)];
    case "Property":
      /** @todo */
      return [baseNode, ...visitNodes([
        node.key,
        ...(node.value.type !== "Identifier" ? [node.value] : [])
      ], id)];
    case "PropertyDefinition":
      return [baseNode, ...(node.value ? visitNode(node.value, id) : [])];
    case "RestElement":
      return [baseNode, ...visitNode(node.argument, id)];
    case "ReturnStatement":
      return [baseNode, ...(node.argument ? visitNode(node.argument, id) : [])];
    case "SequenceExpression":
      return [baseNode, ...visitNodes(node.expressions, id)];
    case "SpreadElement":
      return [baseNode, ...visitNode(node.argument, id)];
    case "StaticBlock":
      return [baseNode, ...visitNodes(node.body, id)];
    case "Super":
      return [baseNode];
    case "SwitchCase":
      /** @todo - add what's the condition */
      return [baseNode, ...visitNodes(node.consequent, id)];
    case "SwitchStatement":
      return [baseNode, ...visitNodes(node.cases, id)];
    case "TaggedTemplateExpression":
      return [baseNode, ...visitNodes([node.tag, node.quasi], id)];
    case "TemplateElement":
      return [{...baseNode, value: node.value.raw}];
    case "TemplateLiteral":
      return [baseNode, ...([...node.quasis, ...node.expressions].sort((a, b) => a.start - b.start).flatMap(node => visitNode(node, id)))];
    case "ThisExpression":
      return [baseNode];
    case "ThrowStatement":
      return [baseNode, ...visitNode(node.argument, id)];
    case "TryStatement":
      return [baseNode];
    case "UnaryExpression":
      return [baseNode];
    case "UpdateExpression":
      return [baseNode];
    case "VariableDeclaration":
      return [{...baseNode, content: node.kind}, ...visitNodes(node.declarations, id)];
    case "VariableDeclarator":
      return [{ ...baseNode, content: getContent(node) }];
    case "WhileStatement":
      return [baseNode, ...visitNode(node.body, id)];
    case "WithStatement":
      return [baseNode, ...visitNode(node.body, id)];
    case "YieldExpression":
      return [baseNode, ...(node.argument ? visitNode(node.argument, id) : [])];
    default:
      throw new Error(`Unreachable point in #visitNode() with node.type of ${node["type"] as any}`)
  }
}

const getContent = (node: AnyNode | VariableDeclarator): string => {
  switch (node.type) {
    case "BinaryExpression":
      return `${getContent(node.left)} ${node.operator} ${getContent(node.right)}`
    case "ExpressionStatement":
      return "ExprStmt"
    case "FunctionDeclaration": return `${node.async ? 'async ' : ''}function ${node.id?.name ?? "AnonymousFunction"}()`;
    case "Literal": return node.raw ?? "";
    case "VariableDeclarator":
      switch (node.init?.type) {
        case "Literal": return `${getName(node.id)} = ${getValue(node.init)}`;
        case "ConditionalExpression": return `${getName(node.id)} = ${getContent(node.init.test)} ? ${getContent(node.init.consequent)} : ${getContent(node.init.alternate)}`
        default: return "Not Yet Implemented"
      }
    default: return "Not Yet Implemented"
  }
}


const getName = (id: Pattern): string => {
  switch (id.type) {
    case "Identifier":
      return id.name
    default:
      return id.type;
  }
}

const getValue = (expression: Expression | null | undefined): string => {
  if (!expression) return "null"
  switch (expression?.type) {
    case "Literal":
      return expression.raw ?? "";
    default:
      return JSON.stringify(expression)
  }
}

export function flattenData(program: Program): AstNode[] {
  return [...visitNode(program, "")]
}