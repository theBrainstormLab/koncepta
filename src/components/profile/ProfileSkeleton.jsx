import { Page } from "./ProfileParts";
import CardSkeleton from "../CardSkeleton";

export default function ProfileSkeleton() {
  return (
    <Page>
      <div className="flex items-center gap-5 sm:gap-6">
        <div className="h-[96px] w-[96px] shrink-0 animate-pulse rounded-full bg-[var(--color-bg-secondary)] sm:h-[104px] sm:w-[104px]" />
        <div className="min-w-0 space-y-3">
          <div className="h-8 w-48 animate-pulse rounded bg-[var(--color-bg-secondary)]" />
          <div className="h-4 w-64 animate-pulse rounded bg-[var(--color-bg-secondary)]" />
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--color-bg-secondary)]" />
        </div>
      </div>

      <div className="mt-7">
        <div className="h-6 w-32 animate-pulse rounded bg-[var(--color-bg-secondary)]" />
        <div className="grid grid-cols-1 gap-6 px-5 pt-[50px] pb-[120px] md:grid-cols-3 md:px-[100px] md:pb-[180px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </Page>
  );
}
