import { useState } from "react";
import Markdown from "../Markdown";
import { HEADING, MUTED } from "../../utils/profileConstants";
import { BackLink, EditorActionButton, Panel, Page } from "./ProfileParts";

// Temporary mock module list.
// Replace with DB/module data later.
const modules = [
  { code: "CS203" },
  { code: "CS202" },
  { code: "CS201" },
  { code: "CSC3CJ201" },
];

export function EditorView({ onBack, onSaveDraft, onPublish }) {
  const [title, setTitle] = useState("");
  const [moduleCode, setModuleCode] = useState(modules[0]?.code ?? "");
  const [body, setBody] = useState("");

  const draft = {
    title,
    module: moduleCode,
    body,
  };

  return (
    <Page>
      <BackLink onClick={onBack}>back to my notes</BackLink>

      <h1 className={`${HEADING} mt-6 text-3xl sm:text-4xl`}>create a note</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="note title..."
          aria-label="Note title"
          className="
            h-[48px] rounded-[14px]
            border border-[var(--color-border)]
            bg-transparent px-4 text-sm
            outline-none
            placeholder:text-[var(--color-text-secondary)]
            focus:border-[var(--color-text)]
          "
        />

        <select
          value={moduleCode}
          onChange={(e) => setModuleCode(e.target.value)}
          aria-label="Module"
          className="
            h-[48px] rounded-[14px]
            border border-[var(--color-border)]
            bg-transparent px-4 text-sm
            outline-none
            focus:border-[var(--color-text)]
          "
        >
          {modules.map((module) => (
            <option key={module.code} value={module.code}>
              {module.code}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid items-start gap-4 xl:grid-cols-2">
        <Panel label="markdown">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="write your note in markdown..."
            aria-label="Note content (markdown)"
            className="
              h-[600px] w-full resize-none
              rounded-[14px]
              border border-[var(--color-border)]
              bg-transparent
              px-4 py-3
              font-mono text-sm
              outline-none
              placeholder:text-[var(--color-text-secondary)]
              focus:border-[var(--color-text)]
            "
          />
        </Panel>

        <Panel label="preview">
          <div
            className="
              h-[600px]
              overflow-y-auto
              rounded-[14px]
              border border-[var(--color-border)]
              bg-[var(--color-bg-secondary)]/20
              p-4
            "
          >
            {body ? (
              <Markdown>{body}</Markdown>
            ) : (
              <p className={MUTED}>preview appears here...</p>
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <EditorActionButton onClick={() => onSaveDraft?.(draft)}>
          save draft
        </EditorActionButton>

        <EditorActionButton
          variant="primary"
          onClick={() => onPublish?.(draft)}
        >
          publish note
        </EditorActionButton>
      </div>
    </Page>
  );
}
