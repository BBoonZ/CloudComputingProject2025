import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../css/main-nav.module.css';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link to="/tripMain">Travel Planner Pro ✈️</Link>
      </div>
      <nav className={styles.mainNav}>
        <ul>
          <li><Link to="/tripMain">หน้าหลัก</Link></li>
          <li><Link to="/tripManage">แผนการเดินทางของฉัน</Link></li>
          {isAuthenticated ? (
            <>
              <li className={styles.userInfo}>
                <span>{userEmail}</span>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  ออกจากระบบ
                </button>
              </li>
              <li>
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Profile"
                  className={styles.profilePic}
                  onClick={() => navigate('/user')}
                />
              </li>
            </>
          ) : (
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
}