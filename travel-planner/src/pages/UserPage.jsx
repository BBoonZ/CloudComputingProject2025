import React from "react";
import { Link } from "react-router-dom";
import userStyles from "../css/user.module.css";
import navStyles from "../css/main-nav.module.css";

export default function SettingPage() {
    return (
        <div>
            {/* Header */}
            <header className={navStyles.header}>
                <div className={navStyles.container}>
                    <div className={navStyles.logo}>
                        <Link to="/tripmain">Travel Planner Pro ✈️</Link>
                    </div>
                    <nav className={navStyles.mainNav}>
                        <ul>
                            <li><Link to="/tripmain">หน้าหลัก</Link></li>
                            <li><Link to="/tripmanage">แผนการเดินทางของฉัน</Link></li>
                            <img
                                src="https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png"
                                alt="User Profile"
                                className={navStyles.profilePic}
                                onClick={() => (window.location.href = "user.html")}
                            />
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className={userStyles.settingsContainer}>
                <h1>การตั้งค่าผู้ใช้</h1>
                <div className={userStyles.profile}>
                    <img
                        src="https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png"
                        alt="User Profile"
                    />
                </div>

                <div className={userStyles.layout}>
                    {/* ข้อมูลส่วนตัว */}
                    <section className={userStyles.settingsSection}>
                        <h2><i className="fas fa-user"></i> ข้อมูลส่วนตัว</h2>
                        <form>
                            <label>ชื่อผู้ใช้</label>
                            <input type="text" defaultValue="BBoonZ" />

                            <label>ชื่อ</label>
                            <input type="text" defaultValue="Boriboon" />

                            <label>นามสกุล</label>
                            <input type="text" defaultValue="Chamnanphol" />

                            <label>Email</label>
                            <input type="email" defaultValue="example@email.com" />

                            <label>เบอร์โทรศัพท์</label>
                            <input type="tel" defaultValue="080-123-4567" />

                            <div className={userStyles.linked}>
                                <button type="button" className={`${userStyles.facebook} ${userStyles.connected}`}>
                                    <i className="fas fa-check"></i> Facebook
                                </button>
                                <button type="button" className={userStyles.google}>
                                    Google
                                </button>
                            </div>

                            <button type="submit" className={userStyles.btnSave}>บันทึก</button>
                        </form>
                    </section>

                    {/* เปลี่ยนรหัสผ่าน + ออกจากระบบ */}
                    <div className={userStyles.layout2}>
                        <section className={userStyles.settingsSection}>
                            <h2><i className="fas fa-lock"></i> เปลี่ยนรหัสผ่าน</h2>
                            <form>
                                <label>รหัสผ่านปัจจุบัน</label>
                                <input type="password" />

                                <label>รหัสผ่านใหม่</label>
                                <input type="password" />

                                <label>ยืนยันรหัสผ่านใหม่</label>
                                <input type="password" />

                                <button type="submit" className={userStyles.btnSave}>เปลี่ยนรหัสผ่าน</button>
                            </form>
                        </section>

                        <section className={userStyles.settingsSection}>
                            <h2><i className="fas fa-cog"></i> ออกจากระบบ</h2>
                            <form>
                                <button type="submit" className={userStyles.btnLogout}>ออกจากระบบ</button>
                            </form>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
