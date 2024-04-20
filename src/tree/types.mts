import { AnyNode, VariableDeclarator } from "acorn";

export interface AstNode {
  id: string;
  parentId: string;
  /** Defines type of a node */
  type: (AnyNode | VariableDeclarator)["type"];
  /** Defines name of a statement */
  name?: string;
  /** Defines value of a statement */
  value?: string;
  /** Meta information */
  // meta?: Record<string, string | number | boolean>
};