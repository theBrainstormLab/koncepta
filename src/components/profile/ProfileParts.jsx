import { useState } from "react";
import { Icon } from "@iconify-icon/react";

export function Page({ children }) {
  return (
    <main className="min-h-[calc(100svh-180px)] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">{children}</div>
    </main>
  );
}

export function Panel({ label, children }) {
  return (
    <div className="rounded-[14px] p-4">
      <div className="mb-3 text-xs text-[var(--color-text-secondary)]">
        {label}
      </div>
      {children}
    </div>
  );
}

export function IconButton({ icon, width = 16, label, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="cursor-pointer"
      {...props}
    >
      <Icon icon={icon} width={width} />
    </button>
  );
}

export function BackLink({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-secondary)]"
    >
      <Icon icon="ri:arrow-left-line" width="16" />
      {children}
    </button>
  );
}

export function Avatar({ username }) {
  return (
    <div
      className="
        flex h-[96px] w-[96px] shrink-0 items-center justify-center
        rounded-full bg-[var(--color-bg-secondary)] text-2xl text-[var(--color-text)]
        sm:h-[104px] sm:w-[104px] sm:text-[30px]
      "
    >
      {username?.[0]?.toUpperCase()}
    </div>
  );
}

function EditableUsername({
  username,
  onUsernameChange,
  usernameError,
  savingUsername,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(username);

  const startEditing = () => {
    setDraft(username);
    setEditing(true);
  };

  const cancel = () => {
    setDraft(username);
    setEditing(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!onUsernameChange || draft.trim() === username) {
      setEditing(false);
      return;
    }

    const ok = await onUsernameChange(draft);
    if (ok) setEditing(false);
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <h1 className="font-[Poppins-Bold] text-3xl font-bold leading-none">
          {username}
        </h1>
        {onUsernameChange && (
          <IconButton
            icon="ri:edit-line"
            width={15}
            label="Change username"
            onClick={startEditing}
            className="cursor-pointer text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)]"
          />
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={savingUsername}
          className="
            h-9 w-[200px] rounded-[8px] border border-[var(--color-border)]
            bg-transparent px-3 font-[Poppins-Bold] text-lg outline-none
            transition focus:border-[var(--color-text)]
          "
        />

        <IconButton
          icon="ri:check-line"
          width={18}
          label="Save username"
          onClick={submit}
          className="cursor-pointer text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)]"
        />

        <IconButton
          icon="ri:close-line"
          width={18}
          label="Cancel"
          onClick={cancel}
          className="cursor-pointer text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)]"
        />
      </div>

      {usernameError && <p className="text-xs text-red-500">{usernameError}</p>}
    </form>
  );
}

export function ProfileHeader({
  username,
  notesCount,
  editable,
  email = "shaaanuu@example.com",
  onCreateNote,
  onLogout,
  onUsernameChange,
  usernameError,
  savingUsername,
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex min-w-0 items-center gap-5 sm:gap-6">
        <Avatar username={username} />

        <div className="min-w-0">
          {editable ? (
            <EditableUsername
              username={username}
              onUsernameChange={onUsernameChange}
              usernameError={usernameError}
              savingUsername={savingUsername}
            />
          ) : (
            <h1 className="font-[Poppins-Bold] text-3xl font-bold leading-none">
              {username}
            </h1>
          )}

          {editable ? (
            <>
              <p className="mt-2 truncate text-sm text-[var(--color-text-secondary)]">
                {email}
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {notesCount} notes published
              </p>

              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onCreateNote}
                  className="
                    group inline-flex cursor-pointer items-center gap-2
                    rounded-[10px] border border-[var(--color-border)]
                    px-4 py-2 text-sm
                    transition-all duration-200
                    hover:-translate-y-[1px]
                    hover:bg-[var(--color-text)]
                    hover:text-[var(--color-bg)]
                    hover:shadow-[var(--shadow-box-hover)]
                  "
                >
                  <span className="text-base leading-none transition-transform duration-200 group-hover:rotate-90">
                    +
                  </span>
                  create note
                </button>
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {notesCount} notes published
            </p>
          )}
        </div>
      </div>

      {editable && (
        <button
          type="button"
          onClick={onLogout}
          className="
            group inline-flex shrink-0 cursor-pointer
            items-center gap-2
            rounded-[9px]
            border border-[var(--color-border)]
            px-3 py-2
            text-xs text-[var(--color-text-secondary)]
            transition-all duration-200
            hover:-translate-y-[1px]
            hover:border-red-500
            hover:text-red-500
            hover:shadow-[var(--shadow-box-hover)]
          "
        >
          <Icon
            icon="ri:logout-box-r-line"
            width="15"
            className="
              transition-transform duration-200
              group-hover:translate-x-[2px]
            "
          />
          log out
        </button>
      )}
    </div>
  );
}

export function NoteCard({ note, editable, onOpen, onEdit, onDelete }) {
  const noop = () => {};

  return (
    <article
      className="
        flex flex-col rounded-[14px] border border-[var(--color-border)] p-5
        transition duration-200 hover:-translate-y-[2px] hover:shadow-[var(--shadow-box-hover)]
      "
    >
      <h3 className="font-[Poppins-Bold] text-[15px]">{note.moduleTitle}</h3>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        {note.code}
      </p>

      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
          <Icon icon="ri:book-2-line" width="14" />
          <span>{note.course}</span>
        </div>

        <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
          {editable ? (
            <>
              <IconButton
                icon="ri:edit-line"
                label={`Edit ${note.moduleTitle}`}
                onClick={onEdit ?? noop}
              />
              <IconButton
                icon="ri:delete-bin-line"
                label={`Delete ${note.moduleTitle}`}
                onClick={onDelete ?? noop}
              />
            </>
          ) : (
            <IconButton
              icon="ri:arrow-right-up-line"
              label={`Open ${note.title}`}
              onClick={onOpen ?? noop}
            />
          )}
        </div>
      </div>
    </article>
  );
}

export function NotesGrid({ notes, editable, onEditNote, onDeleteNote }) {
  return (
    <div
      className="
        mt-5 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10
        max-md:gap-6 max-[480px]:grid-cols-1 max-[480px]:gap-4 [&>*]:max-w-[400px]
      "
    >
      {notes.map((note) => (
        <NoteCard
          key={note.id ?? note.code}
          note={note}
          editable={editable}
          onEdit={() => onEditNote?.(note)}
          onDelete={() => onDeleteNote?.(note)}
        />
      ))}
    </div>
  );
}

export function EditorActionButton({
  variant = "secondary",
  children,
  ...props
}) {
  const border =
    variant === "primary"
      ? "border-[var(--color-text)]"
      : "border-[var(--color-border)]";

  return (
    <button
      type="button"
      className={`cursor-pointer rounded-[10px] border ${border} px-4 py-2 text-sm transition hover:-translate-y-[2px] hover:shadow-[var(--shadow-box-hover)]`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AuthField({
  icon,
  wrapperClassName = "relative mt-4",
  ...props
}) {
  return (
    <div className={wrapperClassName}>
      <Icon
        icon={icon}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[var(--color-text-secondary)]"
      />
      <input
        aria-label={props.placeholder}
        className="
          h-[56px] w-full rounded-[14px] border border-[var(--color-border)] bg-transparent
          pl-12 pr-4 text-sm outline-none transition
          placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-text)]
        "
        {...props}
      />
    </div>
  );
}
