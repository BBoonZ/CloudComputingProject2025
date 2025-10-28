import React, { useState } from "react";
import styles from "../css/ActivityTripModal.module.css";

export default function ActivityModal({
  type = "add",
  open,
  onClose,
  editData = null,
  date = null,
  room_id = null
}) {
  const [activities, setActivities] = useState(
    editData?.details || [{ text: "" }]
  );

  const isEdit = type === "edit";

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

  const handleSubmit = async (e) => { // <-- 1. ต้องเป็น async
    e.preventDefault();

    const data = {
      main: e.target.activityMain.value,
      time: e.target.activityTime.value,
      location: e.target.activityLocation.value,
      locationLink: e.target.activityLocationLink.value,
      details: activities,
      date: date || editData?.date, // <-- 2. ถ้าเป็น edit ให้ใช้ date เดิม
      room_id: room_id
    };

    // 3. Logic แยก ADD / EDIT
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to edit activity');
        }
        
        alert("แก้ไขกิจกรรมสำเร็จ!");
        onClose();
        window.location.reload(); // <-- 4. รีโหลดหน้า (ง่ายที่สุด)

      } catch (err) {
        console.error("Error editing activity:", err);
        alert(`เกิดข้อผิดพลาด: ${err.message}`);
      }

    } else {
      // ########## LOGIC เพิ่ม (ADD) ##########
      // (โค้ดนี้คือตัวเดิมที่เราทำไปแล้ว)
      try {
        const response = await fetch("http://localhost:3001/addActivity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add activity');
        }

        alert("เพิ่มกิจกรรมสำเร็จ!");
        onClose();
        window.location.reload(); // <-- 4. รีโหลดหน้า (ง่ายที่สุด)
        
      } catch (err) {
        console.error("Error adding activity:", err);
        alert(`เกิดข้อผิดพลาด: ${err.message}`);
      }
    }
  };

  if (!open) return null;

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
