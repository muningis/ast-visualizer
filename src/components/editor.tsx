import { codeToHtml } from "shiki/bundle/web";
import { Accessor, createSignal, onMount } from "solid-js";
import { createDebounce } from "../lib/debounce.mts";

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
  setProgram(_value: string): void
  editorOpen: Accessor<boolean>;
}

export function Editor(props: EditorProps) {
  onMount(() => {
    props.setProgram(INITIAL_CONTENT);
  })
  const setProgram = createDebounce((value: string) => props.setProgram(value), 1000);
  const [highlighted, setHighlighted] = createSignal("");
  onMount(async () => {
    const html = await codeToHtml(INITIAL_CONTENT, { lang: "js", theme: "dracula-soft" });
    setHighlighted(() => html);
  })
  return (<article class="relative font-mono overflow-hidden">
    <pre class="w-full h-full absolute l-0 r-0 b-t- t-0"> 
      <code
        data-id="editor"
        class="whitespace-pre-wrap focus:outline-none w-full h-full [&>pre.shiki]:h-full [&>pre.shiki]:w-full [&>pre.shiki]:p-4"
        // eslint-disable-next-line solid/no-innerhtml
        innerHTML={highlighted()}
       />
    </pre>
    <textarea class="bg-transparent text-transparent absolute w-full h-full l-0 r-0 b-t- t-0 caret-white text-base normal-nums p-4 pl-14 resize-none" onInput={async (e) => {
      setProgram(e.target.value);
      const html = await codeToHtml(e.target.value, { lang: "js", theme: "dracula-soft" });
      setHighlighted(() => html);
    }}>{INITIAL_CONTENT}</textarea>
  </article>)
}