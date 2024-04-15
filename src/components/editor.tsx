const INITIAL_CONTENT = `const foo = "bar";`;

interface EditorProps {
  setProgram(setter: () => string): void
}

export function Editor(props: EditorProps) {
  props.setProgram(() => INITIAL_CONTENT);
  return (<article class="col-span-2 md:col-span-1 p-4">
    <code
      data-id="editor"
      contenteditable={true}
      class="whitespace-pre-wrap focus:outline-none"
      oninput={(e) => {
        props.setProgram(() => e.target.textContent!)
      }}>
        {INITIAL_CONTENT}
    </code>
  </article>)
}