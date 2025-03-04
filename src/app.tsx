import "./style.css";
import { Editor } from "./components/organisms/editor";
import { Graph } from "./components/organisms/graph";
import { Link } from "./components/atoms/link";
import { useAtomValue } from "./libs/atom.mts";
import { editorOpenAtom } from "./features/editor/atom";

function App() {
  const editorOpen = useAtomValue(editorOpenAtom);
  return (
    <div className="flex flex-col w-screen h-screen">
      <main
        data-id="main"
        className={`
          grid flex-1 max-h-[calc(100%-2rem)] transition-all
          ${!editorOpen ? "grid-cols-(--editor-collapsed)" : "grid-cols-(--editor-open)"}
        `}
      >
        <Editor />
        <Graph />
      </main>
      <footer className="h-10 bg-slate-300 py-2 px-4 flex space-x-2">
        <span>Built with:</span>
        <Link href="https://reactjs.org/" label="React" />
        <Link href="https://d3js.org" label="d3" />
        <Link href="https://github.com/acornjs/acorn" label="Acorn" />
        <Link href="https://tailwindcss.com/" label="Tailwind" />
        <Link href="https://vitejs.dev/" label="Vite" />
        <Link href="https://bun.sh/" label="Bun" />
        <Link href="https://shiki.style/" label="Shiki" />
        <span> | </span>
        <span>commit hash: {import.meta.env["__COMMIT_HASH__"]}</span>
      </footer>
    </div>
  );
}

export { App };
