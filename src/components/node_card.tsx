import { AstNode } from "../tree/types.mts";

interface NodeCardProps extends AstNode {}
export function NodeCard(props: NodeCardProps) {
 return `<article class="w-[150px] h-[60px] p-2 border-2 border-red-800 bg-white">
 <h2>${props.type}</h2>
 ${props.name ? `<h3>Name: ${props.name}</h3>` : ``}
 ${props.value ? `<h3>Value: ${props.value}</h3>` : ``}
</article>` 
}