import { useEffect, useState } from "react";
import Markdown from "../Markdown";
import { HEADING, MUTED } from "../../utils/profileConstants";
import { BackLink, EditorActionButton, Panel, Page } from "./ProfileParts";

function draftKey(userId) {
  return `koncepta:draft:${userId}`;
}

function loadDraft(userId) {
  if (!userId) return null;

  try {
    const raw = localStorage.getItem(draftKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to read local draft:", error);
    return null;
  }
}

function saveDraft(userId, draft) {
  if (!userId) return;

  try {
    localStorage.setItem(draftKey(userId), JSON.stringify(draft));
  } catch (error) {
    console.error("Failed to save local draft:", error);
  }
}

function clearDraft(userId) {
  if (!userId) return;

  try {
    localStorage.removeItem(draftKey(userId));
  } catch (error) {
    console.error("Failed to clear local draft:", error);
  }
}

export function EditorView({
  userId,
  modules = [],
  modulesLoading = false,
  onBack,
  onPublish,
  publishing = false,
  publishError = "",
}) {
  const [title, setTitle] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [body, setBody] = useState("");
  const [restoredNotice, setRestoredNotice] = useState(false);
  const [draftSavedNotice, setDraftSavedNotice] = useState(false);

  // Restore a local draft on mount, once we know who the user is.
  useEffect(() => {
    if (!userId) return;

    const draft = loadDraft(userId);
    if (!draft) return;

    setTitle(draft.title ?? "");
    setModuleId(draft.moduleId ?? "");
    setBody(draft.body ?? "");
    setRestoredNotice(true);
  }, [userId]);

  // Default the module select once modules load in, if nothing's chosen yet.
  useEffect(() => {
    if (!moduleId && modules.length > 0) {
      setModuleId(modules[0].id);
    }
  }, [modules, moduleId]);

  const draft = { title, moduleId, body };

  const handleSaveDraft = () => {
    saveDraft(userId, draft);
    setDraftSavedNotice(true);
    setRestoredNotice(false);
    setTimeout(() => setDraftSavedNotice(false), 2000);
  };

  const handleDiscardDraft = () => {
    clearDraft(userId);
    setTitle("");
    setModuleId(modules[0]?.id ?? "");
    setBody("");
    setRestoredNotice(false);
  };

  const handlePublish = async () => {
    const ok = await onPublish?.(draft);
    if (ok) clearDraft(userId);
  };

  return (
    <Page>
      <BackLink onClick={onBack}>back to my notes</BackLink>

      <h1 className={`${HEADING} mt-6 text-3xl sm:text-4xl`}>create a note</h1>

      {restoredNotice && (
        <div className="mt-4 flex items-center justify-between rounded-[10px] border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)]">
          <span>restored your last unsaved draft</span>
          <button
            type="button"
            onClick={handleDiscardDraft}
            className="cursor-pointer underline hover:text-[var(--color-text)]"
          >
            discard draft
          </button>
        </div>
      )}

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
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          disabled={modulesLoading || modules.length === 0}
          aria-label="Module"
          className="
            h-[48px] rounded-[14px]
            border border-[var(--color-border)]
            bg-transparent px-4 text-sm
            outline-none
            focus:border-[var(--color-text)]
            disabled:opacity-50
          "
        >
          {modulesLoading && <option>loading modules...</option>}

          {!modulesLoading && modules.length === 0 && (
            <option>no modules available</option>
          )}

          {!modulesLoading &&
            modules.map((mod) => (
              <option key={mod.id} value={mod.id}>
                {mod.courseCode
                  ? `${mod.courseCode} · ${mod.title}`
                  : mod.title}
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

      <div className="mt-5 flex items-center justify-end gap-3">
        {draftSavedNotice && <span className={MUTED}>saved locally</span>}

        {publishError && (
          <span className="text-sm text-red-500">{publishError}</span>
        )}

        <EditorActionButton onClick={handleSaveDraft} disabled={publishing}>
          save draft
        </EditorActionButton>

        <EditorActionButton
          variant="primary"
          onClick={handlePublish}
          disabled={publishing}
        >
          {publishing ? "publishing..." : "publish note"}
        </EditorActionButton>
      </div>
    </Page>
  );
}
