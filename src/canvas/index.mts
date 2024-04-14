import { D3DragEvent, drag, select } from "d3";
import { Direction, Edge, Node } from "./types.mts"; 
import { edgesAtom, nodesAtom, scaleAtom, translateXAtom, translateYAtom } from "../atoms";
import { setAtomValue, subscribe } from "../utils/atom.mts";

function getAnchorPoint(node: HTMLElement, side: Direction) {
  const x = parseInt(node.style.left, 10);
  const y = parseInt(node.style.top, 10);
  const width = node.offsetWidth;
  const height = node.offsetHeight;

  switch (side) {
    case "top":
      return { x: x + width / 2, y: y };
    case "right":
      return { x: x + width, y: y + height / 2 };
    case "bottom":
      return { x: x + width / 2, y: y + height };
    case "left":
      return { x: x, y: y + height / 2 };
    default:
      return { x: x + width / 2, y: y + height / 2 };
  }
}

subscribe([translateXAtom, translateYAtom, edgesAtom], ([x, y, edges]) => {
  const svgContainer = document.querySelector("g[data-id=\"edge-paths\"]");
  if (svgContainer) {
    svgContainer.replaceChildren(); // Clear existing edges for redraw
  }
  // console.log({edges})
  edges.forEach((edge: Edge) => {
    const fromNode = document.getElementById(edge.fromNode);
    const toNode = document.getElementById(edge.toNode);
    // console.log({fromNode, toNode})

    if (fromNode && toNode && edge.fromSide && edge.toSide) {
      const fromPoint = getAnchorPoint(fromNode, edge.fromSide);
      const toPoint = getAnchorPoint(toNode, edge.toSide);
      // handle translate
      fromPoint.x += x;
      fromPoint.y += y;
      toPoint.x += x;
      toPoint.y += y;

      // const curveTightness = 0;
      // const controlPointX1 =
      //   fromPoint.x + (toPoint.x - fromPoint.x) * curveTightness;
      // const controlPointX2 =
      //   fromPoint.x + (toPoint.x - fromPoint.x) * (1 - curveTightness);
      // const controlPointY1 = fromPoint.y;
      // const controlPointY2 = toPoint.y;

      const d = `M ${fromPoint.x} ${fromPoint.y} ${toPoint.x} ${toPoint.y}`;

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", d);
      path.setAttribute("stroke", edge.color ? edge.color : "black");
      if (edge.toEnd === "arrow") {
        path.setAttribute("marker-end", "url(#arrowhead)");
      }

      svgContainer?.appendChild(path);
    }
  });
});

subscribe([translateXAtom, translateYAtom, scaleAtom, nodesAtom], ([translateX, translateY, scale, nodes]) => {
  document.querySelector("section[data-id=\"canvas-nodes\"]")?.replaceChildren();
  const frag = document.createDocumentFragment();
  // console.log("nodes update", {translateX, translateY, scale, nodes});
  nodes.forEach((node: Node) => {
    const div = document.createElement("div");
    div.id = node.id;
    div.style.transform = `translate(${translateX}px, ${translateY}px)`;
    div.style.left = `${node.position.x * scale + 20}px`;
    div.style.top = `${node.position.y * scale + 20}px`;
    div.style.fontSize = `${scale * 12}px`;
    div.style.lineHeight = `${scale * 16}px`;
    div.className="node absolute overflow-hidden rounded-md border border-red-950 bg-white p-4"
    div.innerHTML=`<h2>${node.data.label}</h2><h3>${node.data.content}</h3>`

    frag.appendChild(div);
  });
  document.querySelector("section[data-id=\"canvas-nodes\"]")?.append(frag);
})


const container = select("section[data-id=\"json-canvas\"]");
const dragHandler = drag()
  .on("start", (event) => {
    select(event.sourceEvent.target).classed("dragging", true);
  })
  .on("drag", (event: D3DragEvent<any, any, any>) => {
    const nodeId = event.sourceEvent.target.id;
    setAtomValue(nodesAtom, (current: Node[]) => {
      return current.map((node) => {
        return node.id === nodeId
          ? {
            ...node,
            position: {
              x: node.position.x + event.dx,
              y: node.position.y + event.dy
            }
          }
          : node
      })
    })
  })
  .on("end", (event) => {
    select(event.sourceEvent.target).classed("dragging", false);
  });
container.selectAll(".node").call(dragHandler as any);