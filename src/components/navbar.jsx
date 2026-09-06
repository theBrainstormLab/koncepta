import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="relative">
      {/* Desktop nav -> hidden on mobile, flex from sm up */}
      <div className="hidden sm:flex justify-center items-center gap-6 py-6 text-center md:gap-12 md:py-10">
        <Link
          to="/"
          className="text-base md:text-lg md:w-[120px] md:tracking-widest"
        >
          home
        </Link>
        <Link
          to="/about"
          className="text-base md:text-lg md:w-[120px] md:tracking-widest"
        >
          about
        </Link>
        <button
          type="button"
          aria-label="Toggle dark mode"
          aria-pressed={dark}
          className="bg-[var(--color-bg-secondary)] w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer"
          onClick={() => setDark(!dark)}
        >
          <span
            className={`inline-flex transition-transform duration-300 motion-reduce:transition-none ${
              dark ? "rotate-0" : "rotate-180"
            }`}
          >
            <Icon
              icon={dark ? "ri:moon-line" : "ri:sun-line"}
              width="22"
              height="22"
            />
          </span>
        </button>
        <Link
          to="/"
          className="text-base md:text-lg md:w-[120px] md:tracking-widest"
        >
          notes
        </Link>
        <Link
          to="/profile"
          className="text-base md:text-lg md:w-[120px] md:tracking-widest"
        >
          profile
        </Link>
      </div>

      {/* Mobile toggle -> visible on mobile, hidden from sm up */}
      <button
        type="button"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        className="sm:hidden absolute top-4 right-5 z-[1001] flex justify-center items-center bg-[var(--color-bg-secondary)] rounded-[10px] w-9 h-9 mx-auto"
        onClick={toggleMenu}
      >
        <Icon
          icon={isMenuOpen ? "ri:close-line" : "ri:menu-line"}
          width="22"
          height="22"
        />
      </button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-[1000]">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-screen w-64 p-4 pt-20 flex flex-col bg-[var(--color-bg)]/95 backdrop-blur-xl border-l border-black/5 dark:border-white/10 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-right">
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-1 text-sm capitalize font-medium">
              {[
                { path: "/", label: "home" },
                { path: "/about", label: "about" },
                { path: "/notes", label: "notes" },
                { path: "/profile", label: "profile" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                    location.pathname === item.path
                      ? "bg-[var(--color-bg-secondary)] border border-black/5 dark:border-white/20 font-semibold"
                      : "opacity-80 hover:opacity-100 hover:bg-[var(--color-bg-secondary)]"
                  }`}
                >
                  <span>{item.label}</span>
                  <Icon
                    icon="ri:arrow-right-s-line"
                    width="16"
                    height="16"
                    className={
                      location.pathname === item.path
                        ? "opacity-100"
                        : "opacity-30"
                    }
                  />
                </Link>
              ))}
            </nav>

            {/* Theme Button 30px from the bottom */}
            <div className="absolute bottom-20 left-4 right-4">
              <button
                type="button"
                aria-label="Toggle dark mode"
                aria-pressed={dark}
                onClick={() => setDark(!dark)}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer hover:bg-[var(--color-bg-secondary)] transition-all text-sm capitalize font-medium"
              >
                <span className="flex items-center gap-2.5">
                  <Icon
                    icon={dark ? "ri:moon-line" : "ri:sun-line"}
                    width="18"
                    height="18"
                    className={`transition-transform duration-300 ${dark ? "" : "rotate-180"}`}
                  />
                  theme
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 px-1.5 py-0.5 rounded-md bg-[var(--color-bg)]">
                  {dark ? "dark" : "light"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
