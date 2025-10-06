import React, { useState } from "react";

import EditTripModal from "../component/popup-editTripPlan";
import ShareTripModal from "../component/popup-shareTripPlan";

import styles from "../css/tripTeam.module.css";
import budget from "../css/tripBudget.module.css";
import nav from "../css/main-nav.module.css";
import tripTemplate from "../css/tripTemplate.module.css";

export default function TripBudget() {
    // state สำหรับ modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    // state สำหรับสลับหน้า member list กับ personal budget
    const [showPersonalBudget, setShowPersonalBudget] = useState(false);
    const [member, setMember] = useState(null);

    const members = [
        { name: "Jane Doe", img: "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png" },
        { name: "John Smith", img: "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png" },
        { name: "Alice Tan", img: "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png" },
        { name: "Mark Lee", img: "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png" },
    ];

    const summary = { paidTotal: 20000, shouldPay: 8500, remaining: 11500 };
    const debts = [
        { name: "สมมิตร", status: "ต้องจ่าย", amount: 5000, details: "สมมิตร ต้องจ่ายเงินให้กับ Jane Doe 5,000 บาท" },
        { name: "สมดี", status: "จะได้รับ", amount: 200, details: "สมดี จะได้รับเงินจาก Jane Doe 200 บาท" },
        { name: "สมร้าย", status: "ต้องจ่าย", amount: 2000, details: "สมร้าย ต้องจ่ายเงินให้กับ Jane Doe 2,000 บาท" },
    ];
    const expenses = [
        { title: "ค่าตั๋วเครื่องบิน", category: "เดินทาง", amount: 5000, paidBy: "Jane Doe", date: "10/11/2567" },
        { title: "ค่าที่พัก 3 คืน", category: "ที่พัก", amount: 3000, paidBy: "John Doe", date: "15/11/2567" },
        { title: "ค่าอาหารกลางวัน (วันแรก)", category: "อาหาร", amount: 500, paidBy: "Jane Doe", date: "01/12/2567" },
    ];

    const handleOpenBudget = (m) => {
        setMember(m.name);
        setSelectedMember(m);
        setShowPersonalBudget(true);
    };

    const handleEdit = (m) => {
        setSelectedMember(m);
        setShowEditModal(true);
    };

    const handleDelete = (m) => {
        if (window.confirm(`ต้องการลบ ${m.name} หรือไม่?`)) {
            console.log(`ลบ ${m.name}`);
        }
    };

    const formatCurrency = (num) => `฿ ${num.toLocaleString()}`;

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
                            <div className={tripTemplate.sidebarItem} onClick={() => window.location.href = '/tripPlan'}>
                                <i className="fas fa-calendar-alt"></i> กำหนดการเดินทาง
                            </div>
                            <div className={tripTemplate.sidebarItem} onClick={() => window.location.href = '/tripBudget'}>
                                <i className="fas fa-wallet"></i> งบประมาณ
                            </div>
                            <div className={`${tripTemplate.sidebarItem} ${tripTemplate.active}`} onClick={() => window.location.href = '/tripTeam'}>
                                <i className="fas fa-users"></i> สมาชิก & แชท
                            </div>
                            <div className={tripTemplate.sidebarItem} onClick={() => window.location.href = '/tripFolder'}>
                                <i className="fas fa-file-alt"></i> เอกสาร
                            </div>
                        </aside>

                        {/* Content */}
                        {!showPersonalBudget && (
                            <div className={styles.planContent} id="memberlist">
                                <div className={styles.tabContent}>
                                    <div className={styles.memberHeader}>
                                        <h2>สมาชิกในทริป</h2>
                                        <button className={`${styles.btn} ${styles.btnAddMember}`} onClick={() => setShowAddModal(true)}>
                                            <i className="fas fa-plus"></i> เพิ่มสมาชิก
                                        </button>
                                    </div>

                                    <div className={styles.memberGrid}>
                                        {members.map((m, i) => (
                                            <div className={styles.memberCard} key={i}>
                                                <div className={styles.memberAvatar}>
                                                    <img src={m.img} alt={m.name} />
                                                </div>
                                                <div className={styles.memberName}>{m.name}</div>
                                                <div className={styles.memberActions}>
                                                    <button className={styles.btnFinance} onClick={() => handleOpenBudget(m)}>
                                                        <i className="fas fa-wallet"></i> ดูข้อมูลการเงิน
                                                    </button>
                                                    <button className={styles.btnEdit} onClick={() => handleEdit(m)}>
                                                        <i className="fas fa-edit"></i> แก้ไขรายละเอียด
                                                    </button>
                                                    <button className={styles.btnDelete} onClick={() => handleDelete(m)}>
                                                        <i className="fas fa-trash"></i> ลบ
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {showPersonalBudget && selectedMember && (
                            <div className={styles.planContent} id="PersonalBudgetDetails">
                                <div className={budget.tabContent}>
                                    <div className={budget.memberHeader}>
                                        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                                            <button className={styles.btnBack} aria-label="back" onClick={() => setShowPersonalBudget(false)}>
                                                <i className="fas fa-arrow-left"></i>
                                            </button>
                                            <h2>สมาชิก {member}</h2>
                                        </div>
                                    </div>

                                    {/* ใส่ข้อมูล summary, debts, expenses เหมือนเดิม */}
                                    <div className={budget.budgetSummary}>
                                        <div className={budget.summaryCard}>
                                            <h3>จำนวนเงินที่จ่ายไปทั้งหมด</h3>
                                            <p className={budget.summaryAmount}>{formatCurrency(summary.paidTotal)}</p>
                                        </div>
                                        <div className={budget.summaryCard}>
                                            <h3>จำนวนเงินที่ควรจ่าย</h3>
                                            <p className={`${budget.summaryAmount} ${budget.used}`}>{formatCurrency(summary.shouldPay)}</p>
                                        </div>
                                        <div className={budget.summaryCard}>
                                            <h3>ควรได้รับคืน / ยังต้องจ่ายเพิ่ม</h3>
                                            <p className={`${budget.summaryAmount} ${budget.remaining}`}>{formatCurrency(summary.remaining)}</p>
                                        </div>
                                    </div>

                                    <div className={budget.budgetDetails}>
                                        <div className={budget.detailsHeader}>
                                            <h2>จำนวนเงินที่ควรจ่าย \ ได้คืน</h2>
                                        </div>
                                        <table className={budget.expenseTable}>
                                            <thead>
                                                <tr>
                                                    <th>รายชื่อสมาชิก</th>
                                                    <th>สถานะ</th>
                                                    <th>จำนวนเงิน</th>
                                                    <th>รายละเอียด</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {debts.map((d, i) => (
                                                    <tr key={i}>
                                                        <td>{d.name}</td>
                                                        <td>{d.status}</td>
                                                        <td className={d.status === "จะได้รับ" ? budget.td2 : budget.td1}>{formatCurrency(d.amount)}</td>
                                                        <td>{d.details}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className={budget.budgetDetails}>
                                        <div className={budget.detailsHeader}><h2>รายการค่าใช้จ่าย</h2></div>
                                        <table className={budget.expenseTable}>
                                            <thead>
                                                <tr>
                                                    <th>รายการ</th>
                                                    <th>หมวดหมู่</th>
                                                    <th>จำนวนเงิน</th>
                                                    <th>จ่ายโดย</th>
                                                    <th>วัน/เวลา</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {expenses.map((e, i) => (
                                                    <tr key={i}>
                                                        <td>{e.title}</td>
                                                        <td>{e.category}</td>
                                                        <td>{formatCurrency(e.amount)}</td>
                                                        <td>{e.paidBy}</td>
                                                        <td>{e.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Edit & Share Modals */}
            <EditTripModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} />
            <ShareTripModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />

            {/* Add & Edit Member Modals */}
            {showAddModal && (
                <div className="modal" style={{ display: "flex" }}>
                    <div className="modal-content">
                        <div className="modal-main">
                            <h2>เพิ่มสมาชิกในทริป</h2>
                            <span className="close" onClick={() => setShowAddModal(false)}>&times;</span>
                        </div>
                        <form>
                            <label htmlFor="memberName">ชื่อสมาชิก *</label>
                            <input type="text" id="memberName" placeholder="ชื่อสมาชิก" required />
                            <label htmlFor="memberPic">รูปสมาชิก</label>
                            <input type="file" id="memberPic" accept="image/*" />
                            <div style={{ display: "flex", marginTop: 10 }}>
                                <div style={{ marginLeft: "auto" }}>
                                    <button type="submit" className="btn-save-edit">เพิ่ม</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal" style={{ display: "flex" }}>
                    <div className="modal-content">
                        <div className="modal-main">
                            <h2>แก้ไขสมาชิกในทริป</h2>
                            <span className="close" onClick={() => setShowEditModal(false)}>&times;</span>
                        </div>
                        <form>
                            <label htmlFor="memberName">ชื่อสมาชิก *</label>
                            <input
                                type="text"
                                id="memberName"
                                defaultValue={selectedMember?.name}
                                placeholder="ชื่อสมาชิก"
                                required
                            />
                            <label htmlFor="memberPic">รูปสมาชิก</label>
                            <input type="file" id="memberPic" accept="image/*" />
                            <div style={{ display: "flex", marginTop: 10 }}>
                                <div style={{ marginLeft: "auto" }}>
                                    <button type="submit" className="btn-save-edit">บันทึก</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
