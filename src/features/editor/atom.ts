import { createAtom } from "@/libs/atom.mjs";

const editorOpenAtom = createAtom(true);
const editorContentAtom = createAtom(`const bar = "bar";
const five = 5;
const no = false;
const arr = [bar, "bar", 1, false];
const arr2 = [...arr];
const obj = { foo: "bar" };
const obj2 = { ...obj };
const a = 1 > 2 ? 3 : 4;

function hello({ foo, ...rest }, ...args) {
  const greeting = "world!";
  return \`Hello, \${greeting}!\`;
}

if (true) {
  console.log(hello({ foo: bar, five, ...obj2 }, ...arr2));
}
`);

export { editorOpenAtom, editorContentAtom };
