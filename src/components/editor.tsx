import { codeToHtml } from "shiki/bundle/web";
import { createSignal, onMount } from "solid-js";

const INITIAL_CONTENT = `const foo = "bar";
function hello() {
  const greeting = "world!";
  return \`Hello, \${greeting}!\`;
}
`;

interface EditorProps {
  setProgram(setter: () => string): void
}

export function Editor(props: EditorProps) {
  props.setProgram(() => INITIAL_CONTENT);
  const [highlighted, setHighlighted] = createSignal("");
  onMount(async () => {
    const html = await codeToHtml(INITIAL_CONTENT, { lang: "js", theme: "dracula-soft" });
    setHighlighted(() => html);
  })
  return (<article class="col-span-2 md:col-span-1 relative font-mono">
    <pre class="w-full h-full absolute l-0 r-0 b-t- t-0"> 
      <code
        data-id="editor"
        // contenteditable={true}
        class="whitespace-pre-wrap focus:outline-none w-full h-full [&>pre.shiki]:h-full [&>pre.shiki]:w-full [&>pre.shiki]:p-4"
        innerHTML={highlighted()}
      ></code>
    </pre>
    <textarea class="bg-transparent text-transparent absolute w-full h-full l-0 r-0 b-t- t-0 caret-white text-base normal-nums p-4" onInput={async (e) => {
      props.setProgram(() => e.target.value);
      const html = await codeToHtml(e.target.value, { lang: "js", theme: "dracula-soft" });
      setHighlighted(() => html);
    }}>{INITIAL_CONTENT}</textarea>
  </article>)
}