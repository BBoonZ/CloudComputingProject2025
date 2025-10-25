import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditTripModal from "../component/popup-editTripPlan";
import ShareTripModal from "../component/popup-shareTripPlan";
import BudgetModal from "../component/popup-BudgetTrip";

import styles from "../css/tripBudget.module.css";
import nav from "../css/main-nav.module.css";
import tripTemplate from "../css/tripTemplate.module.css";

export default function TripBudget() {
    // state สำหรับ modal
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
    useEffect(() => {
        fetch(`http://localhost:3001/members?room_id=${room_id}`)
            .then((res) => res.json())
            .then((data) => setTeamMembers(data))
            .catch((err) => console.error(err));

        fetch(`http://localhost:3001/room_expends/${room_id}`)
            .then((res) => res.json())
            .then((dat) => {
                setRoomExpend(dat);

                // รวมค่าใช้จ่ายทั้งหมด
                const totalUsed = dat.Expends?.reduce((sum, item) => sum + Number(item.value), 0) || 0;
                setRoomUseBudget(totalUsed);
            })
            .catch((err) => console.error(err));
    }, [room_id]);


    const handleDeleteExpense = async (expend_id) => {
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบค่าใช้จ่ายนี้?")) return;

        try {
            const response = await fetch(`http://localhost:3001/deleteBudget/${expend_id}`, {
                method: "DELETE",
            });

            const resData = await response.json();
            console.log("ลบสำเร็จ:", resData);

            // อัปเดตรายการหลังลบ
            setRoomExpend((prev) => ({
                ...prev,
                Expends: prev.Expends.filter((item) => item.expend_id !== expend_id),
            }));

            alert("ลบค่าใช้จ่ายเรียบร้อย!");
        } catch (err) {
            console.error("ลบค่าใช้จ่ายไม่สำเร็จ:", err);
            alert("เกิดข้อผิดพลาดในการลบค่าใช้จ่าย");
        }
    };

    const handleOpenEdit = (expense) => {
        setSelectedExpense(expense); // set ค่า
        setShowEditModal(true);      // เปิด modal
    };

    const handleAddExpense = (e) => {
        e.preventDefault();
        alert("เพิ่มค่าใช้จ่ายสำเร็จ!");
        setShowAddModal(false);
    };

    const handleEditExpense = (e) => {
        e.preventDefault();
        alert("บันทึกการแก้ไขแล้ว");
        setShowEditModal(false);
    };

    // const expenses = [
    //     {
    //         name: "ค่าตั๋วเครื่องบิน",
    //         category: "เดินทาง",
    //         amount: "฿ 5,000",
    //         paidBy: "Jane Doe",
    //         date: "10/11/2567",
    //     },
    //     {
    //         name: "ค่าที่พัก 3 คืน",
    //         category: "ที่พัก",
    //         amount: "฿ 3,000",
    //         paidBy: "John Smith",
    //         date: "15/11/2567",
    //     },
    //     {
    //         name: "ค่าอาหารกลางวัน (วันแรก)",
    //         category: "อาหาร",
    //         amount: "฿ 500",
    //         paidBy: "Jane Doe",
    //         date: "01/12/2567",
    //     },
    // ];

    const expensesTeam = [
        { name: "Jane Doe", paid: 5000, shouldPay: 1200, diff: 3200 },
        { name: "John Smith", paid: 3000, shouldPay: 1200, diff: 1800 },
        { name: "สมใจ", paid: 500, shouldPay: 1200, diff: -700 },
    ];

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
                        <h1>ทริปตะลุยเชียงใหม่ 4 วัน 3 คืน</h1>
                        <div className={tripTemplate.planMeta}>
                            <span className={tripTemplate.planDates}>1 - 4 ธันวาคม 2567</span>
                            <button className={`${tripTemplate.btn} ${tripTemplate.btnSave}`} onClick={() => setEditModalOpen(true)}>
                                <i className="fas fa-edit"></i> แก้ไข
                            </button>
                            <button className={`${tripTemplate.btn} ${tripTemplate.btnShare}`} onClick={() => setShareModalOpen(true)}>
                                <i className="fas fa-share-alt"></i> แชร์
                            </button>
                        </div>
                    </div>
                    <div class={tripTemplate.info}>
                        <div class={tripTemplate.container}>
                            <p>ทริปตะลุยเชียงใหม่ของคุณ สามารถวางแผนได้ทั้งการชมเมืองเก่า, เที่ยววัด, ไปแหล่งธรรมชาติ, หรือตะลุยกิจกรรมแอดเวนเจอร์ เช่น โหนสลิง, ล่องแก่ง, หรือขี่ ATV โดยมีสถานที่แนะนำ เช่น วัดพระธาตุดอยสุเทพ, ดอยอินทนนท์, ม่อนแจ่ม, ถนนคนเดินท่าแพ, โป่งแยง จังเกิ้ล โคสเตอร์ แอนด์ ซิปไลน์, และแกรนด์แคนยอน หางดง เพื่อให้คุณสนุกกับการผจญภัยในแบบที่ชอบ</p>
                        </div>
                    </div>
                    <div className={tripTemplate.planLayout}>
                        <aside className={tripTemplate.planSidebar}>
                            <div className={tripTemplate.sidebarItem} onClick={() => navigate(`/tripPlan?room_id=${room_id}`)}>
                                <i className="fas fa-calendar-alt"></i> กำหนดการเดินทาง
                            </div>
                            <div className={`${tripTemplate.sidebarItem} ${tripTemplate.active}`} onClick={() => navigate(`/tripBudget?room_id=${room_id}`)}>
                                <i className="fas fa-wallet"></i> งบประมาณ
                            </div>
                            <div className={tripTemplate.sidebarItem} onClick={() => navigate(`/tripTeam?room_id=${room_id}`)}>
                                <i className="fas fa-users"></i> สมาชิก & แชท
                            </div>
                            <div className={tripTemplate.sidebarItem} onClick={() => navigate(`/tripFolder?room_id=${room_id}`)}>
                                <i className="fas fa-file-alt"></i> เอกสาร
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
                                    <h2>จำนวนเงินที่จ่ายไปทั้งหมด</h2>
                                </div>

                                <table className={styles.expenseTable}>
                                    <thead>
                                        <tr>
                                            <th>รายชื่อ</th>
                                            <th>จำนวนเงินที่จ่ายไปทั้งหมด</th>
                                            <th>จำนวนเงินที่ควรจ่าย</th>
                                            <th>ควรได้รับคืน / ยังต้องจ่ายเพิ่ม</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expensesTeam.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.paid.toLocaleString()} B</td>
                                                <td>{item.shouldPay.toLocaleString()} B</td>
                                                <td
                                                    className={item.diff >= 0 ? styles.td1 : styles.td2}
                                                >
                                                    {Math.abs(item.diff).toLocaleString()} B
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className={styles.budgetDetails}>
                                <div className={styles.detailsHeader}>
                                    <h2>รายการค่าใช้จ่าย</h2>
                                    <button className={`${styles.btn} ${styles.btnAddExpense}`} onClick={() => setShowAddModal(true)}>
                                        <i className="fas fa-plus"></i> เพิ่มค่าใช้จ่าย
                                    </button>
                                </div>

                                <table className={styles.expenseTable}>
                                    <thead>
                                        <tr>
                                            <th>รายการ</th>
                                            <th>หมวดหมู่</th>
                                            <th>จำนวนเงิน</th>
                                            <th>จ่ายโดย</th>
                                            <th>วัน/เวลา</th>
                                            <th>การจัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roomExpend?.Expends?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.description}</td>
                                                <td>{item.type}</td>
                                                <td>{item.value}</td>
                                                <td>{item.Member?.member_name || "ไม่ระบุ"}</td>
                                                <td>{item.paydate}</td>
                                                <td>
                                                    <i
                                                        className="fas fa-edit"
                                                        style={{ cursor: "pointer", marginRight: "10px" }}
                                                        onClick={() => handleOpenEdit(item)}
                                                    ></i>
                                                    <i
                                                        className="fas fa-trash"
                                                        style={{ cursor: "pointer", color: "red" }}
                                                        onClick={() => handleDeleteExpense(item.expend_id)}
                                                    ></i>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Add Budget Modal */}
            <BudgetModal
                type="add"
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddExpense}
                room_id={room_id}
                teamMembers={teamMembers}
            />

            {/* Edit Budget Modal */}
            <BudgetModal
                type="edit"
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleEditExpense}
                room_id={room_id}
                teamMembers={teamMembers}
                initialData={selectedExpense}
            />

            {/* Edit Modal */}
            <EditTripModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
            />

            {/* Share Modal */}
            <ShareTripModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
            />
        </>
    );
}

