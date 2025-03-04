import { useState, useEffect, useRef, useMemo } from "react";
import { parse } from "acorn";
import { flattenData } from "@/features/ast/hierarchy-builder.mts";
import { OrgChart } from "d3-org-chart";
import { NodeCard } from "./node-card.mts";
import { AstNode } from "@/features/ast/types.mts";
import { Button } from "@/components/atoms/button";
import { useAtomValue, useSetAtom } from "@/libs/atom.mjs";
import { editorContentAtom, editorOpenAtom } from "@/features/editor/atom";

export function Graph() {
  const setEditorOpen = useSetAtom(editorOpenAtom);
  const editorContent = useAtomValue(editorContentAtom);
  const [rotation, setRotation] = useState<"left" | "top">("left");
  const rotate = () =>
    setRotation((rotation) => (rotation === "left" ? "top" : "left"));

  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [chart, setChart] = useState<OrgChart<AstNode> | null>(null);

  const nodes = useMemo(() => {
    let ast;
    try {
      ast = parse(editorContent, {
        ecmaVersion: "latest",
        sourceType: "module",
      });
    } catch (ex) {
      ast = parse("", { ecmaVersion: "latest", sourceType: "module" });
    }
    return flattenData(ast);
  }, [editorContent]);

  useEffect(() => {
    if (chart) {
      chart.duration(0);
      chart.data(nodes).expandAll().render();
      chart.duration(400);
    }
  }, [nodes, chart]);

  useEffect(() => {
    if (chart) {
      chart.layout(rotation).render();
    }
  }, [rotation, chart]);

  useEffect(() => {
    if (!nodeRef.current) return;

    const chartInstance = new OrgChart<AstNode>();
    const node = nodeRef.current;

    const updateSVGSize = () => {
      if (!node || !chartInstance) return;
      chartInstance
        .svgHeight(node?.clientHeight ?? window.innerHeight - 100)
        .svgWidth(node?.clientWidth ?? window.innerWidth / 2)
        .render();
    };

    chartInstance
      // container expects string only, but it accepts HTMLElement
      .container(node as any)
      .layout("left")
      .svgHeight(node?.clientHeight ?? window.innerHeight - 100)
      .svgWidth(node?.clientWidth ?? window.innerWidth / 2)
      .setActiveNodeCentered(false)
      .scaleExtent([0.25, 2])
      .compact(false)
      .data(nodes)
      .nodeWidth(() => 150)
      .nodeHeight(() => 66)
      .childrenMargin(() => 80)
      .siblingsMargin(() => 10)
      .neighbourMargin(() => 20)
      .nodeContent((node) => {
        return NodeCard(node.data);
      })
      .expandAll()
      .render();

    setChart(chartInstance);

    const mainElement = document.querySelector('[data-id="main"]');
    if (mainElement) {
      mainElement.addEventListener("transitionend", updateSVGSize);

      return () => {
        mainElement.removeEventListener("transitionend", updateSVGSize);
      };
    }
  }, [nodes]);

  return (
    <article className="relative">
      <div className="w-full h-full absolute cursor-grab" ref={nodeRef} />
      <aside className="absolute top-4 left-4 flex gap-2">
        <Button onClick={() => setEditorOpen((open) => !open)}>
          Toggle Editor
        </Button>
        <Button onClick={chart?.collapseAll}>Collapse All</Button>
        <Button onClick={chart?.expandAll}>Expand All</Button>
        <Button onClick={rotate}>Rotate</Button>
      </aside>
    </article>
  );
}
