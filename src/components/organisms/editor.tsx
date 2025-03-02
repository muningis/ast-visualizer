import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { codeToHtml } from "shiki/bundle/web";
import { useAtom, useResetAtom } from "@/libs/atom.mjs";
import { editorContentAtom } from "@/features/editor/atom";

export function Editor() {
  const [editorContent, setEditorContent] = useAtom(editorContentAtom);
  const resetEditorContent = useResetAtom(editorContentAtom);
  const [highlighted, setHighlighted] = useState("");

  useEffect(() => {
    resetEditorContent();

    const initHighlight = async () => {
      const html = await codeToHtml(editorContent, {
        lang: "js",
        theme: "dracula-soft",
      });
      setHighlighted(html);
    };

    initHighlight();
  }, []);

  const handleInput = useCallback(
    async (e: ChangeEvent<HTMLTextAreaElement>) => {
      setEditorContent(e.target.value);
      const html = await codeToHtml(e.target.value, {
        lang: "js",
        theme: "dracula-soft",
      });
      setHighlighted(html);
    },
    [setEditorContent],
  );

  return (
    <article className="relative font-mono overflow-hidden">
      <pre className="w-full h-full absolute l-0 r-0 b-t- t-0">
        <code
          data-id="editor"
          className="whitespace-pre-wrap focus:outline-none w-full h-full [&>pre.shiki]:h-full [&>pre.shiki]:w-full [&>pre.shiki]:p-4"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
      <textarea
        className="bg-transparent text-transparent absolute w-full h-full l-0 r-0 b-t- t-0 caret-white text-base normal-nums p-4 pl-14 resize-none"
        onInput={handleInput}
        defaultValue={editorContent}
      />
    </article>
  );
}
