import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "../css/tripManage.module.css";
import nav from "../css/main-nav.module.css";

export default function TripMainPage() {
  const calculateTripDays = (startDate, endDate) => {
  // 1. ตรวจสอบว่ามีข้อมูลครบไหม
  if (!startDate || !endDate) {
    return 0; // หรือ '?' หรือจัดการตามที่ต้องการ
  }

  // 2. แปลง string เป็น Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 3. หาผลต่างเป็น milliseconds
  const diffTime = end.getTime() - start.getTime();

  // 4. แปลง milliseconds เป็น วัน
  // (1000ms * 60s * 60min * 24hr)
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // 5. บวก 1 เพราะเรานับวันแรกด้วย!
  // (เช่น 29 ต.ค. - 30 ต.ค. คือ 2 วัน, แต่ผลต่างคือ 1)
  return diffDays + 1; 
};
   const [trips, setTrips] = useState([]);
   const userData = JSON.parse(localStorage.getItem('userData'));

// ดึง user_id
    const userId = userData?.user_id;
    const base_api = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${base_api}/trips?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((err) => console.error(err));
  }, []);

  console.log(trips);
  const totalUsedBudget = trips.reduce((sum, trip) => {
    const budget = parseFloat(trip.total_budget) || 0;
    return sum + budget;
  }, 0);

  const totalTrips = trips.length;
  
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
                    onClick={() => (window.location.href = "/user")}
                  />
                </li>
              </ul>
            </nav>
          </div>
        </header>
  
        <main className={styles.tripMain}>
          <h1 className={styles.pageTitle}>ทริปการท่องเที่ยวของฉัน</h1>
  
          {/* สรุปข้อมูล */}
          <div className={styles.tripSummary}>
            {/* <div className={styles.summaryCard}>
              <h3>🌍 สถานที่ที่ไปแล้ว</h3>
              <p>20 แห่ง</p>
            </div> */}
            <div className={styles.summaryCard}>
              <h3>💸 งบที่ใช้ไป</h3>
              <p>{totalUsedBudget}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>🧳 จำนวนทริป</h3>
              <p>{totalTrips} ทริป</p>
            </div>
            {/* <div className={styles.summaryCard}>
              <h3>⏳ รวมระยะเวลา</h3>
              <p>18 วัน</p>
            </div> */}
          </div>
  
          {/* รายการทริป */}
          <div className={styles.tripList}>
            {trips.map((trip, index) => (
              <div key={index} className={styles.tripCard}>
                <div
                  className={styles.tripImage}
                  style={{ backgroundImage: `url(${trip.image})` }}
                />
                <div className={styles.tripContent}>
                  <div className={styles.tripTitle}>{trip.title}</div>
                  <div className={styles.tripDate}>{trip.description}</div>
                  <div className={styles.tripDate}>ระยะเวลา {calculateTripDays(trip.start_date, trip.end_date)} วัน</div>
                  <div className={styles.tripMeta}>
                    งบประมาณ {trip.total_budget.toLocaleString()} บาท
                  </div>
                  <div className={styles.tripActions}>
                    <button
                      className={`${styles.btn} ${styles.btnEdit}`}
                      onClick={() => window.location.href = `/tripPlan?room_id=${trip.room_id}`}
                    >
                      <i className="fas fa-edit"></i> จัดการ
                    </button>
                    <button className={`${styles.btn} ${styles.btnDelete}`}>
                      <i className="fas fa-trash"></i> ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </>
    );
  }



