import { parse } from "acorn";
import { createEffect, createMemo, createSignal } from "solid-js";
import { flattenData } from "../tree/hierachy.mts";
import { OrgChart } from "d3-org-chart";
import { NodeCard } from "./node_card";
import { AstNode } from "../tree/types.mts";

interface GraphProps {
  program: string;
}

export function Graph(props: GraphProps) {
  const [node, setNode] = createSignal<HTMLDivElement | null>(null);
  const [chart, setChart] = createSignal<OrgChart<AstNode> | null>(null);

  const nodes = createMemo(() => {
    let ast;
    try {
      ast = parse(props.program, { ecmaVersion: "latest", sourceType: "module" })
    } catch (ex) {
      ast = parse("", { ecmaVersion: "latest", sourceType: "module" });
    }
    console.log(ast);
    return flattenData(ast);
  });

  createEffect(() => {
    const chart = new OrgChart<AstNode>();

    if (node()) {
      chart.container(node() as any as string) // Typings says only string is accepted, but it can also accept HTMLElement :/ 
        .svgHeight(node()?.clientHeight ?? window.innerHeight - 100)
        .scaleExtent([.25, 2])
        .data(nodes())
        .nodeWidth(() => 150)
        .nodeHeight(() => 60)
        .compactMarginBetween(() => 40)
        // .linkUpdate(function (this: BaseType, node) {
        //   return select(this)
        //     .attr("class", node.data.type === "FunctionDeclaration" ? "stroke-red-400 stroke-2" : "stroke-blue-400 stroke-2")
        // })
        .nodeContent((node) => {
          return NodeCard(node.data)
        })
        .expandAll()
        // .duration(0)
        .render();
    }

    setChart(() => chart);
  })

  return (<article class="col-span-2 md:col-span-1 relative">
    <aside class="absolute top-4 left-4 flex gap-2">
      <button onclick={() => {
        chart()?.collapseAll()
      }}>Collapse All</button>
      <button onclick={() => {
        chart()?.expandAll();
      }}>Expand All</button>
    </aside>
    <div classList={{"w-full h-full": true, "cursor-grabbing": false, "cursor-grab": true}} ref={setNode} />
  </article>);
}
