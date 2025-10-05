import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <header className="header">
        <div className="container">
          <div className="logo">
            <Link to="#">Travel Planner Pro ✈️</Link>
          </div>
          <nav className="main-nav">
            <ul>
              <li><Link to="/tripmain">หน้าแรก</Link></li>
              <li><Link to="/tripManage">แผนการเดินทางของฉัน</Link></li>
              <li><Link to="#" className="btn-create">สร้างแผนการเดินทาง</Link></li>
              <li><Link to="/login" className="btn-login">เข้าสู่ระบบ</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>วางแผนทริปในฝันร่วมกับเพื่อน ๆ ของคุณ</h1>
            <p>สร้างแผนการเดินทางที่สมบูรณ์แบบและจัดการทุกอย่างได้ในที่เดียว</p>
            <Link to="#" className="btn btn-primary">เริ่มสร้างแผน</Link>
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
              <div className="icon">🗳️</div>
              <h3>โหวตสถานที่</h3>
              <p>ให้ทุกคนมีส่วนร่วมในการตัดสินใจเลือกสถานที่ที่อยากไป</p>
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
