import "./style.css"
import { debounce } from "./utils/debounce.mjs";
import { parse } from "acorn";
import { setAtomValue } from "./utils/atom.mts";
import { programAtom } from "./atoms";

const onChange = debounce(function onChange(e: Event) {
  updateNodesAndEdges((e.target as HTMLElement).innerText);
}, 200);

const updateNodesAndEdges = (program: string) => {
  try {
    const ast = parse(program, { ecmaVersion: "latest", sourceType: "module" });
    setAtomValue(programAtom, ast);
    console.log({ ast })
    // renderTree(ast);

  } catch (err) { console.warn(err) }
}


document.querySelector<HTMLDivElement>("code[data-id=\"editor\"]")?.addEventListener("input", onChange)
updateNodesAndEdges(document.querySelector<HTMLDivElement>("code[data-id=\"editor\"]")?.innerText ?? "");