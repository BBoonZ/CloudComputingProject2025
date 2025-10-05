import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "../css/tripManage.module.css";
import nav from "../css/main-nav.module.css";

export default function TripMainPage() {
    const trips = [
      {
        title: "ทริปตะลุยเชียงใหม่",
        date: "1 - 4 ธันวาคม 2567",
        visited: 12,
        cost: 15000,
        img: "https://picsum.photos/id/1015/400/300",
      },
      {
        title: "เที่ยวทะเลภูเก็ต",
        date: "15 - 18 มกราคม 2568",
        visited: 8,
        cost: 12000,
        img: "https://picsum.photos/id/1025/400/300",
      },
      {
        title: "ทริปตะลุยเชียงใหม่",
        date: "1 - 4 ธันวาคม 2567",
        visited: 12,
        cost: 15000,
        img: "https://picsum.photos/id/1015/400/300",
      },
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
              <p>45,000 บาท</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>🧳 จำนวนทริป</h3>
              <p>5 ทริป</p>
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
                    ไปมาแล้ว {trip.visited} แห่ง · ใช้ไป {trip.cost.toLocaleString()} บาท
                  </div>
                  <div className={styles.tripActions}>
                    <button
                      className={`${styles.btn} ${styles.btnEdit}`}
                      onClick={() => window.location.href = "/tripPlan"}
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



