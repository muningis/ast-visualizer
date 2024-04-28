import { render } from "solid-js/web";
import { Editor } from "./components/editor";
import { Graph } from "./components/graph";
import { createSignal } from "solid-js";
import "./style.css"
import { Link } from "./components/atoms/link";

function App() {
  const [program, setProgram] = createSignal("");
  const [editorOpen, setEditorOpen] = createSignal(true);
  return (
    <div class="flex flex-col w-screen h-screen">
      <main data-id="main" classList={{
        "grid flex-1 max-h-[calc(100%-2rem)] transition-all": true,
        "grid-cols-editor-collapsed": !editorOpen(),
        "grid-cols-editor-open": editorOpen()
      }}>
        <Editor setProgram={setProgram} editorOpen={editorOpen} />
        <Graph program={program()} editorOpen={editorOpen} toggleEditor={setEditorOpen} />
      </main>
      <footer class="h-10 bg-slate-300 py-2 px-4">
        Built with: 
        <Link href="https://www.solidjs.com/" label="Solid" />, 
        <Link href="https://d3js.org" label="d3" />, 
        <Link href="https://github.com/acornjs/acorn" label="Acorn" />, 
        <Link href="https://tailwindcss.com/" label="Tailwind" />, 
        <Link href="https://vitejs.dev/" label="Vite" />, 
        <Link href="https://bun.sh/" label="Bun" />, 
        <Link href="https://shiki.style/" label="Shiki" />
        <span> | </span>
        <span>commit hash: {import.meta.env['__COMMIT_HASH__']}</span>
      </footer>
    </div>
  );
}

render(() => <App />, document.querySelector("div[data-id='app']")!);