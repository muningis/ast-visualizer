import { AnyNode, VariableDeclarator } from "acorn";

export interface AstNode {
  id: string;
  parentId: string;
  type: (AnyNode | VariableDeclarator)["type"];
  content: string;
}
