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

export const getContent = (node: AnyNode | VariableDeclarator): string => {
  switch (node.type) {
    case "ArrayExpression":
      return `[${node.elements.map((e) => (e ? getContent(e!) : null)).join(", ")}]`;
    case "ArrayPattern":
      return `[${node.elements.map((e) => (e ? getContent(e!) : null)).join(", ")}]`;
    case "ArrowFunctionExpression":
      return `${node.async ? "async " : ""}(${node.params.map((p) => getContent(p)).join(", ")}) => ${node.body.type === "BlockStatement" ? "{...}" : getContent(node.body)}`;
    case "AssignmentExpression":
      return `${getContent(node.left)} ${node.operator} ${getContent(node.right)}`;
    case "AssignmentPattern":
      return `${getContent(node.left)} = ${getContent(node.right)}`;
    case "AwaitExpression":
      return `await ${getContent(node.argument)}`;
    case "BinaryExpression":
      return `${node.left.type === "BinaryExpression" ? `(${getContent(node.left)})` : getContent(node.left)} ${node.operator} ${node.right.type === "BinaryExpression" ? `(${getContent(node.right)})` : getContent(node.right)}`;
    case "BlockStatement":
      return "{/* ... */}";
    case "BreakStatement":
      return `break${node.label ? ` ${getContent(node.label)}` : ""}`;
    case "CallExpression":
      return `${getContent(node.callee)}(${node.arguments.map((arg) => getContent(arg)).join(", ")})`;
    case "CatchClause":
      return `catch (${node.param ? getContent(node.param) : ""}) {...}`;
    case "ChainExpression":
      return getContent(node.expression);
    case "ClassBody":
      return `{ /* class members */ }`;
    case "ClassDeclaration":
      return `class ${node.id ? node.id.name : "Anonymous"}${node.superClass ? ` extends ${getContent(node.superClass)}` : ""} {...}`;
    case "ClassExpression":
      return `class${node.id ? ` ${node.id.name}` : ""}${node.superClass ? ` extends ${getContent(node.superClass)}` : ""} {...}`;
    case "ConditionalExpression":
      return `${getContent(node.test)} ? ${getContent(node.consequent)} : ${getContent(node.alternate)}`;
    case "ContinueStatement":
      return `continue${node.label ? ` ${getContent(node.label)}` : ""}`;
    case "DebuggerStatement":
      return `debugger`;
    case "DoWhileStatement":
      return `do {...} while (${getContent(node.test)})`;
    case "EmptyStatement":
      return `;`;
    case "ExportAllDeclaration":
      return `export * ${node.exported ? `as ${getContent(node.exported)}` : ""} from ${node.source.raw}`;
    case "ExportDefaultDeclaration":
      return `export default ${getContent(node.declaration)}`;
    case "ExportNamedDeclaration":
      return `export ${node.declaration ? getContent(node.declaration) : `{${node.specifiers.map((s) => getContent(s)).join(", ")}}`}${node.source ? ` from ${node.source.raw}` : ""}`;
    case "ExportSpecifier":
      return `${getContent(node.local)}${node.exported.type === "Identifier" && node.local.type === "Identifier" && node.exported.name !== node.local.name ? ` as ${getContent(node.exported)}` : ""}`;
    case "ExpressionStatement":
      return `ExprStmt`;
    case "ForInStatement":
      return `for (${getContent(node.left)} in ${getContent(node.right)}) {...}`;
    case "ForOfStatement":
      return `for (${node.await ? "await " : ""}${getContent(node.left)} of ${getContent(node.right)}) {...}`;
    case "ForStatement":
      return `for (${node.init ? getContent(node.init) : ""}; ${node.test ? getContent(node.test) : ""}; ${node.update ? getContent(node.update) : ""}) {...}`;
    case "FunctionDeclaration":
      return `${node.async ? "async " : ""}function ${node.id?.name ?? "AnonymousFunction"}(${node.params.map((p) => getContent(p)).join(", ")}) {}`;
    case "FunctionExpression":
      return `${node.async ? "async " : ""}function${node.id ? ` ${node.id.name}` : ""}(${node.params.map((p) => getContent(p)).join(", ")}) {...}`;
    case "Identifier":
      return node.name;
    case "IfStatement":
      return `if (${getContent(node.test)})`;
    case "ImportDeclaration":
      return `import ${node.specifiers.length ? `${node.specifiers.map((s) => getContent(s)).join(", ")} from ` : ""}${node.source.raw}`;
    case "ImportAttribute":
      return `${getContent(node.key)}: ${getContent(node.value)}`;
    case "ImportDefaultSpecifier":
      return getContent(node.local);
    case "ImportExpression":
      return `import(${getContent(node.source)})`;
    case "ImportNamespaceSpecifier":
      return `* as ${getContent(node.local)}`;
    case "ImportSpecifier":
      return `${getContent(node.imported)}${node.imported.type === "Identifier" && node.local.type === "Identifier" && node.imported.name !== node.local.name ? ` as ${getContent(node.local)}` : ""}`;
    case "LabeledStatement":
      return `${getContent(node.label)}: ${getContent(node.body)}`;
    case "Literal":
      return node.raw ?? "";
    case "LogicalExpression":
      return `${getContent(node.left)} ${node.operator} ${getContent(node.right)}`;
    case "MemberExpression":
      return `${getContent(node.object)}.${getContent(node.property)}`;
    case "MetaProperty":
      return `${getContent(node.meta)}.${getContent(node.property)}`;
    case "MethodDefinition":
      return `${node.static ? "static " : ""}${node.kind} ${getContent(node.key)}(${node.value.params.map((p) => getContent(p)).join(", ")}) {...}`;
    case "NewExpression":
      return `new ${getContent(node.callee)}(${node.arguments.map((arg) => getContent(arg)).join(", ")})`;
    case "ObjectExpression": {
      const firstMember = node.properties.at(0);
      switch (firstMember?.type) {
        case "Property":
          return `{ ${getContent(firstMember.key)}: ${getContent(firstMember.value)} }`;
        case "SpreadElement":
          return `{ ${getContent(firstMember)} }`;
      }
      return "{}";
    }
    case "ObjectPattern": {
      const firstMember = node.properties.at(0);
      switch (firstMember?.type) {
        case "Property":
          return `{ ${getContent(firstMember.key)}: ${getContent(firstMember.value)} }`;
        case "RestElement":
          return `{ ${getContent(firstMember)} }`;
      }
      return "{}";
    }
    case "ParenthesizedExpression":
      return `(${getContent(node.expression)})`;
    case "PrivateIdentifier":
      return `#${node.name}`;
    case "Program":
      return node.sourceType;
    case "Property":
      return `${getContent(node.key)} = ${getContent(node.value)}`;
    case "PropertyDefinition":
      return `${node.static ? "static " : ""}${getContent(node.key)}${node.value ? ` = ${getContent(node.value)}` : ""}`;
    case "RestElement":
      return `...${getContent(node.argument)}`;
    case "ReturnStatement":
      return `return${node.argument ? ` ${getContent(node.argument)}` : ""}`;
    case "SequenceExpression":
      return node.expressions.map((expr) => getContent(expr)).join(", ");
    case "SpreadElement":
      return `...${getContent(node.argument)}`;
    case "StaticBlock":
      return `static { /* ... */ }`;
    case "Super":
      return `super`;
    case "SwitchCase":
      return `${node.test ? `case ${getContent(node.test)}` : "default"}: /* ... */`;
    case "SwitchStatement":
      return `switch (${getContent(node.discriminant)}) { /* cases */ }`;
    case "TaggedTemplateExpression":
      return `${getContent(node.tag)}\`${getContent(node.quasi)}\``;
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
      return `this`;
    case "ThrowStatement":
      return `throw ${getContent(node.argument)}`;
    case "TryStatement":
      return `try {...}${node.handler ? ` ${getContent(node.handler)}` : ""}${node.finalizer ? ` finally {...}` : ""}`;
    case "UnaryExpression":
      return `${node.prefix ? node.operator : ""}${getContent(node.argument)}${!node.prefix ? node.operator : ""}`;
    case "UpdateExpression":
      return `${node.prefix ? node.operator : ""}${getContent(node.argument)}${!node.prefix ? node.operator : ""}`;
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
          return `${getName(node.id)}${init ? ` = ${getContent(init)}` : ""}`;
      }
    }
    case "WhileStatement":
      return `while (${getContent(node.test)}) {...}`;
    case "WithStatement":
      return `with (${getContent(node.object)}) {...}`;
    case "YieldExpression":
      return `yield${node.delegate ? "*" : ""}${node.argument ? ` ${getContent(node.argument)}` : ""}`;
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
