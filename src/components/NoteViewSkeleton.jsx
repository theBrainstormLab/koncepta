export default function NoteViewSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Title */}
      <div className="h-8 w-3/4 rounded bg-[var(--color-bg-secondary)] mb-1" />

      {/* Separator line */}
      <div className="h-px bg-[var(--color-text)] opacity-10 mt-1" />

      {/* Content lines */}
      <div className="mt-5 space-y-3">
        <div className="h-3 w-full rounded bg-[var(--color-bg-secondary)]" />
        <div className="h-3 w-11/12 rounded bg-[var(--color-bg-secondary)]" />
        <div className="h-3 w-4/5 rounded bg-[var(--color-bg-secondary)]" />
        <div className="h-3 w-full rounded bg-[var(--color-bg-secondary)]" />
        <div className="h-3 w-2/3 rounded bg-[var(--color-bg-secondary)]" />
      </div>

      {/* meta */}
      <div className="flex justify-between mt-20">
        {/* Left: author + date */}
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-[var(--color-bg-secondary)]" />
          <div className="h-3 w-20 rounded bg-[var(--color-bg-secondary)]" />
        </div>
        {/* Right: course code + degree */}
        <div className="space-y-2 text-right">
          <div className="h-3 w-20 ml-auto rounded bg-[var(--color-bg-secondary)]" />
          <div className="h-3 w-28 ml-auto rounded bg-[var(--color-bg-secondary)]" />
        </div>
      </div>
    </div>
  );
}
