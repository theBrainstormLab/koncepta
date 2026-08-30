const DEFAULT_GRID_CLASSES =
  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-[100px] gap-10 box-border [&>*]:max-w-[400px] max-md:px-5 max-md:py-[50px] max-md:gap-6 max-[480px]:grid-cols-1 max-[480px]:px-[10px] max-[480px]:py-[30px] max-[480px]:gap-4";

// Callers passing className own the layout entirely -- no merging, so
// an overriding column count can't conflict with these defaults.
export default function CardGrid({ children, className }) {
  return <div className={className ?? DEFAULT_GRID_CLASSES}>{children}</div>;
}
