import type { Program, AnyNode, VariableDeclarator } from "acorn"
import { match_node } from "../utils/match.mts";

type HierarchyAstNode = { name: string; children?: Array<HierarchyAstNode> };

export function getHierarchy(program: Program) {
  const visitNode = (node: AnyNode | VariableDeclarator): HierarchyAstNode => {
    return match_node<HierarchyAstNode>({
      FunctionDeclaration(node){
        return {
          name: node.type,
          children: node.body.body.map(node => visitNode(node))
        }
      },
      ReturnStatement(node){
        return {
          name: node.type,
          children: [{ name: node.argument?.type!, children: node.argument? [visitNode(node.argument)] : [] }]
        }
      },
      VariableDeclaration(node){
        return {
          name: node.type,
          children: node.declarations.map(node => visitNode(node))
        }
      },
      VariableDeclarator(node){
        return {
          name: node.type,
          // children: node.body.body.map(node => visitNode(node))
        }
      },
      Literal(node){
        return {
          name: node.type,
          // children: node.body.body.map(node => visitNode(node))
        }
      },
      BlockStatement(node) {
        return {
          name: node.type,
          children: node.body.map(node => visitNode(node))
        }
      },
      TemplateLiteral(node) {
        // const data = {
        //   label: node.type,
        //   content: node.type
        // };
        // [...node.quasis,...node.expressions].sort((a,b) => a.start - b.start).forEach((node, i) => visitNode(node, parent, level + 1, i));
        // return data
        return {
          name: node.type,
          children: [...node.quasis,...node.expressions].sort((a,b) => a.start - b.start).map(node => visitNode(node))
        }
      },
      TemplateElement(node) {
        return {
          name: node.type,
          // children: node.body.map(node => visitNode(node))
        }
      },
      Identifier(node) {
        return {
          name: node.type,
          // children: node.body.map(node => visitNode(node))
        }
      },
      ExportNamedDeclaration(node) {
        console.log({node});
        return {
          name: node.type,
          children: [visitNode(node.declaration!)]
        }
      },
      ObjectExpression(node) {
        return {
          name: node.type,
          children: node.properties.map(property => visitNode(property))
        }
      },
      Property(node) {
        return {
          name: node.type
        }
      }
    }, node);
  }


  return {
    name: program.type,
    children: program.body.map(node => visitNode(node))
  }
}