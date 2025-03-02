import type {
  Program,
  AnyNode,
  VariableDeclarator,
  Pattern,
  Expression,
} from "acorn";
import { AstNode } from "./types.mts";
import { nanoid } from "nanoid";

export function visitNodes(
  nodes: Array<AnyNode | VariableDeclarator | null>,
  parentId: string,
): AstNode[] {
  return nodes.flatMap((node) => visitNode(node, parentId));
}
export function visitNode(
  node: AnyNode | VariableDeclarator | null | undefined,
  parentId: string,
  meta?: Record<string, string>,
): AstNode[] {
  const id = nanoid();
  if (!node) return [];
  const baseNode = {
    id,
    parentId,
    type: node.type,
    meta,
    content: getContent(node),
  };
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
      return [baseNode, ...visitNodes([node.left, node.right], id)];
    case "BlockStatement":
      return [baseNode, ...visitNodes(node.body, id)];
    case "BreakStatement":
      return [baseNode];
    case "CallExpression":
      return [baseNode, ...visitNodes(node.arguments, id)];
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
      return [baseNode, ...(node.exported ? visitNode(node.exported, id) : [])];
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
      return [
        baseNode,
        ...visitNodes(node.params, id),
        ...visitNode(node.body, id),
      ];
    case "FunctionExpression":
      return [baseNode, ...visitNode(node.body, id)];
    case "Identifier":
      return [baseNode];
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
      return [baseNode];
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
      return [baseNode, ...visitNodes([node.key, node.value], id)];
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
      return [baseNode];
    case "TemplateLiteral":
      return [
        baseNode,
        ...[...node.quasis, ...node.expressions]
          .sort((a, b) => a.start - b.start)
          .flatMap((node) => visitNode(node, id)),
      ];
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
      return [baseNode, ...visitNodes(node.declarations, id)];
    case "VariableDeclarator":
      return [baseNode, ...visitNode(node.init, id)];
    case "WhileStatement":
      return [baseNode, ...visitNode(node.body, id)];
    case "WithStatement":
      return [baseNode, ...visitNode(node.body, id)];
    case "YieldExpression":
      return [baseNode, ...(node.argument ? visitNode(node.argument, id) : [])];
    default:
      throw new Error(
        `Unreachable point in #visitNode() with node.type of ${node["type"] as any}`,
      );
  }
}

