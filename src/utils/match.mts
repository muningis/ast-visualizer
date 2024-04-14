// type Match<Type, U> = 

// export function match<
//   Item extends { type: string },
//   ComparisonKey extends keyof Item,
//   ReturnType extends {}
// >(
//   matches: Array<[Item[ComparisonKey], (item: Extract<Item, { type: ComparisonKey }>) => ReturnType]>,
//   item: Item
// ): ReturnType {
//   const found_match = matches.find((match) => item.type === match[0]);
//   if (!found_match) throw new Error("Not found");
//   return found_match[1](item as Extract<Item, { type: ComparisonKey }>);
// }

import { AnyNode, VariableDeclarator } from "acorn";
// import { type Node } from "../canvas/types.mjs";

// type NodeType = Node["/type"];

type TrulyAnyNode = AnyNode | VariableDeclarator;
type NodeMatches<TReturn extends {}> = Partial<{
  [key in TrulyAnyNode["type"]]: (node: Extract<TrulyAnyNode, { type: key }>) => TReturn;
}>;

export function match_node<TReturn extends {}>(
  matches: NodeMatches<TReturn>,
  item: TrulyAnyNode,
) {
  console.log({item})
  const found_match = Object.entries(matches).find((match) => item.type === match[0]);
  if (!found_match) throw new Error(`Not found, ${JSON.stringify(item)}`);
  return found_match[1](item as never);
}