import React, { useState, useEffect, use } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import EditTripModal from "../component/popup-editTripPlan";
import ShareTripModal from "../component/popup-shareTripPlan";
import ActivityTripModal from "../component/popup-ActivityTripModal";
import nav from "../css/main-nav.module.css";
import plantemp from "../css/tripTemplate.module.css";
import styles from "../css/tripPlan.module.css";
import tripTemplate from "../css/tripTemplate.module.css";

export default function TripPlanPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const room_id = params.get("room_id");
    // state สำหรับ modal ต่างๆ
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [addActivityModalOpen, setAddActivityModalOpen] = useState(false);
    const [editActivityModalOpen, setEditActivityModalOpen] = useState(false);
    const [trip, setTrip] = useState(null);
    const [trips, setTrips] = useState([]);
    const [totaldate, setTotaldate] = useState([]);
    const [totalDays, setTotalDays] = useState(0);
    const [selectDate, setSelectedDate] = useState(null);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [shareStatus, setShareStatus] = useState("แบ่งปันแผนของคุณ")
    const [isShared, setIsShared] = useState(false); // ใช้ boolean
    const [shareLoading, setShareLoading] = useState(false);
    const base_api = process.env.REACT_APP_API_URL;




    const handleDeleteActivity = async (itineraryId) => {
        // 1. ถามยืนยันก่อนลบ
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้?")) {
            return;
        }

        try {
            // 2. ยิง API "DELETE"
            const response = await fetch(`${base_api}/deleteActivity/${itineraryId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete activity');
            }

            // 3. (สำคัญ!) ลบออกจาก State เอง โดยไม่ต้อง reload หน้า
            setTrips(currentTrips => {
                // วนลูปทุกวัน (Days)
                return currentTrips.map(day => {
                    // กรอง Activity ที่เพิ่งลบออกไป
                    const updatedActivities = day.activities.filter(
                        act => act.itinerary_id !== itineraryId
                    );

                    return {
                        ...day,
                        activities: updatedActivities
                    };
                });
            });

            alert("ลบกิจกรรมสำเร็จ!");

        } catch (err) {
            console.error("Error deleting activity:", err);
            alert(`เกิดข้อผิดพลาด: ${err.message}`);
        }
    };

    const generateTripDays = (startDateStr, endDateStr) => {
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        const days = [];
        let current = new Date(start);

        let dayCount = 1;

        while (current <= end) {
            // สร้างวันที่เป็น "1 ธ.ค." เช่นเดิม
            const options = { day: 'numeric', month: 'short' };
            const dateText = current.toLocaleDateString('th-TH', options);
            const realdate = current.toISOString().split("T")[0]

            days.push({
                day: dayCount,
                date: dateText,
                real: realdate,
                activities: [] // กิจกรรมว่าง ๆ สามารถเติมจาก API
            });

            // ไปวันถัดไป
            current.setDate(current.getDate() + 1);
            dayCount++;
        }
        return days;
    };

    useEffect(() => {
        // --- 1. (เพิ่ม) ดึง ID ผู้ใช้สำหรับ "แสดงบัตร" ---
        // (สมมติว่าคุณเก็บ user_id ไว้ใน localStorage ตอนล็อกอิน)
        const userDataString = localStorage.getItem('userData'); // 1. ดึง "ก้อน" JSON
        const userData = userDataString ? JSON.parse(userDataString) : {}; // 2. แปลงเป็น Object
        const currentUserId = userData.user_id;
        const authHeaders = {
            'x-user-id': currentUserId || ''
        };

        // --- 2. (เพิ่ม) ฟังก์ชันจัดการ Error (เด้งออก) ---
        const handleAuthError = (err) => {
            console.error("Access Denied:", err.message);
            alert("คุณไม่มีสิทธิ์เข้าถึงทริปนี้");
            navigate('/'); // เด้งกลับหน้าแรก
        };

        // 3. (แก้ไข) fetch ข้อมูลทริปหลัก (ใส่ headers)
        fetch(`${base_api}/trip_detail?room_id=${room_id}`, { headers: authHeaders }) // <--- เพิ่ม headers
            .then((res) => {
                // --- 4. (เพิ่ม) ตรวจสอบสิทธิ์ ---
                if (!res.ok) {
                    // ถ้าโดน Block (401/403) หรือหาไม่เจอ (404)
                    if (res.status === 401 || res.status === 403 || res.status === 404) {
                        throw new Error('Forbidden: Access Denied'); // โยน Error ให้ .catch()
                    }
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
                // --------------------------
            })
            .then((tripData) => {
                setTrip(tripData);
                setTitle(tripData.title);
                setDescription(tripData.description);

                if (tripData && tripData.start_date && tripData.end_date) {
                    const daysArray = generateTripDays(tripData.start_date, tripData.end_date);

                    // 5. (แก้ไข) ดึง "กิจกรรม" (ใส่ headers)
                    fetch(`${base_api}/itineraries/${room_id}`, { headers: authHeaders }) // <--- เพิ่ม headers
                        .then(res => {
                            if (!res.ok) {
                                alert("คุณไม่มีสิทธิ์เข้าถึงทริปนี้");
                                navigate('/');
                            } // เช็คเผื่อไว้
                            return res.json()
                        })
                        .then(apiActivities => {
                            const populatedDays = daysArray.map(day => {
                                const activitiesForThisDay = apiActivities.filter(
                                    act => act.date === day.real
                                );
                                return { ...day, activities: activitiesForThisDay };
                            });
                            setTrips(populatedDays);
                        })
                        .catch(err => console.error("Error fetching activities:", err));
                }
            })
            .catch((err) => {
                // --- 6. (แก้ไข) catch ที่จะจัดการการเด้งออก ---
                if (err.message.includes('Forbidden')) {
                    handleAuthError(err);
                } else {
                    console.error("Error fetching trip details:", err);
                    // (อาจจะเด้งออกเหมือนกัน ถ้าหาทริปไม่เจอ)
                    handleAuthError(err);
                }
                // --------------------------------------
            });

        document.body.style.backgroundColor = "";
        return () => { document.body.style.backgroundColor = "#f5f5f5"; }

        // 7. (เพิ่ม) ใส่ dependency 
    }, [room_id, base_api, navigate]);

    console.log(trip);
    console.log(totalDays);
    // const startDate = new Date(trip.start_date);
    // const endDate = new Date(trip.end_date);
    // const diffTime = endDate - startDate; // หรือ endDate.getTime() - startDate.getTime()

    // แปลงเป็นวัน
    // const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1; // +1 ถ้าต้องการรวมวันแรกด้วย

    // console.log(diffDays); // 6

    // const trips = [
    //     {
    //         day: 1,
    //         date: "1 ธ.ค.",
    //         activities: [
    //             {
    //                 title: "ถึงสนามบินเชียงใหม่",
    //                 time: "9:00",
    //                 location: "สนามบินนานาชาติเชียงใหม่",
    //                 mapLink: "https://maps.google.com/?q=Chiang+Mai+Airport",
    //                 details: [
    //                     "✈ เดินทางโดยเครื่องบินจากสนามบินสุวรรณภูมิ (BKK) → เชียงใหม่ (CNX)",
    //                     "⏱ ใช้เวลาบินประมาณ 1 ชั่วโมง 15 นาที",
    //                     "🛄 รอรับกระเป๋าและนัดรถตู้ใช้เวลาประมาณ 20 นาที"
    //                 ]
    //             },
    //             {
    //                 title: "กินข้าวกลางวัน ร้านข้าวซอยลุงป้า",
    //                 time: "12:30",
    //                 location: "ถนนเจริญประเทศ",
    //                 mapLink: "https://maps.google.com/?q=Khao+Soi+Lung+Pa+Restaurant",
    //                 details: [
    //                     "🍴 มื้อกลางวันที่ร้านข้าวซอยลุงป้า",
    //                     "⭐ เมนูแนะนำ: ข้าวซอยไก่, ขนมจีนน้ำเงี้ยว",
    //                     "💰 ค่าใช้จ่ายโดยประมาณ: 80–150 บาท/คน",
    //                     "📝 ร้านเล็ก แนะนำไปก่อนเที่ยงเพื่อหลีกเลี่ยงคิว"
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         day: 2,
    //         date: "2 ธ.ค.",
    //         activities: [
    //             {
    //                 title: "วัดพระธาตุดอยสุเทพ",
    //                 time: "10:00",
    //                 location: "สุเทพ, เมืองเชียงใหม่",
    //                 mapLink: "#",
    //                 details: [
    //                     "🚌 เดินทางจากตัวเมืองเชียงใหม่ขึ้นดอยสุเทพ (รถสองแถว/รถตู้)",
    //                     "⏱ ใช้เวลาเดินทางประมาณ 30–40 นาที",
    //                     "💰 ค่าเข้าชม: 30 บาท (ชาวต่างชาติ)",
    //                     "📝 ใช้เวลาเที่ยวและไหว้พระประมาณ 1 ชั่วโมง"
    //                 ]
    //             }
    //         ]
    //     }
    // ];

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
                                    src="https://travel-planner-profile-uploads-ab7bb12a.s3.us-east-1.amazonaws.com/istockphoto-1196083861-612x612.jpg"
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
                        <h1>{title}</h1>
                        <div className={plantemp.planMeta}>
                            <span className={plantemp.planDates}></span>
                            <button className={`${plantemp.btn} ${plantemp.btnSave}`} onClick={() => setEditModalOpen(true)}>
                                <i className="fas fa-edit"></i> แก้ไข
                            </button>
                            <button className={`${tripTemplate.btn} ${tripTemplate.btnShare}`} onClick={() => setShareModalOpen(true)}>
                                <i className="fas fa-share-alt"></i> แชร์
                            </button>
                        </div>
                    </div>
                    <div class={plantemp.info}>
                        <div class={plantemp.container}>
                            <p>{description}</p>
                        </div>
                    </div>
                    <div className={plantemp.planLayout}>
                        <aside className={plantemp.planSidebar}>
                            <div className={`${plantemp.sidebarItem} ${plantemp.active}`}>
                                <i className="fas fa-calendar-alt"></i> กำหนดการเดินทาง
                            </div>
                            <div className={plantemp.sidebarItem} onClick={() => navigate(`/tripBudget?room_id=${room_id}`, {
                                state: {
                                    tripTitle: title,
                                    tripDescription: description,
                                    trip: trip
                                }
                            })}>
                                <i className="fas fa-wallet"></i> งบประมาณ
                            </div>
                            <div className={plantemp.sidebarItem} onClick={() => navigate(`/tripTeam?room_id=${room_id}`, {
                                state: {
                                    tripTitle: title,
                                    tripDescription: description,
                                    trip: trip
                                }
                            })}>
                                <i className="fas fa-users"></i> สมาชิก & แชท
                            </div>
                            <div className={plantemp.sidebarItem} onClick={() => navigate(`/tripFolder?room_id=${room_id}`, {
                                state: {
                                    tripTitle: title,
                                    tripDescription: description,
                                    trip: trip
                                }
                            })}>
                                <i className="fas fa-file-alt"></i> เอกสาร
                            </div>
                        </aside>

                        <div className={styles.planContent}>
                            <div className={styles.itineraryView}>
                                {/* ... อยู่ใน <div className={styles.itineraryView}> ... */}

                                {trips.map((tripDay, idx) => (
                                    <div key={idx} className={styles.itineraryDay}>
                                        <h3 className={styles.dayTitle}>วันที่ {tripDay.day} <span className={styles.dateText}>({tripDay.date})</span></h3>
                                        <div className={styles.dayActivities}>

                                            {/* ▼▼▼ เริ่มแก้ไขตรงนี้ ▼▼▼ */}

                                            {/* 3. วนลูป activities ที่ดึงมาจาก API */}
                                            {tripDay.activities.map((act) => (
                                                <div key={act.itinerary_id} className={styles.activityCard}>
                                                    <div className={styles.activityInfo}>
                                                        <h4>
                                                            <i className="fas fa-plane-arrival"></i> {act.title}{" "}

                                                            {/* 3.1 เช็คว่ามี link map ค่อยแสดงผล */}
                                                            {act.map && (
                                                                <a href={act.map} target="_blank" rel="noopener noreferrer">[แผนที่]</a>
                                                            )}
                                                        </h4>

                                                        {/* 3.2 เช็คว่ามีเวลา/สถานที่ ค่อยแสดงผล */}
                                                        {act.time && <p className={styles.activityTime}>{act.time.substring(0, 5)}</p>}
                                                        {act.location && <p className={styles.activityLocation}>{act.location}</p>}

                                                        <div className={styles.activityDetail}>
                                                            <ul>
                                                                {/* 3.3 วนลูป details จาก Model ที่ include มา */}
                                                                {act.ItineraryDetails && act.ItineraryDetails.map((detail, j) => (
                                                                    <li key={j}>{detail.description}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className={styles.activityActions}>
                                                        <button className={styles.btnEdit} onClick={() => {
                                                            setSelectedActivity(act); // <-- 2. จำว่าแก้ตัวไหน
                                                            setEditActivityModalOpen(true);
                                                        }}>
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className={styles.btnDelete}
                                                            onClick={() => handleDeleteActivity(act.itinerary_id)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* ▲▲▲ สิ้นสุดการแก้ไข ▲▲▲ */}

                                            <button className={styles.btnAddActivity} onClick={() => { setSelectedDate(tripDay.real); setAddActivityModalOpen(true); }}>
                                                <i className="fas fa-plus"></i> เพิ่มกิจกรรม {tripDay.real}
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
                initialData={trip} // <-- ส่งข้อมูลทริปปัจจุบัน
                roomId={room_id}
            />

            {/* Share Modal */}
            <ShareTripModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                roomId={room_id}
            />

            {/* Add Activity Modal */}
            <ActivityTripModal
                type="add"
                open={addActivityModalOpen}
                onClose={() => setAddActivityModalOpen(false)}
                date={selectDate}
                room_id={room_id}
            />

            {/* Edit Activity Modal */}
            <ActivityTripModal
                type="edit"
                open={editActivityModalOpen}
                onClose={() => {
                    setEditActivityModalOpen(false);
                    setSelectedActivity(null); // <-- 3. พอปิดก็เคลียร์ค่า
                }}
                editData={selectedActivity} // <-- 4. ส่งข้อมูลจริงไป
            />
        </>
    );
}
