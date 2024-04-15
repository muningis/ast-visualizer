export interface HierarchyAstNode {
  /** Defines type of a node */
  type: string;
  /** Defines name of a statement */
  name?: string;
  /** Defines value of a statement */
  value?: string;
  children?: Array<HierarchyAstNode>
};