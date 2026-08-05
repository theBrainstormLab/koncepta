import ForOFor from "../assets/404.svg?react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-[100svh] sm:h-[94.5svh] mt-0  md:mt-10 md:h-[calc(100svh-235.5px)]">
      <h1 className="font-[DynaPuff] font-bold text-4xl sm:text-5xl md:text-6xl my-6 sm:my-8 md:my-10 [text-shadow:0_4px_8px_rgba(79,175,175,0.25)]">
        404
      </h1>

      <div className="w-[85%] sm:w-[70%] md:w-auto flex justify-center">
        <ForOFor />
      </div>
    </div>
  );
}
