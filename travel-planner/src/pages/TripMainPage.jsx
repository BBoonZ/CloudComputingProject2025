import React, { useState, useEffect, useRef } from "react"; // <-- เพิ่ม useRef
import { Link, useNavigate } from "react-router-dom";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import styles from "../css/tripMain.module.css"; // <-- CSS หลักสำหรับหน้านี้ (จากไฟล์เพื่อน)
import nav from "../css/main-nav.module.css"; // <-- CSS สำหรับ Navbar (จากไฟล์คุณ)
import modalStyles from "../css/tripModal.module.css"; // <-- *** สร้างไฟล์ CSS ใหม่สำหรับ Modal โดยเฉพาะ ***
import { useAuth } from "../context/AuthContext";
// import axios from "axios"; // ไม่ต้องใช้ ถ้าใช้ tripService
import { tripService } from '../services/tripService'; // <-- Service ของเพื่อน
import SearchBar from '../components/SearchBar';     // <-- Component ของเพื่อน
import SortBar from '../components/SortBar';         // <-- Component ของเพื่อน

// --- S3 Imports (เตรียมไว้เผื่อทำ Upload รูป) ---
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export default function TripMainPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // <-- จากไฟล์เพื่อน

  // --- State จากไฟล์เพื่อน (แสดงผล, ค้นหา, จัดเรียง) ---
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [filters, setFilters] = useState({});
  const [isFilterVisible, setIsFilterVisible] = useState(true); // เพื่อนอาจจะพิมพ์ผิด ควรเป็น isFilterVisible

  // --- State จากไฟล์คุณ (Modal สร้างทริป) ---
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null); // URL สำหรับ preview รูป
  // State เก็บข้อมูลฟอร์ม Modal (แยก object ชัดเจน)
  const [newTripData, setNewTripData] = useState({
    name: "",
    detail: "",
    start_date: "",
    end_date: "",
    budget: "",
    image: null // จะเก็บเป็น URL จาก S3 หรือ Base64 ชั่วคราว
  });
  // State สำหรับ File object (ถ้าจะทำ S3 Upload)
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [uploading, setUploading] = useState(false);
  // const fileInputRef = useRef();

  // --- Function เปิด/ปิด Modal (จากไฟล์คุณ) ---
  const openModal = () => {
    // Reset form data when opening
    setNewTripData({ name: "", detail: "", start_date: "", end_date: "", budget: "", image: null });
    setPreview(null);
    // setSelectedFile(null); // Reset file selection
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    // ไม่ต้อง reset state ที่นี่ เพราะ openModal ทำแล้ว
  };

  // --- Function Preview รูป (จากไฟล์คุณ, ปรับปรุงเล็กน้อย) ---
  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewTripData({ ...newTripData, image: file });
      // setSelectedFile(file); // <-- เก็บ File object (ถ้าจะทำ S3)
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result); // ใช้สำหรับแสดง preview
        // ถ้าไม่ทำ S3 ตอนนี้ อาจจะส่ง base64 ไปเลย (แต่ไม่แนะนำสำหรับไฟล์ใหญ่)
        // setNewTripData({ ...newTripData, image: reader.result });
      }
      reader.readAsDataURL(file);
    } else {
      // setSelectedFile(null);
      setPreview(null);
      // setNewTripData({ ...newTripData, image: null });
    }
  };

  // --- Function สร้างทริป (จากไฟล์คุณ, **ใช้ Fetch ตรงไปก่อน**) ---
  // *** TODO: ควรเปลี่ยนไปใช้ tripService และใส่ Logic S3 Upload ***
  //   const createTrip = async (e) => {
  //     e.preventDefault(); // <-- ต้องมี e.preventDefault() ใน onSubmit
  //     // setUploading(true); // <-- ถ้าทำ S3
  //     const userData = JSON.parse(localStorage.getItem('userData'));

  // // ดึง user_id
  //     const userId = userData?.user_id;
  //     // --- ส่วน S3 Upload (ยังไม่ใส่) ---
  //     let imageUrlToSend = null; // <-- ค่าเริ่มต้นคือไม่มีรูป
  //     // if (selectedFile) { ... upload to S3 ... imageUrlToSend = s3Url; }
  //     // else { ... }
  //     // --------------------------------

  //     try {
  //       // เตรียมข้อมูลจาก State newTripData
  //       const dataToSend = {
  //         name: newTripData.name,
  //         detail: newTripData.detail,
  //         start_date: newTripData.start_date, // จาก flatpickr
  //         end_date: newTripData.end_date,   // จาก flatpickr
  //         budget: newTripData.budget === '' ? null : newTripData.budget, // ส่ง null ถ้าว่าง
  //         image: imageUrlToSend, // <-- ส่ง URL จาก S3 (ตอนนี้เป็น null)
  //         user_id: userId
  //       };

  //       // ใช้ Base URL ถ้าตั้งค่าไว้
  //       const apiUrl = 'http://localhost:3001';

  //       const res = await fetch(`${apiUrl}/createplan`, { // <-- เรียก Endpoint สร้างทริป
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(dataToSend),
  //       });

  //       if (!res.ok) {
  //         const errorData = await res.json();
  //         throw new Error(errorData.message || 'Failed to create trip');
  //       }

  //       const data = await res.json();
  //       console.log("✅ Trip created:", data);
  //       alert("สร้างทริปสำเร็จ!");
  //       closeModal(); // ปิด Modal
  //       fetchTrips(); // <-- ✨ สำคัญ: เรียก fetchTrips ใหม่เพื่อโหลดรายการล่าสุด!

  //     } catch (err) {
  //       console.error("❌ Error creating plan:", err);
  //       alert(`เกิดข้อผิดพลาดในการสร้างทริป: ${err.message}`);
  //     } finally {
  //       // setUploading(false); // <-- ถ้าทำ S3
  //     }
  //   };

  const createTrip = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData?.user_id;

    // 1. สร้าง FormData object
    const formData = new FormData();

    // 2. ใส่ข้อมูล Text ทั้งหมดลงไป
    formData.append('name', newTripData.name);
    formData.append('detail', newTripData.detail);
    formData.append('start_date', newTripData.start_date);
    formData.append('end_date', newTripData.end_date);
    formData.append('budget', newTripData.budget === '' ? null : newTripData.budget);
    formData.append('user_id', userId);

    // 3. ใส่ File object ลงไป (ถ้ามี)
    // Backend ของคุณจะมองหาไฟล์นี้ด้วย key 'image'
    if (newTripData.image) {
      formData.append('image', newTripData.image);
    }

    // setUploading(true); // <-- เอามาไว้ตรงนี้ถ้าจะใช้

    try {
      const apiUrl = process.env.REACT_APP_API_URL;

      const res = await fetch(`${apiUrl}/createplan`, {
        method: "POST",
        // 4. ลบ headers: { "Content-Type": "application/json" } ออก
        //    Browser จะตั้งค่า Content-Type เป็น 'multipart/form-data' ให้เอง

        // 5. ส่ง formData ทั้งก้อนเป็น body
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create trip');
      }

      const data = await res.json();
      console.log("✅ Trip created:", data);
      alert("สร้างทริปสำเร็จ!");
      closeModal();
      fetchTrips();

    } catch (err) {
      console.error("❌ Error creating plan:", err);
      alert(`เกิดข้อผิดพลาดในการสร้างทริป: ${err.message}`);
    } finally {
      // setUploading(false); 
    }
  };



  // --- Function ดึงข้อมูลทริป (จากไฟล์เพื่อน, ปรับปรุงเล็กน้อย) ---
  const fetchTrips = async (sort = sortBy, order = sortOrder, currentFilters = filters, query = searchQuery) => {
    setLoading(true); // <-- เริ่ม Loading ทุกครั้งที่ fetch
    setError(null);   // <-- เคลียร์ Error เก่า
    try {
      // ใช้ tripService ที่เพื่อนทำไว้
      const response = await tripService.getPublicTrips({
        sortBy: sort,
        order,
        ...currentFilters,
        search: query // ส่ง query parameter ชื่อ 'search' (หรือตามที่ Backend กำหนด)
      });
      if (response.status === 'success') {
        setTrips(response.data); // เก็บข้อมูลดิบ
        setFilteredTrips(response.data); // แสดงผล (อาจจะปรับปรุง logic filter ทีหลัง)
      } else {
        throw new Error(response.message || 'Failed to fetch trips');
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      setError('ไม่สามารถโหลดข้อมูลทริปได้: ' + error.message);
      setTrips([]); // เคลียร์ข้อมูลถ้า Error
      setFilteredTrips([]);
    } finally {
      setLoading(false); // <-- หยุด Loading เสมอ
    }
  };

  // --- useEffect ดึงข้อมูลครั้งแรก (จากไฟล์เพื่อน, ปรับปรุง) ---
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/login'); // Redirect ถ้ายังไม่ Login
  //     return; // หยุดการทำงาน
  //   }
  //   fetchTrips(); // เรียก fetch ตอน Component โหลด
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuthenticated, navigate]); // ทำงานเมื่อสถานะ Login เปลี่ยน

  // --- Handlers สำหรับ Search, Sort, Filter (จากไฟล์เพื่อน) ---
  const handleSearch = (query) => {
    setSearchQuery(query);
    // อาจจะ debounce search หรือ trigger fetch ที่นี่
    fetchTrips(sortBy, sortOrder, filters, query); // เรียก fetch ใหม่เมื่อ search
  };

  const handleSort = (value) => {
    setSortBy(value);
    fetchTrips(value, sortOrder, filters, searchQuery); // เรียก fetch ใหม่
  };

  const handleOrderChange = (value) => {
    setSortOrder(value);
    fetchTrips(sortBy, value, filters, searchQuery); // เรียก fetch ใหม่
  };

  const handleFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchTrips(sortBy, sortOrder, newFilters, searchQuery); // เรียก fetch ใหม่
  };

  // --- Function Format วันที่ (จากไฟล์เพื่อน) ---
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    try {
      return new Date(dateString).toLocaleDateString("th-TH", options);
    } catch (e) {
      return dateString; // Return original if invalid
    }
  };

  // --- useEffect สำหรับ Flatpickr **ใน Modal** (จากไฟล์คุณ, ปรับปรุง) ---
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
          setNewTripData({
            ...newTripData,
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
  }, [showModal]); // <-- ให้ Effect ทำงานเมื่อ showModal เปลี่ยน

  // --- JSX ---
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
              <li><button className={nav.btnback} onClick={openModal}>สร้างแผนการเดินทาง</button></li>
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

      {/* Main Content (จากไฟล์เพื่อน) */}
      <main className={styles.dashboardMain}>
        <div className={styles.container}>
          {/* Header ของ Section (อาจจะปรับปรุงตามไฟล์เพื่อน) */}
          <header className={styles.header}>
            <h1>ทริปแนะนำ / ค้นหาแรงบันดาลใจ</h1>
            {/* อาจจะไม่มีปุ่มสร้างตรงนี้แล้ว เพราะไปอยู่บน Navbar */}
          </header>

          {/* Search & Sort Bars (จากไฟล์เพื่อน) */}
          <SearchBar onSearch={handleSearch} />
          <SortBar
            onSort={handleSort}
            onOrderChange={handleOrderChange}
            onFilter={handleFilter}
            isVisible={isFilterVisible}
            onToggleVisibility={() => setIsFilterVisible(!isFilterVisible)}
          />

          {/* Trip Grid Section */}
          <section className={styles.tripsSection}>
            {loading && <div className={styles.loading}>กำลังโหลดทริป...</div>}
            {error && <div className={styles.error}>{error}</div>}

            {/* แสดง Grid เมื่อโหลดเสร็จและไม่มี Error */}
            {!loading && !error && (
              <div className={styles.tripsGrid}>
                {filteredTrips.length === 0 && <p>ไม่พบทริปที่ตรงเงื่อนไข</p>}
                {filteredTrips.map((trip) => (
                  // ใช้โครงสร้าง Card จากไฟล์เพื่อน (TripMainPage2.jsx)
                  <div
                    key={trip.room_id}
                    className={styles.tripCard}
                    // อาจจะเอารูป Background ออกถ้าอยากให้เหมือนไฟล์แรก
                    style={{ backgroundImage: `url(${trip.image || 'default-image.jpg'})` }}
                    onClick={() => navigate(`/tripPlanInfo?room_id=${trip.room_id}`)} // <-- พาไปหน้า Info ก่อน
                  >
                    <div className={styles.tripContent}>
                      <div className={styles.tripHeader}>
                        <h2>{trip.title}</h2>
                        <span className={styles.dates}>
                          {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                        </span>
                      </div>
                      {/* อาจจะเพิ่ม Description */}
                      {/* <p className={styles.description}>{trip.description}</p> */}
                      {/* แสดง Owner (ถ้า API ส่งมา) */}
                      {/* <div className={styles.ownerInfo}> ... </div> */}
                      {/* แสดง Budget (ถ้า API ส่งมา) */}
                      {/* <div className={styles.tripFooter}> ... </div> */}
                      {/* ปุ่ม (อาจจะเปลี่ยน Link หรือ Action) */}
                      <div className={styles.tripActions}>
                        <button className={`${styles.btn} ${styles.btnSecondary}`}>ดูรายละเอียด</button>
                        {/* ปุ่ม Copy อาจจะต้องใช้ Logic เพิ่ม */}
                        {/* <button className={`${styles.btn} ${styles.btnCopy}`}>เพิ่มเข้าแผน</button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal สร้างทริป (จากไฟล์คุณ, ใช้ CSS ใหม่) */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-main">
              <h2>สร้างแผนการเดินทาง</h2>
              <span className="close" onClick={closeModal}>&times;</span>
            </div>

            <form>
              <label>ชื่อทริป *</label>
              <input type="text" placeholder="ชื่อทริป..." value={newTripData.name} onChange={(e) => setNewTripData({ ...newTripData, name: e.target.value })} required />

              <label>รายละเอียด *</label>
              <textarea rows="3" placeholder="ใส่ข้อความ..." value={newTripData.detail} onChange={(e) => setNewTripData({ ...newTripData, detail: e.target.value })} required />

              <label>เลือกวันทริป *</label>
              <input id="tripRange" placeholder="เลือกวันที่เริ่มต้น - สิ้นสุด" required />
              <label>งบประมาณ</label>
              <input placeholder="งบประมาณ..." value={newTripData.budget} onChange={(e) => setNewTripData({ ...newTripData, budget: e.target.value })} />

              <label>รูปปกทริป</label>
              <input type="file" accept="image/*" onChange={previewImage} />

              {preview && <img src={preview} alt="preview" className="preview-img" />}

              <button type="submit" className="btn-save-edit" onClick={createTrip}>ยืนยัน</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}