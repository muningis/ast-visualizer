import { AnyNode, VariableDeclarator } from "acorn";

type TrulyAnyNode = AnyNode | VariableDeclarator;
type NodeMatches<TReturn extends {}> = Partial<{
  [key in TrulyAnyNode["type"]]: (node: Extract<TrulyAnyNode, { type: key }>) => TReturn;
}>;

export function match_node<TReturn extends {}>(
  matches: NodeMatches<TReturn>,
  item: TrulyAnyNode,
  def: TReturn
) {
  const found_match = Object.entries(matches).find((match) => item.type === match[0]);
  if (!found_match) return def;
  return found_match[1](item as never);
}