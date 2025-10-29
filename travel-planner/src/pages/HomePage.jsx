import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import nav from "../css/home-nav.module.css";

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={nav.header}>
        <div className={nav.container}>
          <div className={nav.logo}>
            <Link to="/">Travel Planner Pro ✈️</Link>
          </div>

          {/* Burger Button */}
          <button className={nav.menuToggle} onClick={toggleMenu}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Dropdown Menu */}
          <nav className={`${nav.mainNav} ${menuOpen ? nav.active : ""}`}>
            <ul>
              <li><Link to="/tripmain" onClick={closeMenu}>หน้าแรก</Link></li>
              <li><Link to="/tripmanage" onClick={closeMenu}>แผนของฉัน</Link></li>
              <li><Link to="/tripmain" className={nav.btnCreate} onClick={closeMenu}>สร้างแผน</Link></li>
              <li><Link to="/login" className={nav.btnLogin} onClick={closeMenu}>เข้าสู่ระบบ</Link></li>
            </ul>
          </nav>
        </div>

        {/* Overlay */}
        <div className={`${nav.overlay} ${menuOpen ? nav.active : ""}`} onClick={closeMenu}></div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>วางแผนทริปในฝันร่วมกับเพื่อน ๆ ของคุณ</h1>
            <p>สร้างแผนการเดินทางที่สมบูรณ์แบบและจัดการทุกอย่างได้ในที่เดียว</p>
            <Link to="/tripmain" className={`${nav.btn} ${nav.btnPrimary}`}>เริ่มสร้างแผน</Link>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <div className="feature-item">
              <div className="icon">💻</div>
              <h3>วางแผนร่วมกันแบบเรียลไทม์</h3>
              <p>ทุกคนในกลุ่มสามารถแก้ไขและดูการเปลี่ยนแปลงได้พร้อมกัน</p>
            </div>
            <div className="feature-item">
              <div className="icon">🗺️</div>
              <h3>เลือกสถานที่จากผู้ใช้อื่น</h3>
              <p>ดูและเลือกไอเดียสถานที่จากผู้ใช้อื่น ๆ ในกลุ่ม เพื่อช่วยในการวางแผน</p>
            </div>
            <div className="feature-item">
              <div className="icon">💰</div>
              <h3>จัดการงบประมาณ</h3>
              <p>ติดตามค่าใช้จ่ายและแบ่งปันกันอย่างโปร่งใส</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Travel Planner Pro. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
