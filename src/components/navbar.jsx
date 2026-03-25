import { useState } from "react";
import { Icon } from "@iconify-icon/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="nav-wrapper">
      <div className="nav">
        <a href="/" className="nav-item">
          home
        </a>
        <a href="/" className="nav-item">
          about
        </a>
        <div className="nav-icon">
          <Icon icon="ri:sun-line" width="22" height="22" />
        </div>
        <a href="/" className="nav-item">
          notes
        </a>
        <a href="/" className="nav-item">
          profile
        </a>
      </div>
      
      {/* Mobile menu button */}
      <button className="nav-toggle" onClick={toggleMenu}>
        <Icon icon={isMenuOpen ? "ri:close-line" : "ri:menu-line"} width="24" height="24" />
      </button>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="nav-mobile">
          <a href="/" className="nav-mobile-item" onClick={() => setIsMenuOpen(false)}>
            home
          </a>
          <a href="/" className="nav-mobile-item" onClick={() => setIsMenuOpen(false)}>
            about
          </a>
          <div className="nav-mobile-icon">
            <Icon icon="ri:sun-line" width="22" height="22" />
          </div>
          <a href="/" className="nav-mobile-item" onClick={() => setIsMenuOpen(false)}>
            notes
          </a>
          <a href="/" className="nav-mobile-item" onClick={() => setIsMenuOpen(false)}>
            profile
          </a>
        </div>
      )}
    </div>
  );
}