import { parse } from "acorn";
import { Accessor, Setter, createEffect, createMemo, createSignal, onMount } from "solid-js";
import { flattenData } from "../../features/ast/hierarchy-builder.mts";
import { OrgChart } from "d3-org-chart";
import { NodeCard } from "./node_card.mts";
import { AstNode } from "../../features/ast/types.mts";
import { Button } from "../atoms/button";


interface GraphProps {
  program: string;
  editorOpen: Accessor<boolean>;
  toggleEditor: Setter<boolean>;
  rotate(): void;
  rotation: Accessor<"left" | "top">;
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
    chart()?.duration(0);
    chart()?.data(nodes()).expandAll().render();
    chart()?.duration(400);
  });

  createEffect(() => {
    chart()?.layout(props.rotation()).render();
  });

  onMount(() => {
    const chart = new OrgChart<AstNode>();
    const n = node();

    const updateSVGSize = () => {
      const n = node();
      if (!chart) return;
      chart!
        .svgHeight(n?.clientHeight ?? window.innerHeight - 100)
        .svgWidth(n?.clientWidth ?? window.innerWidth / 2)
        .render();
    };

    chart.container(n as any as string) // Typings says only string is accepted, but it can also accept HTMLElement :/ 
      .layout("left")
      .svgHeight(n?.clientHeight ?? window.innerHeight - 100)
      .svgWidth(n?.clientWidth ?? window.innerWidth / 2)
      .setActiveNodeCentered(false)
      .scaleExtent([.25, 2])
      .compact(false)
      .data(nodes())
      .nodeWidth(() => 150)
      .nodeHeight(() => 66)
      .childrenMargin(() => 80)
      .siblingsMargin(() => 10)
      .neighbourMargin(() => 20)
      // .compactMarginBetween(() => 40)
      .nodeContent((node) => {
        return NodeCard(node.data)
      })
      .expandAll()
      .render();

    setChart(() => chart);

    document.querySelector("[data-id=\"main\"]")?.addEventListener("transitionend", () => {
      updateSVGSize();
    });
  });

  return (<article classList={{ "relative": true }}>
    <div classList={{ "w-full h-full absolute": true, "cursor-grabbing": false, "cursor-grab": true }} ref={setNode} />
    <aside class="absolute top-4 left-4 flex gap-2">
      <Button onclick={() => {
        props.toggleEditor(o => !o);
      }} label="Toggle Editor" />
      <Button onclick={() => {
        chart()?.collapseAll()
      }} label="Collapse All" />
      <Button onclick={() => {
        chart()?.expandAll()
      }} label="Expand All" />
      <Button onclick={() => {
        props.rotate();
      }} label="Rotate" />
    </aside>
  </article>);
}
