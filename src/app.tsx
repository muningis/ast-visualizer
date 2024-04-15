import { render } from "solid-js/web";
import { Editor } from "./components/editor";
import { Graph } from "./components/graph";
import { createEffect, createSignal } from "solid-js";
import "./style.css"

function App() {
  const [program, setProgram] = createSignal("");
  createEffect(() => {
    console.log(program());
  })
  return (
    <div class="flex flex-col w-screen h-screen ">
      <main class="grid grid-cols-2 flex-1 max-h-[calc(100%-2rem)]">
        <Graph program={program()} />
        <Editor setProgram={setProgram} />
      </main>
      <footer class="h-8 bg-slate-300 p-1">
        Built with: 
        <a class="underline" target="_blank" referrerpolicy="origin" href="https://www.solidjs.com/">Solid</a>, 
        <a class="underline" target="_blank" referrerpolicy="origin" href="https://github.com/acornjs/acorn">Acorn</a>, 
        <a class="underline" target="_blank" referrerpolicy="origin" href="https://tailwindcss.com/">Tailwind</a>, 
        <a class="underline" target="_blank" referrerpolicy="origin" href="https://vitejs.dev/">Vite</a>, 
        <a class="underline" target="_blank" referrerpolicy="origin" href="https://bun.sh/">Bun</a>, 
        <a class="underline" target="_blank" referrerpolicy="origin" href="https://shiki.style/">Shiki</a> and 
        <a class="underline" target="_blank" referrerpolicy="origin" href="">others</a>
      </footer>
    </div>
  );
}

render(() => <App />, document.querySelector("div[data-id='app']")!);