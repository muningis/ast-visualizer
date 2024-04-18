export interface HierarchyAstNode {
  /** Defines type of a node */
  type: string;
  /** Defines name of a statement */
  // name?: string;
  /** Defines value of a statement */
  // value?: string;
  /** Meta information */
  // meta?: Record<string, string | number | boolean>
  children?: Array<HierarchyAstNode>
};