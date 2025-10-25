import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import EditTripModal from "../component/popup-editTripPlan";
import ShareTripModal from "../component/popup-shareTripPlan";
import ActivityTripModal from "../component/popup-ActivityTripModal";
import nav from "../css/main-nav.module.css";
import plantemp from "../css/tripTemplate.module.css";
import styles from "../css/tripPlan.module.css";

export default function TripPlanPage() {
    useEffect(() => {
        document.body.style.backgroundColor = "";
        return () => { document.body.style.backgroundColor = "#f5f5f5"; }
    }, []);
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const room_id = params.get("room_id");
    // state สำหรับ modal ต่างๆ
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [addActivityModalOpen, setAddActivityModalOpen] = useState(false);
    const [editActivityModalOpen, setEditActivityModalOpen] = useState(false);

    const trips = [
        {
            day: 1,
            date: "1 ธ.ค.",
            activities: [
                {
                    title: "ถึงสนามบินเชียงใหม่",
                    time: "9:00",
                    location: "สนามบินนานาชาติเชียงใหม่",
                    mapLink: "https://maps.google.com/?q=Chiang+Mai+Airport",
                    details: [
                        "✈ เดินทางโดยเครื่องบินจากสนามบินสุวรรณภูมิ (BKK) → เชียงใหม่ (CNX)",
                        "⏱ ใช้เวลาบินประมาณ 1 ชั่วโมง 15 นาที",
                        "🛄 รอรับกระเป๋าและนัดรถตู้ใช้เวลาประมาณ 20 นาที"
                    ]
                },
                {
                    title: "กินข้าวกลางวัน ร้านข้าวซอยลุงป้า",
                    time: "12:30",
                    location: "ถนนเจริญประเทศ",
                    mapLink: "https://maps.google.com/?q=Khao+Soi+Lung+Pa+Restaurant",
                    details: [
                        "🍴 มื้อกลางวันที่ร้านข้าวซอยลุงป้า",
                        "⭐ เมนูแนะนำ: ข้าวซอยไก่, ขนมจีนน้ำเงี้ยว",
                        "💰 ค่าใช้จ่ายโดยประมาณ: 80–150 บาท/คน",
                        "📝 ร้านเล็ก แนะนำไปก่อนเที่ยงเพื่อหลีกเลี่ยงคิว"
                    ]
                }
            ]
        },
        {
            day: 2,
            date: "2 ธ.ค.",
            activities: [
                {
                    title: "วัดพระธาตุดอยสุเทพ",
                    time: "10:00",
                    location: "สุเทพ, เมืองเชียงใหม่",
                    mapLink: "#",
                    details: [
                        "🚌 เดินทางจากตัวเมืองเชียงใหม่ขึ้นดอยสุเทพ (รถสองแถว/รถตู้)",
                        "⏱ ใช้เวลาเดินทางประมาณ 30–40 นาที",
                        "💰 ค่าเข้าชม: 30 บาท (ชาวต่างชาติ)",
                        "📝 ใช้เวลาเที่ยวและไหว้พระประมาณ 1 ชั่วโมง"
                    ]
                }
            ]
        }
    ];

    return (
        <>
            <header className={nav.header}>
                <div className={nav.container}>
                    <div className={nav.logo}>
                        <Link to="/tripMain">Travel Planner Pro ✈️</Link>
                    </div>
                    <nav className={nav.mainNav}>
                        <ul>
                            <li><Link to="/tripMain">หน้าหลัก</Link></li>
                            <li><Link to="/tripManage">แผนการเดินทางของฉัน</Link></li>
                            <li>
                                <img
                                    src="https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png"
                                    alt="User Profile"
                                    className={nav.profilePic}
                                    onClick={() => window.location.href = "/user"}
                                />
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className={plantemp.tripPlanMain}>
                <div className={plantemp.container}>
                    <div className={plantemp.planHeader}>
                        <h1>ทริปตะลุยเชียงใหม่ 4 วัน 3 คืน</h1>
                        <div className={plantemp.planMeta}>
                            <span className={plantemp.planDates}>1 - 4 ธันวาคม 2567</span>
                            <button className={`${plantemp.btn} ${plantemp.btnSave}`} onClick={() => setEditModalOpen(true)}>
                                <i className="fas fa-edit"></i> แก้ไข
                            </button>
                            <button className={`${plantemp.btn} ${plantemp.btnShare}`} onClick={() => setShareModalOpen(true)}>
                                <i className="fas fa-share-alt"></i> แชร์
                            </button>
                        </div>
                    </div>
                    <div class={plantemp.info}>
                        <div class={plantemp.container}>
                            <p>ทริปตะลุยเชียงใหม่ของคุณ สามารถวางแผนได้ทั้งการชมเมืองเก่า, เที่ยววัด, ไปแหล่งธรรมชาติ, หรือตะลุยกิจกรรมแอดเวนเจอร์ เช่น โหนสลิง, ล่องแก่ง, หรือขี่ ATV โดยมีสถานที่แนะนำ เช่น วัดพระธาตุดอยสุเทพ, ดอยอินทนนท์, ม่อนแจ่ม, ถนนคนเดินท่าแพ, โป่งแยง จังเกิ้ล โคสเตอร์ แอนด์ ซิปไลน์, และแกรนด์แคนยอน หางดง เพื่อให้คุณสนุกกับการผจญภัยในแบบที่ชอบ</p>
                        </div>
                    </div>
                    <div className={plantemp.planLayout}>
                        <aside className={plantemp.planSidebar}>
                            <div className={`${plantemp.sidebarItem} ${plantemp.active}`}>
                                <i className="fas fa-calendar-alt"></i> กำหนดการเดินทาง
                            </div>
                            <div className={plantemp.sidebarItem} onClick={() => navigate(`/tripBudget?room_id=${room_id}`)}>
                                <i className="fas fa-wallet"></i> งบประมาณ
                            </div>
                            <div className={plantemp.sidebarItem} onClick={() => navigate(`/tripTeam?room_id=${room_id}`)}>
                                <i className="fas fa-users"></i> สมาชิก & แชท
                            </div>
                            <div className={plantemp.sidebarItem} onClick={() => navigate(`/tripFolder?room_id=${room_id}`)}>
                                <i className="fas fa-file-alt"></i> เอกสาร
                            </div>
                        </aside>

                        <div className={styles.planContent}>
                            <div className={styles.itineraryView}>
                                {trips.map((tripDay, idx) => (
                                    <div key={idx} className={styles.itineraryDay}>
                                        <h3 className={styles.dayTitle}>วันที่ {tripDay.day} <span className={styles.dateText}>({tripDay.date})</span></h3>
                                        <div className={styles.dayActivities}>
                                            {tripDay.activities.map((act, i) => (
                                                <div key={i} className={styles.activityCard}>
                                                    <div className={styles.activityInfo}>
                                                        <h4>
                                                            <i className="fas fa-plane-arrival"></i> {act.title}{" "}
                                                            <a href={act.mapLink} target="_blank" rel="noopener noreferrer">[แผนที่]</a>
                                                        </h4>
                                                        <p className={styles.activityTime}>{act.time}</p>
                                                        <p className={styles.activityLocation}>{act.location}</p>
                                                        <div className={styles.activityDetail}>
                                                            <ul>
                                                                {act.details.map((d, j) => <li key={j}>{d}</li>)}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className={styles.activityActions}>
                                                        <button className={styles.btnEdit} onClick={() => setEditActivityModalOpen(true)}>
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button className={styles.btnDelete}><i className="fas fa-trash"></i></button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button className={styles.btnAddActivity} onClick={() => setAddActivityModalOpen(true)}>
                                                <i className="fas fa-plus"></i> เพิ่มกิจกรรม
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

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

            {/* Add Activity Modal */}
            <ActivityTripModal
                type="add"
                open={addActivityModalOpen}
                onClose={() => setAddActivityModalOpen(false)}
            />

            {/* Edit Activity Modal */}
            <ActivityTripModal
                type="edit"
                open={editActivityModalOpen}
                onClose={() => setEditActivityModalOpen(false)}
                editData={{
                    date: "1 ธ.ค.",
                    main: "ตัวอย่างกิจกรรม",
                    time: "09:00",
                    location: "กรุงเทพ",
                    locationLink: "https://...",
                    details: [{ text: "รายละเอียด 1" }, { text: "รายละเอียด 2" }]
                }}
            />
        </>
    );
}
