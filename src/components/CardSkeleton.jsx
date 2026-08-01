export default function CardSkeleton() {
  return (
    <div className="border border-[var(--color-border)] rounded-[20px] p-[30px] box-border w-full flex flex-col max-md:p-5 max-[480px]:p-[15px]">
      <div className="h-[14px] w-3/4 rounded bg-[var(--color-bg-secondary)] animate-pulse mb-3" />
      <div className="h-[14px] w-1/2 rounded bg-[var(--color-bg-secondary)] animate-pulse mb-4" />
      <div className="h-[12px] w-2/3 rounded bg-[var(--color-bg-secondary)] animate-pulse" />
    </div>
  );
}
