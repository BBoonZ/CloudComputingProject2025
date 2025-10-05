import React from "react";
import { Link } from "react-router-dom";

function ForgotPage() {
    return (
        <>
            <main className="forgot-page">
                <div className="forgot-card">
                    <div className="forgot-h">
                        <h2>ลืมรหัสผ่านใช่ไหม?</h2>
                        <p className="desc">กรอกอีเมลที่คุณใช้สมัครบัญชี จากนั้นเราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้คุณ</p>
                    </div>


                    <form className="forgot-form">
                        <div className="form-group">
                            <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="อีเมล"
                            required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">ส่งลิงก์รีเซ็ตรหัสผ่าน</button>
                    </form>

                    <div className="signup-link">
                        มีบัญชีอยู่แล้วใช่ไหม? <Link to="/login">เข้าสู่ระบบ</Link>
                    </div>
                </div>
            </main>
        </>
    );
}

export default ForgotPage;
