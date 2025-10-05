import React from "react";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("สมัครสมาชิก...");
    // TODO: ต่อ Cognito หรือ API signup ตรงนี้
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="logo">
          <Link to="/">
            <h1>Travel Planner Pro ✈️</h1>
          </Link>
        </div>
        <h2>สมัครสมาชิก</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">ชื่อผู้ใช้งาน</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="ชื่อผู้ใช้งาน"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ชื่ออีเมลของคุณ"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="รหัสผ่าน"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            สร้างบัญชี
          </button>
        </form>

        <div className="signup-link">
          มีบัญชีอยู่แล้วใช่ไหม? <Link to="/login">เข้าสู่ระบบ</Link>
        </div>
      </div>
    </main>
  );
}
