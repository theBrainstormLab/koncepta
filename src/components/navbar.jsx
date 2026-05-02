import { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const [dark, setDark] = useState(false);
  toggleTheme(dark, setDark);

  return (
    <div className="relative">
      {/* Desktop nav -> hidden on mobile, flex from sm up */}
      <div className="hidden sm:flex justify-center items-center gap-6 py-6 text-center md:gap-12 md:py-10">
        <a
          href="/"
          className="text-base md:text-lg md:w-[120px] md:tracking-widest"
        >
          home
        </a>
        <a
          href="/"
          className="text-base md:text-lg md:w-[120px] md:tracking-widest"
        >
          about
        </a>
        <div
          className="bg-[#39393d] w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer"
          onClick={() => setDark(!dark)}
        >
          <Icon
            icon={dark ? "ri:moon-line" : "ri:sun-line"}
            width="22"
            height="22"
            className={`cursor-pointer transition-transform duration-300 ${
              dark ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
        <a
          href="/"
          className="text-base md:text-lg md:w-[120px] md:tracking-widest"
        >
          notes
        </a>
        <a
          href="/"
          className="text-base md:text-lg md:w-[120px] md:tracking-widest"
        >
          profile
        </a>
      </div>

      {/* Mobile toggle -> visible on mobile, hidden from sm up */}
      <button
        className="sm:hidden absolute top-5 right-5 z-[1001] bg-transparent border-none text-[#fafaf8] cursor-pointer p-2"
        onClick={toggleMenu}
      >
        <Icon
          icon={isMenuOpen ? "ri:close-line" : "ri:menu-line"}
          width="24"
          height="24"
        />
      </button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden flex flex-col fixed top-0 left-0 right-0 bg-[#2b2b2e] pt-20 z-[1000] min-h-screen">
          <a
            href="/"
            className="block text-center px-4 py-5 text-[#fafaf8] no-underline border-b border-[#39393d] text-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            home
          </a>
          <a
            href="/"
            className="block text-center px-4 py-5 text-[#fafaf8] no-underline border-b border-[#39393d] text-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            about
          </a>
          <div
            className="flex justify-center items-center bg-[#39393d] rounded-[10px] w-9 h-9 mx-auto my-4"
            onClick={() => setDark(!dark)}
          >
            <Icon
              icon={dark ? "ri:moon-line" : "ri:sun-line"}
              width="22"
              height="22"
              className={`transition-transform duration-300 ${
                dark ? "rotate-0" : "rotate-180"
              }`}
            />
          </div>
          <a
            href="/"
            className="block text-center px-4 py-5 text-[#fafaf8] no-underline border-b border-[#39393d] text-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            notes
          </a>
          <a
            href="/"
            className="block text-center px-4 py-5 text-[#fafaf8] no-underline border-b border-[#39393d] text-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            profile
          </a>
        </div>
      )}
    </div>
  );
}

function toggleTheme(dark, setDark) {
  useEffect(() => {
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDark(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
}
