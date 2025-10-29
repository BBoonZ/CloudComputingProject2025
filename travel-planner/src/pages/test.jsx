import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/test.css"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header-simple">
      <div className="container-simple">
        <div className="logo-simple">
          <Link to="/">Travel Planner Pro ✈️</Link>
        </div>

        {/* Burger */}
        <button className="burger-simple" onClick={toggleMenu}>
          ☰
        </button>

        <nav className={`nav-simple ${menuOpen ? "open" : ""}`}>
          <ul>
            <li><Link to="/tripmain" onClick={closeMenu}>หน้าแรก</Link></li>
            <li><Link to="/tripmanage" onClick={closeMenu}>แผนของฉัน</Link></li>
            <li><Link to="/tripmain" onClick={closeMenu}>สร้างแผน</Link></li>
            <li><Link to="/login" onClick={closeMenu}>เข้าสู่ระบบ</Link></li>
          </ul>
        </nav>
      </div>
      <div className="container-simple">
        <nav className={`nav-simple ${menuOpen ? "open" : ""}`}>
          <ul>
            <li><Link to="/tripmain" onClick={closeMenu}>หน้าแรก</Link></li>
            <li><Link to="/tripmanage" onClick={closeMenu}>แผนของฉัน</Link></li>
            <li><Link to="/tripmain" onClick={closeMenu}>สร้างแผน</Link></li>
            <li><Link to="/login" onClick={closeMenu}>เข้าสู่ระบบ</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
