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
    <main class="grid grid-cols-2 w-screen h-screen">
      <Graph program={program()} />
      <Editor setProgram={setProgram} />
    </main>
  );
}

render(() => <App />, document.querySelector("div[data-id='app']")!);