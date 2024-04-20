import { codeToHtml } from "shiki/bundle/web";
import { Accessor, createSignal, onMount } from "solid-js";
import { withDebounce } from "../lib/debounce.mts";

const INITIAL_CONTENT = `const foo = "bar";
const a = 1 > 2 ? 3 : 4;
function hello() {
  const greeting = "world!";
  return \`Hello, \${greeting}!\`;
}

if (true) {
  console.log("hello");
}
`;

interface EditorProps {
  setProgram(value: string): void
  editorOpen: Accessor<boolean>;
}

export function Editor(props: EditorProps) {
  props.setProgram(INITIAL_CONTENT);
  const setProgram = withDebounce(props.setProgram, 1000);
  const [highlighted, setHighlighted] = createSignal("");
  onMount(async () => {
    const html = await codeToHtml(INITIAL_CONTENT, { lang: "js", theme: "dracula-soft" });
    setHighlighted(() => html);
  })
  return (<article classList={{"relative font-mono overflow-hidden": true, "col-span-2 md:col-span-1": props.editorOpen()}}>
    <pre class="w-full h-full absolute l-0 r-0 b-t- t-0"> 
      <code
        data-id="editor"
        class="whitespace-pre-wrap focus:outline-none w-full h-full [&>pre.shiki]:h-full [&>pre.shiki]:w-full [&>pre.shiki]:p-4"
        innerHTML={highlighted()}
      ></code>
    </pre>
    <textarea class="bg-transparent text-transparent absolute w-full h-full l-0 r-0 b-t- t-0 caret-white text-base normal-nums p-4" onInput={async (e) => {
      setProgram(e.target.value);
      const html = await codeToHtml(e.target.value, { lang: "js", theme: "dracula-soft" });
      setHighlighted(() => html);
    }}>{INITIAL_CONTENT}</textarea>
  </article>)
}