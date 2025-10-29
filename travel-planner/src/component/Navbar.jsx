import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../css/main-nav.module.css';

const Navbar = memo(() => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link to="/">Travel Planner Pro ✈️</Link>
      </div>
      <nav className={styles.mainNav}>
        <ul>
          <li><Link to="/tripMain">หน้าหลัก</Link></li>
          <li><Link to="/tripManage">แผนการเดินทางของฉัน</Link></li>
          {isAuthenticated && user && (
            <>
              <li className={styles.userInfo}>
                <span className={styles.userName}>
                  {user.username}
                </span>
                <img
                  src={user.profile_uri || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className={styles.profilePic}
                  onClick={() => navigate('/user')}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/40";
                  }}
                />
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  ออกจากระบบ
                </button>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <li>
              <Link to="/login" className={styles.loginBtn}>
                เข้าสู่ระบบ
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
});

export default Navbar;