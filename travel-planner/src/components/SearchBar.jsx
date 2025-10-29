import React from 'react';
import styles from '../css/SearchBar.module.css';

export default function SearchBar({ onSearch }) {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="ค้นหาทริป..."
        onChange={(e) => onSearch(e.target.value)}
        className={styles.searchInput}
      />
      <i className="fas fa-search"></i>
    </div>
  );
}