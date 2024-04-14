import { Program } from "acorn";
import { tree, hierarchy, select } from "d3";
import { getHierarchy } from "./hierachy.mts";
import { dragHandler } from "./drag_handler.mts";
import { getAtomValue, subscribe } from "../utils/atom.mts";
import { programAtom, translateAtom } from "../atoms";

subscribe([programAtom], ([program]:[Program]) => {
  const { x, y } = getAtomValue(translateAtom);
  const treeDomNode = document.querySelector("article[data-id=\"tree\"]")!;
  treeDomNode.replaceChildren();
  const width = treeDomNode.clientWidth;
  const height = treeDomNode.clientHeight;
  const margin = { t: 20, b: 20, l: 40, r: 40 };
  const treemap = tree().size([width, height]);
  console.log({program})
  const nodes = hierarchy(getHierarchy(program));
  const treemap_nodes = treemap(nodes);

  const svg = select(treeDomNode).append("svg")
                .attr("width", width + margin.l + margin.r)
                .attr("height", height + margin.t + margin.b);
  const g = svg.append("g").attr("transform",`translate(${margin.l}, ${margin.r})`);

  g.selectAll(".link")
    .data(treemap_nodes.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    // .attr("d", (node) =>`M ${(node.x as any)} , ${(node.y as any)} C ${(node.x as any)} , ${(node.y as any) + (node.parent as any).y  / 2} ${(node.parent as any).x} , ${(node.y as any) + (node.parent as any).y / 2} ${(node.x as any)} , ${(node.parent as any).y}`);
    .attr("d", d => {
        return "M" + (d.x as any + x) + "," + (d.y as any + y)
            + "C" + (d.x as any + x) + "," + ((d.y as any + y) + (d.parent as any).y + y) / 2
            + " " + ((d.parent as any).x + x) + "," + ((d.y as any + y) + (d.parent as any).y + y) / 2
            + " " + ((d.parent as any).x + x) + "," + ((d.parent as any).y + y);
          })
    .attr("class", "fill-none stroke stroke-black");

  const node = g.selectAll(".node")  
    .data(nodes.descendants())
    .enter().append("g")
    .attr("class", node => `node fill-red ${node.children ? "node--internal" : "node--leaf"}`)
    .attr("transform", node => `translate(${node.x! + x},${node.y! + y})`)
    .call(dragHandler as any);
  node.append("circle")
    .attr("r", 10);
  node.append("text")
    .attr("dy", ".35em")
    .attr("y", node => node.children ? -20 : 20)
    .style("text-anchor", "middle")
    .text(node => node.data.name);
});