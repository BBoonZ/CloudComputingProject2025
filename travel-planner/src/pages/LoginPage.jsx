import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { useAuth } from '../context/AuthContext';
import styles from '../css/LoginPage.module.css';
const config = { region: process.env.REACT_APP_AWS_REGION  }

function generateUserId(length = 9) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const cognitoClient = new CognitoIdentityProviderClient(config);
const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("login");
  const [session, setSession] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleError = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleLogin = async () => {
    setError("");

    // try {
    //   const input = {
    //     "AuthFlow": "USER_PASSWORD_AUTH",
    //     "AuthParameters": {
    //       "USERNAME": email,
    //       "PASSWORD": password,
    //     },
    //     "ClientId": clientId,
    //   };
    //   const command = new InitiateAuthCommand(input);
    //   const response = await cognitoClient.send(command);

    //   if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
    //     setSession(response.Session);
    //     setView('otp');
    //   }
    //   else if (response['$metadata']['httpStatusCode'] === 200) {
    //     login(email, response.AuthenticationResult.AccessToken);
    //     navigate('/');
    //   }
    // } catch (error) {
    //   // Handle specific Cognito errors
    //   switch (error.name) {
    //     case 'NotAuthorizedException':
    //       handleError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    //       break;
    //     case 'UserNotFoundException':
    //       handleError("ไม่พบบัญชีผู้ใช้นี้");
    //       break;
    //     case 'UserNotConfirmedException':
    //       handleError("กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ");
    //       break;
    //     default:
    //       handleError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    //   }
    // }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("เข้าสู่ระบบ...");
    
    const user = {
      user_id: generateUserId(), // ฟังก์ชันสร้าง user id
      email,
      username: email.split('@')[0],
      name: '',
      surname: '',
      phone_number: ''
    };
  
    console.log("เข้าสู่ระบบ...", user);
  
    // เก็บข้อมูลลง localStorage
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('userEmail', email);
  
    navigate("/tripMain");
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="logo">
          <Link to="/">
            <h1>Travel Planner Pro ✈️</h1>
          </Link>
        </div>
        <h2>เข้าสู่ระบบ</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ชื่ออีเมลของคุณ"
              value={email} onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="รหัสผ่าน"
              value={password} onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="forgot-password">
            <Link to="/forgot">ลืมรหัสผ่าน?</Link>
          </div>
          <button type="submit" onClick={handleLogin} className="btn btn-primary">
            เข้าสู่ระบบ
          </button>
        </form>

        {/* <div className="divider">หรือเข้าสู่ระบบด้วย</div>

        <div className="social-login">
          <button className="btn btn-social btn-google">
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google icon"
            />
            Google
          </button>
          <button className="btn btn-social btn-facebook">
            <img
              src="https://img.icons8.com/color/16/000000/facebook-new.png"
              alt="Facebook icon"
            />
            Facebook
          </button>
        </div> */}

        <div className="signup-link">
          ยังไม่มีบัญชีใช่ไหม? <Link to="/signup">สมัครสมาชิก</Link>
        </div>
      </div>

      {showAlert && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertBox}>
            <div className={styles.alertIcon}>⚠️</div>
            <h3 className={styles.alertTitle}>เกิดข้อผิดพลาด</h3>
            <p className={styles.alertMessage}>{alertMessage}</p>
            <button 
              className={styles.alertButton}
              onClick={() => setShowAlert(false)}
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
