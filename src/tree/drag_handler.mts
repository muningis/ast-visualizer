import { D3DragEvent, drag, select } from "d3";
import { setAtomValue } from "../utils/atom.mts";
import { translateAtom } from "../atoms";

export const dragHandler = drag()
  .on("start", (event) => {
    select(event.sourceEvent.target).classed("dragging", true);
  })
  .on("drag", (event: D3DragEvent<any, any, any>) => {
    setAtomValue(translateAtom, t => ({ x: t.x + event.dx, y: t.y + event.dy }));
  })
  .on("end", (event) => {
    select(event.sourceEvent.target).classed("dragging", false);
  });