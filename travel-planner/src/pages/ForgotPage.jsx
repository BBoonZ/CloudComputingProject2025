import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CognitoIdentityProviderClient, 
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand 
} from "@aws-sdk/client-cognito-identity-provider";
import styles from '../css/ForgotPage.module.css';

const config = { region: process.env.REACT_APP_AWS_REGION  }

const cognitoClient = new CognitoIdentityProviderClient(config);
const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleError = (message) => {
    setIsSuccess(false);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleSuccess = (message) => {
    setIsSuccess(true);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const input = {
        ClientId: clientId,
        Username: email
      };

      const command = new ForgotPasswordCommand(input);
      const response = await cognitoClient.send(command);

      if (response.$metadata.httpStatusCode === 200) {
        setShowVerification(true);
        handleSuccess("รหัสยืนยันถูกส่งไปยังอีเมลของคุณแล้ว");
      }
    } catch (error) {
      switch (error.name) {
        case 'UserNotFoundException':
          handleError("ไม่พบบัญชีผู้ใช้นี้");
          break;
        case 'LimitExceededException':
          handleError("คุณขอรหัสยืนยันบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่");
          break;
        default:
          handleError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const input = {
        ClientId: clientId,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword
      };

      const command = new ConfirmForgotPasswordCommand(input);
      const response = await cognitoClient.send(command);

      if (response.$metadata.httpStatusCode === 200) {
        handleSuccess("รีเซ็ตรหัสผ่านสำเร็จ คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว");
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      switch (error.name) {
        case 'CodeMismatchException':
          handleError("รหัสยืนยันไม่ถูกต้อง");
          break;
        case 'ExpiredCodeException':
          handleError("รหัสยืนยันหมดอายุ กรุณาขอรหัสใหม่");
          break;
        default:
          handleError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  return (
    <main className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-h">
          <h2>ลืมรหัสผ่านใช่ไหม?</h2>
          <p className="desc">
            {!showVerification 
              ? "กรอกอีเมลที่คุณใช้สมัครบัญชี จากนั้นเราจะส่งรหัสยืนยันสำหรับตั้งรหัสผ่านใหม่ให้คุณ"
              : "กรอกรหัสยืนยันที่เราส่งให้ทางอีเมล และตั้งรหัสผ่านใหม่ของคุณ"
            }
          </p>
        </div>

        {!showVerification ? (
          <form className="forgot-form" onSubmit={handleForgotPassword}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="อีเมล"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              ส่งรหัสยืนยัน
            </button>
          </form>
        ) : (
          <form className="forgot-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="รหัสยืนยัน"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="รหัสผ่านใหม่"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              ตั้งรหัสผ่านใหม่
            </button>
          </form>
        )}

        <div className="signup-link">
          มีบัญชีอยู่แล้วใช่ไหม? <Link to="/login">เข้าสู่ระบบ</Link>
        </div>
      </div>

      {showAlert && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertBox}>
            <div className={styles.alertIcon}>
              {isSuccess ? '✅' : '⚠️'}
            </div>
            <h3 className={styles.alertTitle}>
              {isSuccess ? 'สำเร็จ' : 'เกิดข้อผิดพลาด'}
            </h3>
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

export default ForgotPage;
