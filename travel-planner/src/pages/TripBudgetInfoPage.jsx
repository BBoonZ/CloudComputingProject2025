import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditTripModal from "../component/popup-editTripPlan";
import ShareTripModal from "../component/popup-shareTripPlan";
import BudgetModal from "../component/popup-BudgetTrip";

import styles from "../css/tripBudget.module.css";
import nav from "../css/main-nav.module.css";
import tripTemplate from "../css/tripTemplate.module.css";
export default function TripBudget() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const room_id = params.get("room_id");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [roomExpend, setRoomExpend] = useState([]);
    const [roomUseBudget, setRoomUseBudget] = useState();
    const [expensesTeam, setExpensesTeam] = useState([]);
    const tripTitle = location.state?.tripTitle || "กำลังโหลดชื่อทริป...";
    const tripDescription = location.state?.tripDescription || "";
    const trip = location.state?.trip || "";
    const base_api = process.env.REACT_APP_API_URL;
    useEffect(() => {
        // ดึงรายชื่อสมาชิก
        fetch(`${base_api}/members?room_id=${room_id}`)
            .then((res) => res.json())
            .then((members) => {
                setTeamMembers(members);

                // ดึงข้อมูลค่าใช้จ่ายของห้อง
                fetch(`${base_api}/room_expends/${room_id}`)
                    .then((res) => res.json())
                    .then((dat) => {
                        setRoomExpend(dat);

                        // รวมค่าใช้จ่ายทั้งหมด
                        const totalUsed = dat.Expends?.reduce((sum, item) => sum + Number(item.value), 0) || 0;
                        setRoomUseBudget(totalUsed);

                        // ===== คำนวณตาราง expensesTeam =====
                        if (members.length > 0) {
                            // 1️⃣ รวมจ่ายต่อคน (เฉพาะคนที่มี expend)
                            const paidByMember = {};
                            dat.Expends?.forEach((exp) => {
                                const memberId = exp.member_id;
                                if (!paidByMember[memberId]) {
                                    paidByMember[memberId] = {
                                        name: exp.Member?.member_name || "ไม่ระบุ",
                                        paid: 0,
                                    };
                                }
                                paidByMember[memberId].paid += Number(exp.value);
                            });

                            // 2️⃣ รวมคนที่ไม่มี expend ด้วย (paid = 0)
                            members.forEach((m) => {
                                if (!paidByMember[m.member_id]) {
                                    paidByMember[m.member_id] = {
                                        name: m.member_name,
                                        paid: 0,
                                    };
                                }
                            });

                            // 3️⃣ คำนวณค่าเฉลี่ยที่ควรจ่าย (เอาจำนวนสมาชิกทั้งหมดมาหาร)
                            const totalMembers = members.length;
                            const avgPay = totalMembers > 0 ? totalUsed / totalMembers : 0;

                            // 4️⃣ คำนวณ shouldPay และ diff
                            const calculated = Object.values(paidByMember).map((member) => {
                                const shouldPayRaw = avgPay - member.paid;
                                const shouldPay = shouldPayRaw <= 0 ? 0 : shouldPayRaw;
                                const diff = shouldPayRaw < 0 ? Math.abs(shouldPayRaw) : 0;

                                return {
                                    name: member.name,
                                    paid: member.paid,
                                    shouldPay,
                                    diff,
                                };
                            });

                            setExpensesTeam(calculated);
                        }
                    })
                    .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
    }, [room_id]);
    const expenses = [
        {
            name: "ค่าตั๋วเครื่องบิน",
            category: "เดินทาง",
            amount: "฿ 5,000",
            paidBy: "Jane Doe",
            date: "10/11/2567",
        },
        {
            name: "ค่าที่พัก 3 คืน",
            category: "ที่พัก",
            amount: "฿ 3,000",
            paidBy: "John Smith",
            date: "15/11/2567",
        },
        {
            name: "ค่าอาหารกลางวัน (วันแรก)",
            category: "อาหาร",
            amount: "฿ 500",
            paidBy: "Jane Doe",
            date: "01/12/2567",
        },
    ];

    // const expensesTeam = [
    //     { name: "Jane Doe", paid: 5000, shouldPay: 1200, diff: 3200 },
    //     { name: "John Smith", paid: 3000, shouldPay: 1200, diff: 1800 },
    //     { name: "สมใจ", paid: 500, shouldPay: 1200, diff: -700 },
    // ];

    return (
        <>
            {/* Header */}
            <header className={nav.header}>
                <div className={nav.container}>
                    <div className={nav.logo}>
                        <a href="/tripMain">Travel Planner Pro ✈️</a>
                    </div>
                    <nav className={nav.mainNav}>
                        <ul>
                            <li><a href="/tripMain">หน้าหลัก</a></li>
                            <li><a href="/tripManage">แผนการเดินทางของฉัน</a></li>
                            <img
                                src="https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png"
                                alt="User Profile"
                                className={nav.profilePic}
                                onClick={() => (window.location.href = "/user")}
                            />
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Main */}
            <main className={tripTemplate.tripPlanMain}>
                <div className={tripTemplate.container}>
                    <div className={tripTemplate.planHeader}>
                        <h1>{tripTitle}</h1>
                        <div className={tripTemplate.planMeta}>
                            <span className={tripTemplate.planDates}></span>
                            <button className={`${tripTemplate.btn} ${tripTemplate.btnBack}`} onClick={() => navigate("/tripmain")}>
                                <i className="fas fa-arrow-left"></i> กลับ
                            </button>
                            <button className={`${tripTemplate.btn} ${tripTemplate.btnCopy}`} onClick={() => navigate("/tripmanage")}>
                                <i className="fas fa-plus-circle"></i> เพิ่มเข้าแผนของฉัน
                            </button>
                        </div>
                    </div>
                    <div class={tripTemplate.info}>
                        <div class={tripTemplate.container}>
                            <p>{tripDescription}</p>
                        </div>
                    </div>
                    <div className={tripTemplate.planLayout}>
                        <aside className={tripTemplate.planSidebar}>
                            <div className={tripTemplate.sidebarItem} onClick={() => navigate(`/tripPlanInfo?room_id=${room_id}`, {
                                state: {
                                    tripTitle: tripTitle,
                                    tripDescription: tripDescription,
                                    trip: trip
                                }
                            })}>
                                <i className="fas fa-calendar-alt"></i> กำหนดการเดินทาง
                            </div>
                            <div className={`${tripTemplate.sidebarItem} ${tripTemplate.active}`} onClick={() => navigate(`/tripBudgetInfo?room_id=${room_id}`, {
                                state: {
                                    tripTitle: tripTitle,
                                    tripDescription: tripDescription,
                                    trip: trip
                                }
                            })}>
                                <i className="fas fa-wallet"></i> งบประมาณ
                            </div>

                        </aside>

                        {/* Content */}
                        <div className={tripTemplate.planContent}>
                            <div className={styles.budgetSummary}>
                                <div className={styles.summaryCard}>
                                    <h3>งบประมาณรวม</h3>
                                    <p className={styles.summaryAmount}>฿{Number(roomExpend.total_budget)?.toLocaleString()}</p>
                                </div>
                                <div className={styles.summaryCard}>
                                    <h3>ใช้จ่ายไปแล้ว</h3>
                                    <p className={`${styles.summaryAmount} ${styles.used}`}>฿{roomUseBudget?.toLocaleString()}</p>
                                </div>
                                <div className={styles.summaryCard}>
                                    <h3>คงเหลือ</h3>
                                    <p className={`${styles.summaryAmount} ${styles.remaining}`}>฿{(roomExpend.total_budget - roomUseBudget)?.toLocaleString()}</p>
                                </div>
                            </div>



                            <div className={styles.budgetDetails}>
                                <div className={styles.detailsHeader}>
                                    <h2>รายการค่าใช้จ่าย</h2>
                                </div>

                                <table className={styles.expenseTable}>
                                    <thead>
                                        <tr>
                                            <th>รายการ</th>
                                            <th>หมวดหมู่</th>
                                            <th>จำนวนเงิน</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roomExpend?.Expends?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.description}</td>
                                                <td>{item.type}</td>
                                                <td>{item.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

