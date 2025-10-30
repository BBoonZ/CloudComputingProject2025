import React, { useState } from "react";
import styles from "../css/tripBudget.module.css";

const API_URL = process.env.REACT_APP_API_URL;

const BudgetModal = ({
    type = "add", // "add" หรือ "edit"
    show,
    onClose,
    onSubmit,
    initialData = {},
    room_id,
    teamMembers
}) => {
    if (!show) return null;

    const isEdit = type === "edit";

    const handleSave = async () => {
    // ดึงค่าจาก form
    const description = document.getElementById("budgetItem").value;
    const type = document.getElementById("budgetCategory").value;
    const member_id = document.getElementById("budgetPaidBy").value;
    const value = document.getElementById("budgetAmount").value;
    const DateTime = document.getElementById("budgetDateTime").value;
    const dateOnly = DateTime.split("T")[0];

    const data = { room_id, description, type, member_id, value, dateOnly };

    // ✅ ถ้าเป็นโหมด edit ให้เพิ่ม expend_id ไปด้วย
    if (isEdit && initialData.expend_id) {
        data.expend_id = initialData.expend_id;
    }

    try {
        // ✅ ใช้ API คนละอันตามโหมด
        const url = isEdit
            ? `${API_URL}/editBudget`
            : `${API_URL}/addBudget`;

        const response = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const resData = await response.json();
        console.log("ส่งข้อมูลสำเร็จ:", resData);

        // ✅ ข้อความแจ้งผลต่างกัน
        alert(isEdit ? "บันทึกการแก้ไขเรียบร้อย!" : "เพิ่มค่าใช้จ่ายสำเร็จ!");
        onClose();
        window.location.reload();
    } catch (err) {
        console.error("ส่งข้อมูลไม่สำเร็จ:", err);
    }
};



    return (
        <>
            {/* Blur background */}
            <div className={styles.overlayBlur} onClick={onClose}></div>
            <div
                className={styles.modal}
                style={{ display: show ? "flex" : "none" }}
            >
                <div className={styles.modalContent}>
                    <div className={styles.modalMain}>
                        <h2>{isEdit ? "แก้ไขค่าใช้จ่าย" : "เพิ่มค่าใช้จ่าย"}</h2>
                        <span className={styles.close} onClick={onClose}>
                            &times;
                        </span>
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault(); // ป้องกัน page reload
                        handleSave();       // เรียกฟังก์ชันส่งข้อมูล
                        }}>

                        <label htmlFor="budgetItem">รายการ *</label>
                        <input
                            type="text"
                            id="budgetItem"
                            name="budgetItem"
                            placeholder="รายการ"
                            defaultValue={initialData.description || ""} 
                            required
                        />

                        <div className={styles.modalSplit}>
                            <div className={styles.modalSplitItem}>
                                <label htmlFor="budgetCategory">หมวดหมู่ *</label>
                                <select
                                    id="budgetCategory"
                                    name="budgetCategory"
                                    defaultValue={initialData.type || ""} 
                                    required
                                >
                                    <option value="">-- เลือกหมวดหมู่ --</option>
                                    <option value="drink">เครื่องดื่ม</option>
                                    <option value="food">อาหาร</option>
                                    <option value="travel">การเดินทาง</option>
                                    <option value="other">อื่นๆ</option>
                                </select>
                            </div>

                            <div className={styles.modalSplitItem}>
                                <label htmlFor="budgetPaidBy">จ่ายโดย *</label>
                                <select
                                    id="budgetPaidBy"
                                    name="budgetPaidBy"
                                    defaultValue={initialData.member_id || ""}
                                    required
                                >
                                    <option value="">-- เลือกผู้จ่าย --</option>
                                    {teamMembers.map((member) => (
                                        <option key={member.member_id} value={member.member_id}>{member.member_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <label htmlFor="budgetAmount">จำนวนเงิน *</label>
                        <input
                            type="number"
                            id="budgetAmount"
                            name="budgetAmount"
                            placeholder="จำนวนเงิน"
                            defaultValue={initialData.value || ""}
                            required
                        />

                        <label htmlFor="budgetDateTime">เลือก วัน/เวลา *</label>
                        <input
                            type="datetime-local"
                            id="budgetDateTime"
                            name="budgetDateTime"
                            defaultValue={initialData.paydate || ""}
                            required
                        />

                        <div style={{ display: "flex", marginTop: "10px" }}>
                            <div style={{ marginLeft: "auto" }}>
                                <button type="submit" className={styles.btnSaveEdit}>
                                    {isEdit ? "บันทึก" : "เพิ่ม"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default BudgetModal;
