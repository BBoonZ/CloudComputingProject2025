import React, { useState, useEffect, useRef } from "react"; // <-- เพิ่ม useEffect, useRef
import { useNavigate,useLocation } from "react-router-dom";
import styles from "../css/popup-editTripPlan.module.css";
import flatpickr from "flatpickr"; // <-- Import flatpickr
import "flatpickr/dist/flatpickr.min.css"; // <-- Import CSS ของ flatpickr

// 1. รับ Props เพิ่ม: initialData, roomId
export default function EditTripModal({ isOpen, onClose, initialData, roomId }) {
  const navigate = useNavigate();
  // 2. ใช้ State เก็บค่าในฟอร์ม
  const [tripName, setTripName] = useState("");
  const [tripText, setTripText] = useState("");
  // const [tripRange, setTripRange] = useState(""); // ไม่ต้องใช้ state นี้แล้ว
  const [startDate, setStartDate] = useState(""); // State สำหรับส่งค่า YYYY-MM-DD
  const [endDate, setEndDate] = useState("");     // State สำหรับส่งค่า YYYY-MM-DD
  const [tripBudget, setTripBudget] = useState("");
  const [tripPicFile, setTripPicFile] = useState(null); // State สำหรับ File object (ถ้าจะทำอัปโหลด)
  const [previewSrc, setPreviewSrc] = useState(null); // State สำหรับ URL รูป (เดิม หรือ preview ใหม่)
  const flatpickrInstance = useRef(null); // Ref สำหรับเก็บ instance ของ flatpickr
  const base_api = process.env.REACT_APP_API_URL;
  const location = useLocation();
  // 3. ใช้ useEffect เพื่อ Populate ข้อมูล & ตั้งค่า flatpickr ตอน Modal เปิด
  useEffect(() => {
    // ทำงานเฉพาะตอน Modal เปิด (isOpen = true)
    if (isOpen) {
      if (initialData) {
        // --- Populate ข้อมูลลง State ---
        setTripName(initialData.title || "");
        setTripText(initialData.description || "");
        // แปลง null เป็น string ว่าง เพื่อให้ input แสดงผลถูก
        setTripBudget(initialData.total_budget == null ? "" : initialData.total_budget);
        setPreviewSrc(initialData.image || null); // แสดงรูปเดิม (ถ้ามี)
        setStartDate(initialData.start_date || "");
        setEndDate(initialData.end_date || "");
        setTripPicFile(null); // เคลียร์ไฟล์ที่เลือกค้างไว้ (ถ้ามี)

        // --- ตั้งค่า flatpickr ---
        // ทำลาย instance เก่า (ถ้ามี) ก่อนสร้างใหม่
        if (flatpickrInstance.current) {
            flatpickrInstance.current.destroy();
        }

        // สร้าง instance ใหม่ และเก็บไว้ใน ref
        flatpickrInstance.current = flatpickr("#editTripRange", { // <-- ใช้ ID เฉพาะสำหรับ Modal นี้
          mode: "range",
          dateFormat: "Y-m-d",
          defaultDate: (initialData.start_date && initialData.end_date) ? [initialData.start_date, initialData.end_date] : [], // <-- ใส่ค่าเริ่มต้น (ถ้ามี)
          minDate: "today",
          locale: { // ใช้ locale object สำหรับภาษาไทย
            firstDayOfWeek: 1, // Monday
            weekdays: {
              shorthand: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
              longhand: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
            },
            months: {
              shorthand: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
              longhand: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
            },
            rangeSeparator: ' ถึง ',
          },
          onChange: function(selectedDates) { // ใช้ onChange ดีกว่า onClose สำหรับ range mode
            if (selectedDates.length === 2) {
              const start = selectedDates[0];
              const end = selectedDates[1];
              setStartDate(start.toISOString().split("T")[0]); // อัปเดต state YYYY-MM-DD
              setEndDate(end.toISOString().split("T")[0]);     // อัปเดต state YYYY-MM-DD
            } else if (selectedDates.length === 0) {
              // ถ้าผู้ใช้เคลียร์วันที่
              setStartDate("");
              setEndDate("");
            }
          }
        });

      } else {
        // กรณีไม่มี initialData (ไม่ควรเกิด แต่ใส่ไว้กันเหนียว)
        setTripName("");
        setTripText("");
        setTripBudget("");
        setPreviewSrc(null);
        setStartDate("");
        setEndDate("");
        setTripPicFile(null);
        if (flatpickrInstance.current) {
            flatpickrInstance.current.destroy(); // ทำลาย instance เก่า
            flatpickrInstance.current = null;
        }
      }
    } else {
        // ตอน Modal ปิด: ทำลาย flatpickr instance
        if (flatpickrInstance.current) {
            flatpickrInstance.current.destroy();
            flatpickrInstance.current = null;
        }
    }

    // Cleanup function: ทำลาย flatpickr instance เมื่อ component unmount
    return () => {
        if (flatpickrInstance.current) {
            flatpickrInstance.current.destroy();
            flatpickrInstance.current = null;
        }
    };

  }, [isOpen, initialData]); // ให้ Effect ทำงานเมื่อ Modal เปิด/ปิด หรือข้อมูลเปลี่ยน


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setTripPicFile(file); // เก็บ File object ไว้ (สำหรับอัปโหลด S3)
      const reader = new FileReader();
      reader.onload = (e) => setPreviewSrc(e.target.result); // แสดง preview ใหม่
      reader.readAsDataURL(file);
    } else {
      // ถ้าผู้ใช้กด cancel, กลับไปใช้รูปเดิม (ถ้ามี) หรือ null
      setTripPicFile(null);
      setPreviewSrc(initialData?.image || null);
    }
  };

  // 4. สร้างฟังก์ชัน handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ----- TODO: Logic Upload รูปภาพใหม่ (ถ้ามี tripPicFile) -----
    // 1. ถ้า tripPicFile ไม่ใช่ null:
    // 2.   อัปโหลด tripPicFile ไป S3 (เหมือนใน UserPage.jsx หรือ TripMainPage.jsx)
    // 3.   เอา URL ที่ได้จาก S3 มาใส่ใน imageUrlForUpdate
    // 4. ถ้า tripPicFile เป็น null:
    // 5.   ใช้ previewSrc (ซึ่งคือ URL รูปเดิม) เป็น imageUrlForUpdate
    // ----- จบส่วน TODO -----
    let imageUrlForUpdate = previewSrc; // <-- ใช้ URL รูปเดิมไปก่อน (ชั่วคราว)

    // ตรวจสอบว่าเลือกวันที่ครบหรือยัง
    if (!startDate || !endDate) {
        alert("กรุณาเลือกวันที่เริ่มต้นและสิ้นสุด");
        return; // หยุดการทำงานถ้าวันที่ไม่ครบ
    }


    const updateData = {
      title: tripName,
      description: tripText,
      // ส่ง budget เป็น null ถ้าเป็น string ว่าง
      total_budget: tripBudget === '' ? null : tripBudget,
      start_date: startDate,
      end_date: endDate,
      image: imageUrlForUpdate // <-- ใส่ URL จริงจาก S3 ตรงนี้
    };

    try {
      const response = await fetch(`${base_api}/editTrip/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update trip');
      }

      alert("แก้ไขข้อมูลทริปสำเร็จ!");
      onClose(); // ปิด Modal
      const targetPath = `/tripPlan?room_id=${roomId}`;

      // 2. เช็คว่า "หน้าปัจจุบัน" ตรงกับ "หน้าเป้าหมาย" หรือไม่
      if (location.pathname + location.search === targetPath) {
        
        // 3. ถ้าใช่ (อยู่ที่ /tripPlan อยู่แล้ว) -> สั่ง F5
        window.location.reload();

      } else {
        
        // 4. ถ้าไม่ใช่ (เช่น อยู่ที่ /tripBudget) -> สั่งเด้งไป
        navigate(targetPath);
      }
      // navigate(`/tripPlan?room_id=${roomId}`);// <-- รีโหลดเพื่อให้หน้าหลักเห็นข้อมูลใหม่

    } catch (err) {
      console.error("❌ Error updating trip:", err);
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };


  if (!isOpen) return null; // ไม่ต้อง Render อะไรเลยถ้า Modal ปิดอยู่

  return (
    <>
      {/* Overlay เบลอพื้นหลัง */}
      <div className={styles.overlayBlur} onClick={onClose}></div>

      {/* Modal */}
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalMain}>
            <h2>แก้ไขแผนการเดินทาง</h2>
            <span className={styles.close} onClick={onClose}>&times;</span>
          </div>
          {/* 5. ผูก onSubmit กับ handleSubmit */}
          <form onSubmit={handleSubmit}>
            <label htmlFor="tripName">ชื่อทริป *</label>
            {/* 6. ใช้ value และ onChange กับ State */}
            <input
              type="text"
              id="tripName"
              placeholder="ชื่อทริป..."
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              required
            />

            <label htmlFor="tripText">รายละเอียดทริป *</label>
            <textarea
              id="tripText"
              rows="3"
              placeholder="ใส่ข้อความ..."
              value={tripText}
              onChange={(e) => setTripText(e.target.value)}
              required
            />

            <label htmlFor="editTripRange">เลือกวันทริป *</label>
            {/* 7. ใช้ ID ใหม่สำหรับ input วันที่ */}
            <input
              id="editTripRange" // <-- ID ใหม่
              placeholder="เลือกวันที่เริ่มต้น - สิ้นสุด"
              required
              readOnly // ให้ flatpickr จัดการอย่างเดียว
              style={{backgroundColor: "#fff"}} // ทำให้ดูเหมือน input ปกติ
            />

            <label htmlFor="tripBudget">งบประมาณ</label>
            <input
              id="tripBudget"
              type="number" // <-- ควรเป็น number
              step="any" // อนุญาตทศนิยม
              placeholder="งบประมาณ..."
              value={tripBudget}
              onChange={(e) => setTripBudget(e.target.value)}
            />

            <label htmlFor="tripPic">รูปปกทริป</label>
            <input
               type="file"
               id="tripPic"
               accept="image/*"
               onChange={handleImageChange} // <-- ใช้ handleImageChange
            />
            {/* แสดง preview จาก state */}
            {previewSrc && <img src={previewSrc} alt="Preview" style={{ maxWidth: "150px", padding: "10px", display: 'block' }} />}

            <div style={{ display: "flex", justifyContent: 'flex-end', marginTop: '20px' }}> {/* จัดปุ่มไปขวา */}
              <button type="submit" className={styles.btnSaveEdit}>บันทึกการแก้ไข</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}