import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../css/main-nav.module.css';

export default function Navbar() {
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Travel Planner Pro ✈️</Link>
      </div>
      <div className={styles.userInfo}>
        {userEmail ? (
          <>
            <span>{userEmail}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              ออกจากระบบ
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.loginBtn}>
            เข้าสู่ระบบ
          </Link>
        )}
      </div>
    </nav>
  );
}