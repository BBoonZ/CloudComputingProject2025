import React, { useState } from "react";
import styles from "../css/tripBudget.module.css";

const BudgetModal = ({
    type = "add", // "add" หรือ "edit"
    show,
    onClose,
    onSubmit,
    initialData = {},
}) => {
    if (!show) return null;

    const isEdit = type === "edit";

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

                    <form onSubmit={onSubmit}>
                        <label htmlFor="budgetItem">รายการ *</label>
                        <input
                            type="text"
                            id="budgetItem"
                            name="budgetItem"
                            placeholder="รายการ"
                            defaultValue={initialData.budgetItem || ""}
                            required
                        />

                        <div className={styles.modalSplit}>
                            <div className={styles.modalSplitItem}>
                                <label htmlFor="budgetCategory">หมวดหมู่ *</label>
                                <select
                                    id="budgetCategory"
                                    name="budgetCategory"
                                    defaultValue={initialData.budgetCategory || ""}
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
                                    defaultValue={initialData.budgetPaidBy || ""}
                                    required
                                >
                                    <option value="">-- เลือกผู้จ่าย --</option>
                                    <option value="1">มูเด้ง</option>
                                    <option value="2">อาหวัง</option>
                                    <option value="3">หงทอง</option>
                                    <option value="4">ไทยราช</option>
                                </select>
                            </div>
                        </div>

                        <label htmlFor="budgetAmount">จำนวนเงิน *</label>
                        <input
                            type="number"
                            id="budgetAmount"
                            name="budgetAmount"
                            placeholder="จำนวนเงิน"
                            defaultValue={initialData.budgetAmount || ""}
                            required
                        />

                        <label htmlFor="budgetDateTime">เลือก วัน/เวลา *</label>
                        <input
                            type="datetime-local"
                            id="budgetDateTime"
                            name="budgetDateTime"
                            defaultValue={initialData.budgetDateTime || ""}
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
