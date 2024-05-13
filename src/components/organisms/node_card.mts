import { AstGroup, astGroupByType } from "../../features/ast/ast.mts";
import { AstNode } from "../../features/ast/types.mts";

const headerColorByAstType: Record<AstGroup, string> = {
  Expression: "bg-blue-300",
  ModuleDeclaration: "bg-green-300",
  Pattern: "bg-yellow-300",
  Statement: "bg-red-300",
}
const borderColorByAstType: Record<AstGroup, string> = {
  Expression: "border-blue-400",
  ModuleDeclaration: "border-green-400",
  Pattern: "border-yellow-400",
  Statement: "border-red-400"
}

interface NodeCardProps extends AstNode { }
export function NodeCard(p: NodeCardProps) {
  return `<article class="w-[150px] min-h-[60px] border-2 ${borderColorByAstType[astGroupByType[p.type] as AstGroup]} bg-white text-center">
 <h2 class="p-2 ${headerColorByAstType[astGroupByType[p.type] as AstGroup]} border-b-2 ${borderColorByAstType[astGroupByType[p.type] as AstGroup]}" >${p.type}</h2>
 <div class="">
 <h3 class="overflow-hidden text-nowrap hover:overflow-visible hover:w-fit text-center transition-all bg-white p-2">${p.content ?? ""}</h3>
 </div>
</article>`
}