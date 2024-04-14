import { parse } from "acorn";
import { D3DragEvent, drag, hierarchy, select, tree } from "d3";
import { createEffect, createMemo, createSignal } from "solid-js";
import { getHierarchy } from "../tree/hierachy.mts";

interface GraphProps {
  program: string;
}

const margin = { t: 20, b: 20, l: 40, r: 40 };

export function Graph(props: GraphProps) {
  const [translate, setTranslate] = createSignal<{ x: number; y: number }>({ x: 10, y: 10 });
  const [node, setNode] = createSignal<HTMLDivElement | null>(null)
  createEffect(() => console.log(props.program))
  const nodes = createMemo(() => {
    let ast;
    try {
      ast = parse(props.program, { ecmaVersion: "latest", sourceType: "module" })
    } catch (ex) {
      ast = parse("", { ecmaVersion: "latest", sourceType: "module" });
    }
    return hierarchy(getHierarchy(ast));
  })

  const width = createMemo(() => node()?.clientWidth ?? 0 + margin.l + margin.r);
  const height = createMemo(() => node()?.clientHeight ?? 0 + margin.t + margin.b);
  createEffect(() => {
    console.log(treemap_nodes().descendants().slice(1))
  })

  const treemap = createMemo(() => tree().size([width(), height()]));
  const treemap_nodes = createMemo(() => treemap()(nodes() as any));
  const ty = translate().y;
  const tx = translate().x;

  const dragHandler = drag()
    .on("start", (event) => {
      select(event.sourceEvent.target).classed("dragging", true);
    })
    .on("drag", (event: D3DragEvent<any, any, any>) => {
      setTranslate(t => ({ x: t.x + event.dx, y: t.y + event.dy }));
    })
    .on("end", (event) => {
      select(event.sourceEvent.target).classed("dragging", false);
    });

  return (<article ref={setNode} class="col-span-2 md:col-span-1 overflow-scroll">
    <svg class="w-full h-full">
      <g transform={`translate(${margin.l}, ${margin.t})`}>
        {treemap_nodes().descendants().slice(1).map(d => {
          return <path class="link" d={"M" + (d.x as any + tx) + "," + (d.y as any + ty)
            + "C" + (d.x as any + tx) + "," + ((d.y as any + ty) + (d.parent as any).y + ty) / 2
            + " " + ((d.parent as any).x + tx) + "," + ((d.y as any + ty) + (d.parent as any).y + ty) / 2
            + " " + ((d.parent as any).x + tx) + "," + ((d.parent as any).y + ty)}></path>
        })}
        {nodes().descendants().map(d => {
          return <g
            classList={{
              "node fill-red": true,
              "node--internal": Boolean(d.children),
              "node--leaf": !Boolean(d.children)
            }}
            transform={`translate(${d.x! + tx},${d.y! + ty})`}
            ref={d => select(d).call(dragHandler as any)}
          >
            <circle r="10" />
            <text dy=".35em" y={d.children ? -20 : 20} style={{"text-anchor": 'middle'}}>{d.data.name}</text>
          </g>
        })}
      </g>
    </svg>
  </article>);
}
