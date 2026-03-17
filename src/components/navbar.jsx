import { Icon } from "@iconify-icon/react";

export default function Navbar() {
  return <div className="nav">
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
}