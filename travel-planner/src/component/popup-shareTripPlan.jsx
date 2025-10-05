import React, { useState } from "react";
import styles from "../css/popup-shareTripPlan.module.css"; // นำ CSS มาใช้ในรูปแบบ Module

export default function EditTripModal({ isOpen, onClose }) {
    const [inviteOpen, setInviteOpen] = useState(false);
    const [shareOption, setShareOption] = useState("private");

    const handleInviteChange = (e) => {
        setInviteOpen(e.target.value.length > 0);
    };

    const handleShareOptionChange = (e) => {
        setShareOption(e.target.value);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* overlay เบลอพื้นหลัง */}
            <div className={styles.overlayBlur} onClick={onClose}></div>
            <div className={styles.modal} style={{ display: "flex", backdropFilter: "blur(3px)" }}>
                <div className={styles.modalContent}>
                    <div className={styles.modalMain}>
                        <div style={{ display: "flex", gap: "10px" }}>
                            {inviteOpen && (
                                <span
                                    style={{ fontSize: "1.2rem", cursor: "pointer" }}
                                    onClick={() => setInviteOpen(false)}
                                >
                                    &larr;
                                </span>
                            )}
                            <h2>แชร์ทริปท่องเที่ยว</h2>
                        </div>
                    </div>

                    <form>
                        <label>เพิ่มเพื่อนๆ และผู้ใช้งาน</label>
                        <div className={styles.inputInvite}>
                            <input
                                type="text"
                                placeholder="เพิ่มเพื่อนๆ และผู้ใช้งาน"
                                onChange={handleInviteChange}
                                style={{
                                    width: inviteOpen ? "70%" : "100%",
                                    transition: "width .5s ease",
                                    padding: "10px",
                                }}
                            />
                            {inviteOpen && (
                                <select>
                                    <option value="reader">ผู้มีสิทธิ์อ่าน</option>
                                    <option value="editor">เอดิเตอร์</option>
                                </select>
                            )}
                        </div>

                        {!inviteOpen && (
                            <div>
                                <label>บุคคลที่มีสิทธิ์เข้าถึง</label>
                                <div className={styles.preProfile}>
                                    <div className={styles.profile}>
                                        <div className={styles.pic}>
                                            <img
                                                src="https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png"
                                                alt="profile"
                                            />
                                        </div>
                                        <div className={styles.user}>
                                            <div className={styles.username}>boss</div>
                                            <div className={styles.email}>boossswewe@gmail.com</div>
                                        </div>
                                        <div className={styles.privilege}>Owner</div>
                                    </div>
                                </div>

                                <label>การเข้าถึงทั่วไป</label>
                                <div className={styles.share}>
                                    <div className={styles.sharePic}>
                                        <img
                                            src={
                                                shareOption === "public"
                                                    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQho-wuA1ELDvUgdgXUT7DzgL6EqW79ZyG2QExII9_0dwsf7YYP-PDV8AvrKZ2tU8mcbno&usqp=CAU"
                                                    : "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png"
                                            }
                                            alt="share"
                                        />
                                    </div>
                                    <div className={styles.shareDetail}>
                                        <div className={styles.shareOption}>
                                            <select value={shareOption} onChange={handleShareOptionChange}>
                                                <option value="private">จำกัด</option>
                                                <option value="public">ทุกคนที่มีลิงค์</option>
                                            </select>
                                        </div>
                                        <div className={styles.shareText}>
                                            {shareOption === "public"
                                                ? "ผู้ใช้อินเทอร์เน็ตทุกคนที่มีลิงก์นี้จะดูได้"
                                                : "เฉพาะคนที่มีสิทธิ์เข้าถึงเท่านั้นที่เปิดด้วยลิงก์นี้ได้"}
                                        </div>
                                    </div>
                                    {shareOption === "public" && (
                                        <div className={styles.sharePrivilege}>
                                            <select>
                                                <option value="reader">ผู้มีสิทธิ์อ่าน</option>
                                                <option value="editor">เอดิเตอร์</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.sharebutt}>
                                    <div>
                                        <button type="button" className={styles.btnShareOnline}>
                                            คัดลอกลิงก์แชร์
                                        </button>
                                    </div>
                                    <div className={styles.sharebutt2butt}>
                                        <button type="button" className={styles.btnShareOnline}>
                                            แชร์เป็นสาธารณะ
                                        </button>
                                        <button type="button" className={styles.btnShare} onClick={onClose}>
                                            เสร็จสิ้น
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {inviteOpen && (
                            <div className={styles.modalInvite} style={{ marginTop: "20px", display: "flex", marginLeft: "auto" }}>
                                <button type="button" className={styles.btnCancel} onClick={() => setInviteOpen(false)}>
                                    ยกเลิก
                                </button>
                                <button type="submit" className={styles.btnShare}>
                                    เพิ่ม
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>

    );
}
