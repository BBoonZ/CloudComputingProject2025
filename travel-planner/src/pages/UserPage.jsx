import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import userStyles from "../css/user.module.css";
import navStyles from "../css/main-nav.module.css";
import { CognitoIdentityProviderClient, ChangePasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useAuth } from '../context/AuthContext';

export default function SettingPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [userData, setUserData] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    profile_uri: ""
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // S3 upload popup state
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          navigate('/login');
          return;
        }
        const data = await userService.getUserByEmail(email);
        setUserData(data.data);
        setLoading(false);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  // S3 upload helpers
  const handleProfileImageClick = () => {
    setShowUploadPopup(true);
    setUploadError("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError("");
  };

  const handleUploadToS3 = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("กรุณาเลือกไฟล์ภาพ");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      // S3 config (use env vars or config file for real app)
      const REGION = process.env.REACT_APP_AWS_REGION;
      const BUCKET = process.env.REACT_APP_S3_BUCKET;
      const s3 = new S3Client({
        region: REGION,
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
        }
      });
      const fileName = `profile_${userData.username}_${Date.now()}.${selectedFile.name.split('.').pop()}`;
      const uploadParams = {
        Bucket: BUCKET,
        Key: fileName,
        Body: await selectedFile.arrayBuffer(),
        ContentType: selectedFile.type,
        ACL: 'public-read'
      };
      await s3.send(new PutObjectCommand(uploadParams));
      const s3Url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
      // Update user profile_uri
      const updatedUser = { ...userData, profile_uri: s3Url };
      await userService.updateUser(updatedUser);
      setUserData(updatedUser);
      setShowUploadPopup(false);
      setSuccessMessage("อัพโหลดรูปโปรไฟล์สำเร็จ");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setUploadError("อัพโหลดรูปไม่สำเร็จ");
      console.error('S3 upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    //console.log(userData);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(userData);
      setSuccessMessage("อัพเดตข้อมูลสำเร็จ");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("ไม่สามารถอัพเดตข้อมูลได้");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    try {
      const cognitoClient = new CognitoIdentityProviderClient({
        region: process.env.REACT_APP_AWS_REGION
      });

      const command = new ChangePasswordCommand({
        AccessToken: localStorage.getItem('accessToken'), // Make sure you store this on login
        PreviousPassword: passwords.currentPassword,
        ProposedPassword: passwords.newPassword
      });

      await cognitoClient.send(command);

      setSuccessMessage("เปลี่ยนรหัสผ่านสำเร็จ");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error('Password change error:', error);
      if (error.name === 'InvalidPasswordException') {
        setError("รหัสผ่านใหม่ไม่ถูกต้องตามเงื่อนไข");
      } else if (error.name === 'NotAuthorizedException') {
        setError("รหัสผ่านปัจจุบันไม่ถูกต้อง");
      } else {
        setError("ไม่สามารถเปลี่ยนรหัสผ่านได้");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div>
      {/* Main Content */}
      <main className={userStyles.settingsContainer}>
        <h1>การตั้งค่าผู้ใช้</h1>
        {error && <div className={userStyles.error}>{error}</div>}
        {successMessage && <div className={userStyles.success}>{successMessage}</div>}

        <div className={userStyles.profile}>
          <img
            src={userData.profile_uri || "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png"}
            alt="User Profile"
            style={{ cursor: 'pointer' }}
            onClick={handleProfileImageClick}
            title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์"
          />
        </div>

        {/* Upload Profile Popup */}
        {showUploadPopup && (
          <div className={userStyles.popupOverlay}>
            <div className={userStyles.popupContent}>
              <h3>อัพโหลดรูปโปรไฟล์ใหม่</h3>
              <form onSubmit={handleUploadToS3}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  disabled={uploading}
                />
                {uploadError && <div className={userStyles.error}>{uploadError}</div>}
                <div style={{ marginTop: 10 }}>
                  <button type="submit" className={userStyles.btnSave} disabled={uploading}>
                    {uploading ? "กำลังอัพโหลด..." : "อัพโหลด"}
                  </button>
                  <button type="button" className={userStyles.btnLogout} style={{ marginLeft: 10 }} onClick={() => setShowUploadPopup(false)} disabled={uploading}>
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className={userStyles.layout}>
          <section className={userStyles.settingsSection}>
            <h2>ข้อมูลส่วนตัว</h2>
            <form onSubmit={handleProfileUpdate}>
              <label>ชื่อผู้ใช้</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
              />
              <label>ชื่อ</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
              />
              <label>นามสกุล</label>
              <input
                type="text"
                name="surname"
                value={userData.surname}
                onChange={handleInputChange}
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                disabled
              />
              <label>เบอร์โทรศัพท์</label>
              <input
                type="tel"
                name="phone_number"
                value={userData.phone_number}
                onChange={handleInputChange}
              />
              <button type="submit" className={userStyles.btnSave}>บันทึก</button>
            </form>
          </section>
          <div className={userStyles.layout2}>
            <section className={userStyles.settingsSection}>
              <h2>เปลี่ยนรหัสผ่าน</h2>
              <form onSubmit={handlePasswordUpdate}>
                <label>รหัสผ่านปัจจุบัน</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                />
                <label>รหัสผ่านใหม่</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                />
                <label>ยืนยันรหัสผ่านใหม่</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                />
                <button type="submit" className={userStyles.btnSave}>
                  เปลี่ยนรหัสผ่าน
                </button>
              </form>
            </section>
            <section className={userStyles.settingsSection}>
              <h2>ออกจากระบบ</h2>
              <button
                onClick={handleLogout}
                className={userStyles.btnLogout}
              >
                ออกจากระบบ
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
