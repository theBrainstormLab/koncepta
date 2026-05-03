import Cat from "../assets/cat.svg?react";

export default function Footer() {
  return (
    <div className="flex flex-col justify-center items-center text-[var(--color-text-footer)] mt-auto relative gap-[10px] md:flex-row md:gap-0">
      <Cat className="h-12 sm:h-16 md:h-24 absolute md:left-1/5 left-1/8" />
      <div className="relative text-center z-[1]">
        <a
          href="https://github.com/theBrainstormLab"
          target="_blank"
          className="![font-family:Poppins-Bold] text-[10px] sm:text-xs md:text-sm"
        >
          © brainstormLab 2026
        </a>
        <h6 className="[font-family:Poppins-Regular] text-[10px] m-0 sm:text-xs md:text-sm">
          Notes, concepts, ready for everyone.
        </h6>
      </div>
    </div>
  );
}
