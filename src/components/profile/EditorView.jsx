import { useState } from "react";
import Markdown from "../Markdown";
import { HEADING, MUTED } from "../../utils/profileConstants";
import { BackLink, EditorActionButton, Panel, Page } from "./ProfileParts";
import {
  draftKey,
  clearDraft,
  resolveInitialDraft,
} from "./editorDraft";

function saveDraft(userId, draft) {
  if (!userId) return;

  try {
    localStorage.setItem(draftKey(userId), JSON.stringify(draft));
  } catch (error) {
    console.error("Failed to save local draft:", error);
  }
}

export function EditorView({
  userId,
  noteId = null,
  initialCourseId = "",
  initialModuleTitle = "",
  initialBody = "",
  courses = [],
  modulesLoading = false,
  onBack,
  onPublish,
  publishing = false,
  publishError = "",
}) {
  const isEditing = Boolean(noteId);

  // Restore a local draft synchronously at first render -- only when
  // creating a fresh note, never when editing an existing one.
  const [restoredDraft] = useState(() => resolveInitialDraft(userId, isEditing));

  const [courseId, setCourseId] = useState(
    restoredDraft?.courseId ?? initialCourseId,
  );
  const [moduleTitle, setModuleTitle] = useState(
    restoredDraft?.moduleTitle ?? initialModuleTitle,
  );
  const [body, setBody] = useState(restoredDraft?.body ?? initialBody);
  const [restoredNotice, setRestoredNotice] = useState(
    Boolean(restoredDraft),
  );
  const [draftSavedNotice, setDraftSavedNotice] = useState(false);

  // Fall back to the first course until the user picks one.
  const activeCourseId = courseId || courses[0]?.id || "";

  const draft = { noteId, courseId: activeCourseId, moduleTitle, body };

  const handleSaveDraft = () => {
    saveDraft(userId, draft);
    setDraftSavedNotice(true);
    setRestoredNotice(false);
    setTimeout(() => setDraftSavedNotice(false), 2000);
  };

  const handleDiscardDraft = () => {
    clearDraft(userId);
    setCourseId("");
    setModuleTitle("");
    setBody("");
    setRestoredNotice(false);
  };

  const handlePublish = async () => {
    const ok = await onPublish?.(draft);
    if (ok && !isEditing) clearDraft(userId);
  };

  return (
    <Page>
      <BackLink onClick={onBack}>back to my notes</BackLink>

      <h1 className={`${HEADING} mt-6 text-3xl sm:text-4xl`}>
        {isEditing ? "edit note" : "create a note"}
      </h1>

      {restoredNotice && !isEditing && (
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

        <select
          value={activeCourseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            setModuleTitle("");
          }}
          disabled={modulesLoading || courses.length === 0}
          aria-label="Paper"
          className="
            h-[48px] rounded-[14px]
            border border-[var(--color-border)]
            bg-transparent px-4 text-sm
            outline-none
            focus:border-[var(--color-text)]
            disabled:opacity-50
          "
        >
          {modulesLoading && (
            <option disabled value="">
              loading papers...
            </option>
          )}

          {!modulesLoading && courses.length === 0 && (
            <option>no papers available</option>
          )}

          {!modulesLoading &&
            courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} · {course.title}
              </option>
            ))}
        </select>

        <div>
          <input
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
            disabled={modulesLoading || !activeCourseId}
            placeholder="Name of Module."
            aria-label="Topic"
            className="
              h-[48px] w-full rounded-[14px]
              border border-[var(--color-border)]
              bg-transparent px-4 text-sm
              outline-none
              placeholder:text-[var(--color-text-secondary)]
              focus:border-[var(--color-text)]
              disabled:opacity-50
            "
          />
        </div>
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

        {!isEditing && (
          <EditorActionButton onClick={handleSaveDraft} disabled={publishing}>
            save draft
          </EditorActionButton>
        )}

        <EditorActionButton
          variant="primary"
          onClick={handlePublish}
          disabled={publishing}
        >
          {publishing
            ? isEditing
              ? "saving..."
              : "publishing..."
            : isEditing
              ? "save changes"
              : "publish note"}
        </EditorActionButton>
      </div>
    </Page>
  );
}
