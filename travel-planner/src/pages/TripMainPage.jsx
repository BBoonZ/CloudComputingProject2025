import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import styles from "../css/tripMain.module.css";
import nav from "../css/main-nav.module.css";
// import e from "cors";

export default function TripMainPage() {
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState(null);
    const [tripdata, setTripData] = useState(null)

    const openModal = () => { setTripData({ name: "", detail: "", start_date: "",end_date: "", budget: "", image: null, }); setShowModal(true);};
    const closeModal = () => {
        setShowModal(false);
        setPreview(null);
        setTripData(null);
    };

    const previewImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
            setTripData({ ...tripdata, image: reader.result });
        }
    };

    const createTrip = async () => {
  try {
    const res = await fetch("http://localhost:3001/createplan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tripdata),
    });
    const data = await res.json();
    console.log("Trip created:", data);
    setShowModal(false);  // ปิด modal
    setTripData({ name: "", detail: "", start_date: "", end_date: "", budget: "", image: null }); // รีเซ็ต state
    setPreview(null);  // รีเซ็ต preview
  } catch (err) {
    console.error(err);
  }
};
    useEffect(() => {
        flatpickr("#tripRange", {
  mode: "range",
  dateFormat: "Y-m-d",
  minDate: "today",
  locale: "th",
  onClose: function (selectedDates, dateStr, instance) {
    if (selectedDates.length === 2) {
      const start = selectedDates[0];
      const end = selectedDates[1];

      // เก็บเป็น ISO date ให้ backend
      setTripData({
        ...tripdata,
        start_date: start.toISOString().split("T")[0], // "YYYY-MM-DD"
        end_date: end.toISOString().split("T")[0],     // "YYYY-MM-DD"
      });

      // สร้างข้อความ display ไทยเหมือนเดิม
      const monthsTH = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
      ];

      const dayStart = start.getDate();
      const monthStart = monthsTH[start.getMonth()];
      const yearStart = start.getFullYear() + 543;

      const dayEnd = end.getDate();
      const monthEnd = monthsTH[end.getMonth()];
      const yearEnd = end.getFullYear() + 543;

      let displayText = "";
      if (monthStart === monthEnd && yearStart === yearEnd) {
        displayText = `${dayStart} - ${dayEnd} ${monthStart} ${yearStart}`;
      } else {
        displayText = `${dayStart} ${monthStart} ${yearStart} - ${dayEnd} ${monthEnd} ${yearEnd}`;
      }

      instance.input.value = displayText;
    }
  }
});
        }, [showModal]);

    // useEffect(() => {
    //     const monthsTH = [
    //         "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    //         "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    //     ];

    //     flatpickr("#tripRange", {
    //         mode: "range",
    //         dateFormat: "Y-m-d",
    //         minDate: "today",
    //         locale: "th",
    //         onClose: function (selectedDates, dateStr, instance) {
    //             if (selectedDates.length === 2) {
    //                 const start = selectedDates[0];
    //                 const end = selectedDates[1];

    //                 const dayStart = start.getDate();
    //                 const monthStart = monthsTH[start.getMonth()];
    //                 const yearStart = start.getFullYear() + 543;

    //                 const dayEnd = end.getDate();
    //                 const monthEnd = monthsTH[end.getMonth()];
    //                 const yearEnd = end.getFullYear() + 543;

    //                 let displayText = "";
    //                 if (monthStart === monthEnd && yearStart === yearEnd) {
    //                     displayText = `${dayStart} - ${dayEnd} ${monthStart} ${yearStart}`;
    //                 } else {
    //                     displayText = `${dayStart} ${monthStart} ${yearStart} - ${dayEnd} ${monthEnd} ${yearEnd}`;
    //                 }

    //                 instance.input.value = displayText;
    //             }
    //         }
    //     });
    // }, [showModal]);

    return (
        <>
            {/* Header */}
            <header className={nav.header}>
                <div className={nav.container}>
                    <div className={nav.logo}>
                        <Link to="/tripMain">Travel Planner Pro ✈️</Link>
                    </div>
                    <nav className={nav.mainNav}>
                        <ul>
                            <li><Link to="/tripMain">หน้าหลัก</Link></li>
                            <li><Link to="/tripManage">แผนการเดินทางของฉัน</Link></li>
                            <li><button className={nav.btnback} onClick={openModal}>สร้างแผนการเดินทาง</button></li>
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
            <main className={styles.dashboardMain}>
                <div className={styles.container}>
                    <section className={styles.tripsSection}>
                        <h2>ค้นหาแรงบันดาลใจจากทริปยอดนิยม</h2>

                        <div className={styles.searchBar}>
                            <input type="text" placeholder="ค้นหาทริป, สถานที่ หรือผู้ใช้งาน..." />
                        </div>

                        <div className={styles.tripsGrid}>
                            {[
                                {
                                    img: "https://aem-all.accor.com/content/dam/destinations/asia-and-middle-east/th/chiang-mai/doi-inthanon-mountain-chiang-mai-thailand.jpg",
                                    title: "ทริปตะลุยเชียงใหม่ 4 วัน 3 คืน",
                                    by: "Jane Doe",
                                    people: 4,
                                    places: 12,
                                },
                                {
                                    img: "https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/bltc1564bc44f66a900/675e1262cbd7d6bc5f15c6b0/japan-725347-Header_Mobile.jpg?format=webp&auto=avif&quality=60&crop=1%3A1&width=425",
                                    title: "Tokyo Solo Trip 7 Days",
                                    by: "John Smith",
                                    people: 1,
                                    places: 15,
                                },
                                {
                                    img: "https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/bltc1564bc44f66a900/675e1262cbd7d6bc5f15c6b0/japan-725347-Header_Mobile.jpg?format=webp&auto=avif&quality=60&crop=1%3A1&width=425",
                                    title: "Tokyo Solo Trip 7 Days",
                                    by: "John Smith",
                                    people: 1,
                                    places: 15,
                                },
                            ].map((trip, i) => (
                                <div key={i} className={styles.tripCard}>
                                    <img src={trip.img} alt={trip.title} className={styles.tripImage} />
                                    <div className={styles.tripInfo}>
                                        <h3>{trip.title}</h3>
                                        <div className={styles.tripMeta}>
                                            <span>โดย {trip.by}</span>
                                            <span>👥 {trip.people} คน</span>
                                            <span>📍 {trip.places} แห่ง</span>
                                        </div>
                                        <div className={styles.tripActions}>
                                            <Link to="/tripPlanInfo" className={`${styles.btn} ${styles.btnSecondary}`}>ดูรายละเอียด</Link>
                                            <Link to="/tripManage" className={`${styles.btn} ${styles.btnCopy}`}>เพิ่มเข้าแผนของฉัน</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-main">
                            <h2>สร้างแผนการเดินทาง</h2>
                            <span className="close" onClick={closeModal}>&times;</span>
                        </div>

                        <form>
                            <label>ชื่อทริป *</label>
                            <input type="text" placeholder="ชื่อทริป..." value={tripdata.name} onChange={(e) => setTripData({ ...tripdata, name: e.target.value })} required />

                            <label>รายละเอียด *</label>
                            <textarea rows="3" placeholder="ใส่ข้อความ..." value={tripdata.detail} onChange={(e) => setTripData({...tripdata, detail: e.target.value})} required />

                            <label>เลือกวันทริป *</label>
                           <input id="tripRange" placeholder="เลือกวันที่เริ่มต้น - สิ้นสุด" required />
                            <label>งบประมาณ</label>
                            <input placeholder="งบประมาณ..." value={tripdata.budget} onChange={(e) => setTripData({...tripdata, budget: e.target.value})}/>

                            <label>รูปปกทริป</label>
                            <input type="file" accept="image/*"  onChange={previewImage} />

                            {preview && <img src={preview} alt="preview" className="preview-img" />}

                            <button type="submit" className="btn-save-edit" onClick={createTrip}>ยืนยัน</button>
                        </form>
                    </div>
                </div>
            )}

        </>
    );
}