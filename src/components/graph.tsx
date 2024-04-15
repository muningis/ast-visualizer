import { parse } from "acorn";
import { D3DragEvent, drag, hierarchy, select, tree } from "d3";
import { createEffect, createSignal } from "solid-js";
import { getHierarchy } from "../tree/hierachy.mts";

interface GraphProps {
  program: string;
}

const margin = { t: 20, b: 20, l: 40, r: 40 };

export function Graph(props: GraphProps) {
  const [translate, setTranslate] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = createSignal(false);
  const [node, setNode] = createSignal<HTMLDivElement | null>(null)

  createEffect(() => {
    node()?.replaceChildren();
    const ty = translate().y;
    const tx = translate().x;
    const dragHandler = drag()
    .on("start", (event) => {
      setDragging(() => true);
    })
    .on("drag", (event: D3DragEvent<any, any, any>) => {
      setTranslate(t => ({ x: t.x + event.dx, y: t.y + event.dy }));
    })
    .on("end", (event) => {
      setDragging(() => false);
    })

    const width = node()?.clientWidth ?? 0 + margin.l + margin.r
    const height = node()?.clientHeight ?? 0 + margin.t + margin.b
    let ast;
    try {
      ast = parse(props.program, { ecmaVersion: "latest", sourceType: "module" })
    } catch (ex) {
      ast = parse("", { ecmaVersion: "latest", sourceType: "module" });
    }
    const nodes = hierarchy(getHierarchy(ast));
    const treemap = tree().size([width, height - 200])
    const treemap_nodes = treemap(nodes as any);

    const svg = select(node()).append("svg")
                .attr("width", width + margin.l + margin.r)
                .attr("height", height + margin.t + margin.b).call(dragHandler as any);;
    const g = svg.append("g").attr("transform",`translate(${margin.l}, ${margin.r})`);

    g.selectAll(".link")
    .data(treemap_nodes.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    // .attr("d", (node) =>`M ${(node.x as any)} , ${(node.y as any)} C ${(node.x as any)} , ${(node.y as any) + (node.parent as any).y  / 2} ${(node.parent as any).x} , ${(node.y as any) + (node.parent as any).y / 2} ${(node.x as any)} , ${(node.parent as any).y}`);
    .attr("d", d => {
        return "M" + (d.x as any + tx) + "," + (d.y as any + ty)
            + "C" + (d.x as any + tx) + "," + ((d.y as any + ty) + (d.parent as any).y + ty) / 2
            + " " + ((d.parent as any).x + tx) + "," + ((d.y as any + ty) + (d.parent as any).y + ty) / 2
            + " " + ((d.parent as any).x + tx) + "," + ((d.parent as any).y + ty);
          })
    .attr("class", "fill-none stroke stroke-black");

  const gnode = g.selectAll(".node")  
    .data(nodes.descendants())
    .enter().append("g")
    .attr("class", node => `node fill-red ${node.children ? "node--internal" : "node--leaf"}`)
    .attr("transform", node => `translate(${node.x! + tx},${node.y! + ty})`);
    gnode.append("circle")
    .attr("r", 10);
    gnode.append("text")
    .attr("dy", ".35em")
    .attr("y", node => node.children ? -20 : 20)
    .style("text-anchor", "middle")
    .text(node => node.data.type);
    gnode.append("text")
    .attr("dy", "1.35em")
    .attr("y", node => node.children ? -20 : 20)
    .style("text-anchor", "middle")
    .text(node => node.data.value!);
  })

  return (<article class="col-span-2 md:col-span-1 overflow-scroll">
    <div classList={{"w-full h-full": true, "cursor-grabbing": dragging(), "cursor-grab": !dragging()}} ref={setNode} />
  </article>);
}
