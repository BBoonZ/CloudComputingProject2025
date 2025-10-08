import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import styles from '../css/main-nav.module.css';
import { userService } from "../services/userService";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { userData, updateUserData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        const email = localStorage.getItem('userEmail');
        try {
          const response = await userService.getUserByEmail(email);
          if (response.status === 'success') {
            updateUserData(response.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, updateUserData]);

  const handleLogout = () => {
    logout();
    updateUserData({ email: '', profile_uri: '', username: '' });
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
                <span>{userData.username || userData.email}</span>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  ออกจากระบบ
                </button>
              </li>
              <li>
                <img
                  src={userData.profile_uri || "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png"}
                  alt="User Profile"
                  className={styles.profilePic}
                  onClick={() => navigate('/user')}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png";
                  }}
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