import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { userService } from '../services/userService';

const config = { region: process.env.REACT_APP_AWS_REGION }

const cognitoClient = new CognitoIdentityProviderClient(config);
const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;



export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  console.log(clientId);
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const input = {
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
        ],
      };
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }


      // const command = new SignUpCommand(input);
      // const response = await cognitoClient.send(command);

      // if (response.$metadata.httpStatusCode === 200) {

        // Show success message
        alert("ลงทะเบียนสำเร็จ");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        // setShowAlert(true);
        // setShowVerification(true);
      // }
    } catch (error) {
      alert("Error signing up: " + error.message);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();

    try {
      const input = {
        ClientId: clientId,
        Username: email,
        ConfirmationCode: verificationCode,
      };

      // const command = new ConfirmSignUpCommand(input);
      // const response = await cognitoClient.send(command);

      // if (response.$metadata.httpStatusCode === 200) {
        // ✅ เมื่อยืนยันสำเร็จให้ไปหน้า login ทันที
        
        // Create user through API
        await userService.createUser({
          email,
          username: email.split('@')[0],
          name: '',
          surname: '',
          phone_number: ''
        });
        alert("ยืนยันอีเมลสำเร็จ! กรุณาเข้าสู่ระบบ");
        navigate("/login");
      // }
    } catch (error) {
      alert("Error verifying code: " + error.message);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="logo">
          <Link to="/">
            <h1>Travel Planner Pro ✈️</h1>
          </Link>
        </div>
        <h2>สมัครสมาชิก</h2>

        {!showVerification ? (
          <form className="login-form" onSubmit={handleSignUp}>
            <div className="form-group">
              <label htmlFor="email">อีเมล</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ชื่ออีเมลของคุณ"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">รหัสผ่าน</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่าน"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="ยืนยันรหัสผ่าน"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              สมัครสมาชิก
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleVerification}>
            <div className="form-group">
              <label htmlFor="verificationCode">รหัสยืนยัน</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="กรอกรหัสยืนยันที่ส่งไปทางอีเมล"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              ยืนยันอีเมล
            </button>
          </form>
        )}

        {showAlert && (
          <div className="alert-message">
            {alertMessage}
          </div>
        )}

        <div className="login-link">
          มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </div>
      </div>
    </main>
  );
}

// // Helper function to generate user ID
// function generateUserId() {
//   return Math.random().toString(36).substring(2, 12).toUpperCase();
// }
