
import React, { useState, useEffect } from "react";
import styles from "../css/ActivityTripModal.module.css";

export default function ActivityModal({
  type = "add",
  open,
  onClose,
  editData = null,
  date = null,
  room_id = null
}) {
  const isEdit = type === "edit";

  // 1. ให้ state เริ่มต้นเป็นค่าว่างเสมอ
  const [activities, setActivities] = useState([{ text: "" }]);

  // 2. ▼▼▼ เพิ่ม useEffect ตัวนี้เข้าไป ▼▼▼
  useEffect(() => {
    // 3. เมื่อ Modal เปิด
    if (open) {
      if (isEdit && editData && editData.ItineraryDetails) {
        // 4. ถ้าเป็นโหมด "แก้ไข" และมีข้อมูล
        // แปลง { description: "..." } ไปเป็น { text: "..." }
        const detailsFromData = editData.ItineraryDetails.map(detail => ({
          text: detail.description
        }));

        if (detailsFromData.length > 0) {
          setActivities(detailsFromData);
        } else {
          setActivities([{ text: "" }]); // ถ้ามีกิจกรรม แต่ไม่มี details
        }
        
      } else {
        // 5. ถ้าเป็นโหมด "เพิ่ม" ให้เคลียร์เป็นค่าว่าง
        setActivities([{ text: "" }]);
      }
    }
  }, [open, isEdit, editData]); // 6. ให้ Effect นี้ทำงานทุกครั้งที่ Modal เปิด/ปิด

  
  // (ฟังก์ชัน 3 ตัวนี้ยังเหมือนเดิม)
  const handleAddDetail = () => {
    setActivities([...activities, { text: "" }]);
  };

  const handleDeleteDetail = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index, value) => {
    const newActivities = [...activities];
    newActivities[index].text = value;
    setActivities(newActivities);
  };

  // (handleSubmit ของคุณที่เรารวมโค้ด Add/Edit ไว้แล้ว)
  const handleSubmit = async (e) => { 
    e.preventDefault();

    const data = {
      main: e.target.activityMain.value,
      time: e.target.activityTime.value,
      location: e.target.activityLocation.value,
      locationLink: e.target.activityLocationLink.value,
      details: activities,
      date: isEdit ? editData.date : date, // <-- แก้ไขเล็กน้อย
      room_id: room_id
    };

    if (isEdit) {
      // ########## LOGIC แก้ไข (EDIT) ##########
      if (!editData || !editData.itinerary_id) {
        alert("เกิดข้อผิดพลาด: ไม่พบ ID ของกิจกรรม");
        return;
      }
      try {
        const response = await fetch(`http://localhost:3001/editActivity/${editData.itinerary_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to edit activity');
        alert("แก้ไขกิจกรรมสำเร็จ!");
        onClose();
        window.location.reload(); 
      } catch (err) {
        alert(`เกิดข้อผิดพลาด: ${err.message}`);
      }

    } else {
      // ########## LOGIC เพิ่ม (ADD) ##########
      try {
        const response = await fetch("http://localhost:3001/addActivity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to add activity');
        alert("เพิ่มกิจกรรมสำเร็จ!");
        onClose();
        window.location.reload(); 
      } catch (err) {
        alert(`เกิดข้อผิดพลาด: ${err.message}`);
      }
    }
  };

  if (!open) return null;

  // (โค้ด return ของคุณต่อตรงนี้...)

  return (
    <>
      {/* Blur background */}
      <div className={styles.overlayBlur} onClick={onClose}></div>

      {/* Modal */}
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalMain}>
            <h2>
              {isEdit
                ? `แก้ไขกิจกรรมในวันที่ ${editData?.date || "1 ธ.ค."}`
                : "เพิ่มกิจกรรมในวันที่ 1 ธ.ค."}
            </h2>
            <span className={styles.close} onClick={onClose}>
              &times;
            </span>
          </div>
          <form onSubmit={handleSubmit}>
            <label>กิจกรรม *</label>
            <input
              name="activityMain"
              type="text"
              placeholder="กิจกรรม"
              defaultValue={editData?.title || ""}
              required
            />

            <label>เลือกเวลา *</label>
            <input
              name="activityTime"
              type="time"
              defaultValue={editData?.time || ""}
              required
            />

            <label>สถานที่ *</label>
            <input
              name="activityLocation"
              placeholder="สถานที่"
              defaultValue={editData?.location || ""}
              required
            />

            <label>ลิงค์รายละเอียดสถานที่</label>
            <input
              name="activityLocationLink"
              placeholder="ลิงค์รายละเอียดสถานที่"
              defaultValue={editData?.map || ""}
            />

            <label>รายละเอียดกิจกรรม</label>
            <div
              className={
                isEdit
                  ? styles.editactivityDetails
                  : styles.activityDetails
              }
            >
              {activities.map((activity, index) => (
                <div
                  className={
                    isEdit
                      ? styles.editactivityDeatilsInput
                      : styles.activityDeatilsInput
                  }
                  style={{
                    marginTop: "10px",
                  }}
                  key={index}
                >
                  <input
                    placeholder="รายละเอียดกิจกรรม"
                    value={activity.text}
                    onChange={(e) =>
                      handleDetailChange(index, e.target.value)
                    }
                    style={{
                      width: "90%",
                    }}
                  />
                  <button
                    type="button"
                    className={styles.btnDelete}
                    
                    onClick={() => handleDeleteDetail(index)}
                  >
                    <i className="fa-solid fa-trash"

                    ></i>
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ marginLeft: "auto", padding: "10px", marginTop: "10px" , gap: "20px" ,}}>
                <button
                  type="button"
                  className={styles.btnAddDetails}
                  onClick={handleAddDetail}
                >
                  เพิ่มรายละเอียดกิจกรรม
                </button>
                <button type="submit" className={styles.btnSaveEdit}>
                  บันทึก
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
