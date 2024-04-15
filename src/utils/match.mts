import { AnyNode, VariableDeclarator } from "acorn";

type TrulyAnyNode = AnyNode | VariableDeclarator;
type NodeMatches<TReturn extends {}> = Partial<{
  [key in TrulyAnyNode["type"]]: (node: Extract<TrulyAnyNode, { type: key }>) => TReturn;
}>;

export function match_node<TReturn extends {}>(
  matches: NodeMatches<TReturn>,
  item: TrulyAnyNode,
) {
  const found_match = Object.entries(matches).find((match) => item.type === match[0]);
  if (!found_match) throw new Error(`Not found, ${JSON.stringify(item)}`);
  return found_match[1](item as never);
}