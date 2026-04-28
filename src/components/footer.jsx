export default function Footer() {
  return (
    <div className="flex flex-col justify-center items-center text-[#b0b0b0] mt-auto relative py-5 gap-[10px] md:flex-row md:gap-0">
      <img
        src="./cat.svg"
        alt="cat"
        className="h-12 sm:h-16 md:h-24 md:absolute md:left-1/4"
      />
      <div className="relative text-center z-[1]">
        <a
          href="https://github.com/theBrainstormLab"
          target="_blank"
          className="![font-family:Poppins-Bold] text-[10px] text-[#b0b0b0] sm:text-xs md:text-sm"
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
