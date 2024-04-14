const INITIAL_CONTENT = `export function atom(initialValue) {
  let value = initialValue;
  const subscribers = new Set();
  const read = () => {
    return value;
  };
  const write = (newValueOrFn) => {
    value = newValueOrFn instanceof Function ? newValueOrFn(value) : newValueOrFn;
    subscribers.forEach(subscriber => {
      subscriber()
  });
  }
  const subscribe = (subscriber) => {
    subscribers.add(subscriber);
    return () => subscribers.delete(subscriber);
  }

  return { read, write, subscribe };
}

const myAtom = atom(\`2 + 2 is \${2 + 2}\`);
// console.log(myAtom.read() + 2);
`;

interface EditorProps {
  setProgram(setter: () => string): void
}

export function Editor(props: EditorProps) {
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