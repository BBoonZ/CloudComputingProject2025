import React from 'react';
import styles from '../css/SortBar.module.css';

const SortBar = ({ onSort, onOrderChange, onFilter, isVisible, onToggleVisibility }) => {
  return (
    <>
      <button className={styles.toggleButton} onClick={onToggleVisibility}>
        {isVisible ? 'ซ่อนตัวกรอง' : 'แสดงตัวกรอง'}
      </button>

      {isVisible && (
        <div className={styles.sortContainer}>
          <div className={styles.sortGroup}>
            <span className={styles.label}>เรียงตาม:</span>
            <select 
              onChange={(e) => onSort(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="">ล่าสุด</option>
              <option value="budget">งบประมาณ</option>
              <option value="duration">จำนวนวัน</option>
              <option value="members">จำนวนสมาชิก</option>
              <option value="owner">ชื่อเจ้าของ</option>
              <option value="title">ชื่อทริป</option>
            </select>

            <select 
              onChange={(e) => onOrderChange(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="DESC">มากไปน้อย</option>
              <option value="ASC">น้อยไปมาก</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterItem}>
              <span className={styles.label}>งบประมาณ:</span>
              <input
                type="number"
                placeholder="ต่ำสุด"
                onChange={(e) => onFilter('budgetMin', e.target.value)}
                className={styles.filterInput}
              />
              <input
                type="number"
                placeholder="สูงสุด"
                onChange={(e) => onFilter('budgetMax', e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterItem}>
              <span className={styles.label}>จำนวนวัน:</span>
              <input
                type="number"
                placeholder="ต่ำสุด"
                onChange={(e) => onFilter('durationMin', e.target.value)}
                className={styles.filterInput}
              />
              <input
                type="number"
                placeholder="สูงสุด"
                onChange={(e) => onFilter('durationMax', e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterItem}>
              <span className={styles.label}>จำนวนสมาชิก:</span>
              <input
                type="number"
                placeholder="ต่ำสุด"
                onChange={(e) => onFilter('membersMin', e.target.value)}
                className={styles.filterInput}
              />
              <input
                type="number"
                placeholder="สูงสุด"
                onChange={(e) => onFilter('membersMax', e.target.value)}
                className={styles.filterInput}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SortBar;