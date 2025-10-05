import React, { useState } from "react";
import styles from "../css/popup-editTripPlan.module.css"; // นำ CSS มาใช้ในรูปแบบ Module

export default function EditTripModal({ isOpen, onClose }) {
  const [previewSrc, setPreviewSrc] = useState(null);

  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* overlay เบลอพื้นหลัง */}
      <div className={styles.overlayBlur} onClick={onClose}></div>

      {/* modal */}
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalMain}>
            <h2>แก้ไขแผนการเดินทาง</h2>
            <span className={styles.close} onClick={onClose}>&times;</span>
          </div>
          <form>
            <label htmlFor="tripName">ชื่อทริป *</label>
            <input type="text" id="tripName" placeholder="ชื่อทริป..." required />

            <label htmlFor="tripText">รายละเอียดทริป *</label>
            <textarea id="tripText" rows="3" placeholder="ใส่ข้อความ..." required />

            <label htmlFor="tripRange">เลือกวันทริป *</label>
            <input id="tripRange" placeholder="เลือกวันที่เริ่มต้น - สิ้นสุด" required />

            <label htmlFor="tripBudget">งบประมาณ</label>
            <input id="tripBudget" placeholder="งบประมาณ..." />

            <label htmlFor="tripPic">รูปปกทริป</label>
            <input type="file" id="tripPic" accept="image/*" onChange={previewImage} />
            {previewSrc && <img src={previewSrc} alt="Preview" style={{ maxWidth: "150px", padding: "10px" }} />}

            <div style={{ display: "flex" }}>
              <button type="submit" className={styles.btnSaveEdit}>บันทึก</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
