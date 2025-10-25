import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "../css/tripManage.module.css";
import nav from "../css/main-nav.module.css";

export default function TripMainPage() {
   const [trips, setTrips] = useState([]);
   const userId = "1";

  useEffect(() => {
    fetch(`http://localhost:3001/trips?user_id=${userId}`)
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
                    src="https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png"
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
            <div className={styles.summaryCard}>
              <h3>🌍 สถานที่ที่ไปแล้ว</h3>
              <p>20 แห่ง</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>💸 งบที่ใช้ไป</h3>
              <p>{totalUsedBudget}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>🧳 จำนวนทริป</h3>
              <p>{totalTrips} ทริป</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>⏳ รวมระยะเวลา</h3>
              <p>18 วัน</p>
            </div>
          </div>
  
          {/* รายการทริป */}
          <div className={styles.tripList}>
            {trips.map((trip, index) => (
              <div key={index} className={styles.tripCard}>
                <div
                  className={styles.tripImage}
                  style={{ backgroundImage: `url(${trip.img})` }}
                />
                <div className={styles.tripContent}>
                  <div className={styles.tripTitle}>{trip.title}</div>
                  <div className={styles.tripDate}>{trip.date}</div>
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



