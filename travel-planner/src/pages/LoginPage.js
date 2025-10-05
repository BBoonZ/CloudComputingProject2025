import React from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("เข้าสู่ระบบ...");
    // TODO: ต่อ Cognito หรือ API login ตรงนี้ได้
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="logo">
          <Link to="/">
            <h1>Travel Planner Pro ✈️</h1>
          </Link>
        </div>
        <h2>เข้าสู่ระบบ</h2>

        <form className="login-form" onSubmit={handleSubmit}>
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
          <div className="forgot-password">
            <Link to="/forgot">ลืมรหัสผ่าน?</Link>
          </div>
          <button type="submit" className="btn btn-primary">
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="divider">หรือเข้าสู่ระบบด้วย</div>

        <div className="social-login">
          <button className="btn btn-social btn-google">
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google icon"
            />
            Google
          </button>
          <button className="btn btn-social btn-facebook">
            <img
              src="https://img.icons8.com/color/16/000000/facebook-new.png"
              alt="Facebook icon"
            />
            Facebook
          </button>
        </div>

        <div className="signup-link">
          ยังไม่มีบัญชีใช่ไหม? <Link to="/signup">สมัครสมาชิก</Link>
        </div>
      </div>
    </main>
  );
}