const getContent = (node: AnyNode | VariableDeclarator): string => {
  switch (node.type) {
    case "ArrayExpression":
      return `[${node.elements.map((e) => (e ? getContent(e!) : null)).join(", ")}]`;
    case "ArrayPattern":
      return `Not Yet Implemented for ${node.type}`;
    case "ArrowFunctionExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "AssignmentExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "AssignmentPattern":
      return `Not Yet Implemented for ${node.type}`;
    case "AwaitExpression":
      return `await ${getContent(node.argument)}`;
    case "BinaryExpression":
      return `${node.left.type === "BinaryExpression" ? `(${getContent(node.left)})` : getContent(node.left)} ${node.operator} ${node.right.type === "BinaryExpression" ? `(${getContent(node.right)})` : getContent(node.right)}`;
    case "BlockStatement":
      return "{/* ... */}";
    case "BreakStatement":
      return `break`;
    case "CallExpression":
      return `${getContent(node.callee)}()`;
    case "CatchClause":
      return `Not Yet Implemented for ${node.type}`;
    case "ChainExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "ClassBody":
      return `Not Yet Implemented for ${node.type}`;
    case "ClassDeclaration":
      return `Not Yet Implemented for ${node.type}`;
    case "ClassExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "ConditionalExpression":
      return `${getContent(node.test)} ? ${getContent(node.consequent)} : ${getContent(node.alternate)}`;
    case "ContinueStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "DebuggerStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "DoWhileStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "EmptyStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "ExportAllDeclaration":
      return `Not Yet Implemented for ${node.type}`;
    case "ExportDefaultDeclaration":
      return `Not Yet Implemented for ${node.type}`;
    case "ExportNamedDeclaration":
      return `Not Yet Implemented for ${node.type}`;
    case "ExportSpecifier":
      return `"Not Yet Implemented"`;
    case "ExpressionStatement":
      return `ExprStmt`;
    case "ForInStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "ForOfStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "ForStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "FunctionDeclaration":
      return `${node.async ? "async " : ""}function ${node.id?.name ?? "AnonymousFunction"}(${node.params.map((p) => getContent(p)).join(", ")}) {}`;
    case "FunctionExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "Identifier":
      return node.name;
    case "IfStatement":
      return `if (${getContent(node.test)})`;
    case "ImportDeclaration":
      return `Not Yet Implemented for ${node.type}`;
    case "ImportDefaultSpecifier":
      return `Not Yet Implemented for ${node.type}`;
    case "ImportExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "ImportNamespaceSpecifier":
      return `Not Yet Implemented for ${node.type}`;
    case "ImportSpecifier":
      return `Not Yet Implemented for ${node.type}`;
    case "LabeledStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "Literal":
      return node.raw ?? "";
    case "LogicalExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "MemberExpression":
      return `${getContent(node.object)}.${getContent(node.property)}`;
    case "MetaProperty":
      return `Not Yet Implemented for ${node.type}`;
    case "MethodDefinition":
      return `Not Yet Implemented for ${node.type}`;
    case "NewExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "ObjectExpression": {
      const firstMember = node.properties.at(0);
      switch (firstMember?.type) {
        case "Property":
          return `{ ${getContent(firstMember.key)}: ${getContent(firstMember.value)} }`;
        case "SpreadElement":
          return `{ ${getContent(firstMember)} }`;
      }
      return "";
    }
    case "ObjectPattern": {
      const firstMember = node.properties.at(0);
      switch (firstMember?.type) {
        case "Property":
          return `{ ${getContent(firstMember.key)}: ${getContent(firstMember.value)} }`;
        case "RestElement":
          return `{ ${getContent(firstMember)} }`;
      }
      return "";
    }
    case "ParenthesizedExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "PrivateIdentifier":
      return `Not Yet Implemented for ${node.type}`;
    case "Program":
      return node.sourceType;
    case "Property":
      return `${getContent(node.key)} = ${getContent(node.value)}`;
    case "PropertyDefinition":
      return `Not Yet Implemented for ${node.type}`;
    case "RestElement":
      return `...${getContent(node.argument)}`;
    case "ReturnStatement":
      return `return`;
    case "SequenceExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "SpreadElement":
      return `...${getContent(node.argument)}`;
    case "StaticBlock":
      return `Not Yet Implemented for ${node.type}`;
    case "Super":
      return `Not Yet Implemented for ${node.type}`;
    case "SwitchCase":
      return `Not Yet Implemented for ${node.type}`;
    case "SwitchStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "TaggedTemplateExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "TemplateElement":
      return node.value.raw;
    case "TemplateLiteral":
      return `\`${[...node.quasis, ...node.expressions]
        .sort((a, b) => a.start - b.start)
        .flatMap((node) =>
          node.type === "TemplateElement"
            ? getContent(node)
            : `$\{${getContent(node)}}`,
        )
        .join("")}\``;
    case "ThisExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "ThrowStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "TryStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "UnaryExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "UpdateExpression":
      return `Not Yet Implemented for ${node.type}`;
    case "VariableDeclaration":
      return node.kind;
    case "VariableDeclarator": {
      const init = node.init;
      switch (init?.type) {
        case "Literal":
          return `${getName(node.id)} = ${getValue(node.init)}`;
        case "ConditionalExpression":
          return `${getName(node.id)} = ${getContent(init)}`;
        case "ArrayExpression":
          return `${getName(node.id)} = ${getContent(init)}`;
        case "ArrowFunctionExpression":
          return `<i>ArrowFnExpr</i>`;
        case "AssignmentExpression":
          return `${init.left} ${init.right}`;
        case "AwaitExpression":
          return `${getName(node.id)} = ${getContent(init)}`;
        case "BinaryExpression":
          return `${getName(node.id)} = ${getContent(init)}`;
        case "Identifier":
          return `${getName(node.id)} = ${init.name}`;
        case "ObjectExpression":
          return `${getName(node.id)} = ${node.init ? getContent(node.init) : null}`;
        default:
          return `Not Yet Implemented for ${node.init?.type}`;
      }
    }
    case "WhileStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "WithStatement":
      return `Not Yet Implemented for ${node.type}`;
    case "YieldExpression":
      return `Not Yet Implemented for ${node.type}`;
  }
};

const getName = (id: Pattern): string => {
  switch (id.type) {
    case "Identifier":
      return id.name;
    default:
      return id.type;
  }
};

const getValue = (expression: Expression | null | undefined): string => {
  if (!expression) return "null";
  switch (expression?.type) {
    case "Literal":
      return expression.raw ?? "";
    default:
      return JSON.stringify(expression);
  }
};

export function flattenData(program: Program): AstNode[] {
  return [...visitNode(program, "")];
}
