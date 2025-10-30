import React, { useState, useEffect } from "react";
import styles from "../css/popup-shareTripPlan.module.css";

// --- URL ของ Backend (เปลี่ยนตามจริง) ---
const API_URL = "http://localhost:3001"; // (สมมติว่ารันที่ Port 3001)

export default function EditTripModal({ isOpen, onClose, roomId }) {
    const [inviteOpen, setInviteOpen] = useState(false);
    const [shareOption, setShareOption] = useState("private");
    const [isShared, setIsShared] = useState(false); // <-- เพิ่ม: state สำหรับสถานะแชร์
    const [shareLoading, setShareLoading] = useState(false);

    const [users, setUsers] = useState([]);         // เก็บ Owner + Members
    const [inviteEmail, setInviteEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;
    // --- 1. Fetch ข้อมูล User ทั้งหมดเมื่อ Modal เปิด ---
    useEffect(() => {
        const fetchAccessList = async () => {
            if (!roomId) return; // ถ้าไม่มี roomId ก็ไม่ต้องทำ

            setIsLoading(true);
            setError(null);
            try {
                // ยิงไป API ใหม่ที่เราเพิ่งเพิ่มใน server.js
                const [accessRes, tripRes] = await Promise.all([
                    fetch(`${API_URL}/api/access/${roomId}`),
                    fetch(`${API_URL}/trip_detail?room_id=${roomId}`) // <-- เพิ่ม: ดึงข้อมูลทริป
                ]);

                if (!accessRes.ok) throw new Error("Failed to fetch user list");
                if (!tripRes.ok) throw new Error("Failed to fetch trip details");

                const accessData = await accessRes.json();
                const tripData = await tripRes.json(); // <-- เพิ่ม

                setUsers(accessData);
                setIsShared(tripData.share_status);

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchAccessList();
        } else {
            // เคลียร์ค่าเมื่อ Modal ปิด
            setUsers([]);
            setInviteOpen(false);
            setInviteEmail("");
            setError(null);
        }
    }, [isOpen, roomId]); // ทำงานใหม่เมื่อ Modal เปิด หรือ roomId เปลี่ยน


    // --- 2. Handlers (ปรับปรุง) ---
    const handleToggleShareStatus = async () => {
        setShareLoading(true);
        const newStatus = !isShared; // สลับค่า true/false

        try {
            const response = await fetch(`${API_URL}/api/trip/${roomId}/share_status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ share_status: newStatus }) // ส่งสถานะใหม่ไป
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update share status');
            }

            // ถ้าสำเร็จ ให้อัปเดต State ใน React
            setIsShared(newStatus);

        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        } finally {
            setShareLoading(false);
        }
    };

    const handleInputFocus = () => {
        setInviteOpen(true);
    };

    const handleInputChange = (e) => {
        setInviteEmail(e.target.value);
    };

    // --- 4. ฟังก์ชันลบ User (ยิง API จริง) ---
    const handleRemoveUser = async (accessId, username) => {
        // ยืนยันก่อน
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${username} ออกจากทริปนี้?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/access/${accessId}`, {
                method: "DELETE"
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to remove user");
            }

            // ถ้าลบสำเร็จ: ลบ user ออกจาก State (เร็วกว่า refetch)
            setUsers(currentUsers =>
                currentUsers.filter(u => u.access_id !== accessId)
            );

        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    // --- 3. ฟังก์ชัน Invite (ยิง API จริง) ---
    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        if (!inviteEmail || !roomId) return;

        // เช็คก่อนว่า user นี้ถูกเชิญไปรึยัง
        if (users.find(u => u.email === inviteEmail || u.username === inviteEmail)) {
            alert("ผู้ใช้งานนี้มีสิทธิ์อยู่แล้ว");
            return;
        }

        try {
            // ยิงไป API 'POST /inviteUser'
            const response = await fetch(`${API_URL}/inviteUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailOrUsername: inviteEmail,
                    roomId: roomId,
                    role: "reader" // <-- Hardcode Role ตามที่เราตกลงกัน
                })
            });

            const result = await response.json();

            if (!response.ok) {
                // ถ้า Server ตอบ error (เช่น 404 Not Found)
                throw new Error(result.message || "Failed to invite user");
            }

            // ถ้าสำเร็จ: เพิ่ม user ใหม่เข้าไปใน State (เพื่ออัปเดต UI ทันที)
            // (เราต้องไปดึงข้อมูล User ที่เพิ่งเพิ่มมา... 
            // หรือวิธีง่ายกว่าคือ refetch ทั้งหมด)

            // --- Refetch ข้อมูลใหม่ ---
            setIsLoading(true);
            const refetchRes = await fetch(`${API_URL}/api/access/${roomId}`);
            const data = await refetchRes.json();
            setUsers(data);
            setIsLoading(false);
            // ------------------------

            // กลับไปหน้า List
            setInviteEmail("");
            setInviteOpen(false);

        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    const handleCancelInvite = () => {
        setInviteEmail("");
        setInviteOpen(false);
    };

    const handleShareOptionChange = (e) => {
        setShareOption(e.target.value);
    };


    if (!isOpen) return null;

    return (
        <>
            <div className={styles.overlayBlur} onClick={onClose}></div>
            <div className={styles.modal} style={{ display: "flex", backdropFilter: "blur(3px)" }}>
                <div className={styles.modalContent}>
                    {/* ... modalMain (Header) ... */}

                    <form onSubmit={handleInviteSubmit}> {/* <--- ใช้ onSubmit ได้ */}
                        <label>เพิ่มเพื่อนๆ และผู้ใช้งาน</label>
                        <div className={styles.inputInvite}>
                            <input
                                type="text"
                                placeholder="เพิ่มเพื่อน (พิมพ์อีเมลหรือ Username)"
                                value={inviteEmail}
                                onFocus={handleInputFocus}
                                onChange={handleInputChange}
                                style={{
                                    width: "100%", // <-- เอา role ออก กว้าง 100%
                                    transition: "width .5s ease",
                                    padding: "10px",
                                }}
                            />
                            {/* --- ลบ Dropdown เลือก Role ออก --- */}
                        </div>

                        {!inviteOpen && (
                            <div>
                                <label>บุคคลที่มีสิทธิ์เข้าถึง</label>

                                <div className={styles.preProfile}>
                                    {isLoading && <div>Loading...</div>}
                                    {error && <div style={{ color: 'red' }}>{error}</div>}

                                    {!isLoading && !error && users.map((user) => (
                                        <div className={styles.profile} key={user.user_id}>
                                            <div className={styles.pic}>
                                                <img
                                                    src={user.profile_uri || "default-avatar.png"}
                                                    alt="profile"
                                                />
                                            </div>
                                            <div className={styles.user}>
                                                <div className={styles.username}>{user.username}</div>
                                                <div className={styles.email}>{user.email}</div>
                                            </div>
                                            {/* ถ้าเป็น Owner ให้โชว์คำว่า Owner */}
                                            {/* ถ้าเป็น Member ให้โชว์คำว่า "ผู้เข้าร่วม" (ตามที่คุณขอก่อนหน้า) */}
                                            <div className={styles.privilege}>
                                                {user.role === 'Owner' ? 'Owner' : 'ผู้เข้าร่วม'}
                                            </div>

                                            {user.role !== 'Owner' && (
                                                <button
                                                    type="button"
                                                    className={styles.removeButton}
                                                    onClick={() => handleRemoveUser(user.access_id, user.username)}
                                                >
                                                    &times; {/* นี่คือเครื่องหมาย (X) */}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <label>การเข้าถึงทั่วไป</label>
                                {/* ... (ส่วนการเข้าถึงทั่วไป) ... */}
                                {/* --- ลบ Dropdown เลือก Role ของ Public ออก --- */}
                                {/* --- (เพิ่ม) ปุ่มใหม่ --- */}
                                <div className={styles.sharebutt} style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <button
                                        type="button"
                                        // (เปลี่ยน style ปุ่มตามสถานะ)
                                        className={isShared ? styles.btnCancel : styles.btnShareOnline}
                                        onClick={handleToggleShareStatus}
                                        disabled={shareLoading}
                                    >
                                        {shareLoading ? "กำลังโหลด..." : (isShared ? "ยกเลิกแบ่งปัน" : "แบ่งปันแผนของคุณ")}
                                    </button>

                                    <button type="button" className={styles.btnShare} onClick={onClose}>
                                        เสร็จสิ้น
                                    </button>
                                </div>
                            </div>
                        )}

                        {inviteOpen && (
                            <div className={styles.modalInvite} style={{ marginTop: "20px", display: "flex", marginLeft: "auto" }}>
                                <button type="button" className={styles.btnCancel} onClick={handleCancelInvite}>
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