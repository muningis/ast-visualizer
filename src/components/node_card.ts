import { AstGroup, astGroupByType } from "../tree/ast.mts";
import { AstNode } from "../tree/types.mts";

const headerColorByAstType: Record<AstGroup, string> = {
  Expression: "bg-blue-300",
  ModuleDeclaration: "",
  Pattern: "",
  Statement: "bg-red-300"
}
const borderColorByAstType: Record<AstGroup, string> = {
  Expression: "border-blue-400",
  ModuleDeclaration: "",
  Pattern: "",
  Statement: "border-red-400"
}

interface NodeCardProps extends AstNode {}
export function NodeCard(p: NodeCardProps) {
  // const meta = props.meta ? Object.entries(props.meta).map(([k,v]) => `<h3>${k}: ${v}</h3>`).join("") : ``;
  // const name = props.name ? `<h3>Name: ${props.name}</h3>` : ``;
  // const value = props.value ? `<h3>Value: ${props.value}</h3>` : ``
  // const operator = props.operator ? `<h3>Operator: ${props.operator}</h3>` : ``
 return `<article class="w-[150px] min-h-[60px] border-2 ${borderColorByAstType[astGroupByType[p.type] as AstGroup]} bg-white text-center">
 <h2 class="p-2 ${headerColorByAstType[astGroupByType[p.type] as AstGroup]} border-b-2 ${borderColorByAstType[astGroupByType[p.type] as AstGroup]}" >${p.type}</h2>
 <div class="p-2">
 <h3>${p.content ?? ""}</h3>
  ${/* ${name}
    ${value}
    ${operator}*/
  ""}
 </div>
</article>` 
}