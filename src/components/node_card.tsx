import { AstNode } from "../tree/types.mts";

interface NodeCardProps extends AstNode {}
export function NodeCard(props: NodeCardProps) {
 return `<article class="w-[150px] h-[60px] p-2 border-2 border-blue-400 bg-white">
 ${props.meta ? Object.entries(props.meta).map(([k,v]) => `<h3>${k}: ${v}</h3>`).join("") : ``}
 <h2>${props.type}</h2>
 ${props.name ? `<h3>Name: ${props.name}</h3>` : ``}
 ${props.value ? `<h3>Value: ${props.value}</h3>` : ``}
 ${props.operator ? `<h3>Operator: ${props.operator}</h3>` : ``}
</article>` 
}