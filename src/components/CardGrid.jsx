const GRID_CLASSES =
  "grid + grid-cols-4 [&>*]:max-w-[400px] p-[100px] gap-10 box-border max-md:px-5 max-md:py-[50px] max-md:gap-6 max-[480px]:grid-cols-1 max-[480px]:px-[10px] max-[480px]:py-[30px] max-[480px]:gap-4";

export default function CardGrid({ children }) {
  return <div className={GRID_CLASSES}>{children}</div>;
}
