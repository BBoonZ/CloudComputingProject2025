import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import userStyles from "../css/user.module.css";
import navStyles from "../css/main-nav.module.css";
import { CognitoIdentityProviderClient, ChangePasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';


export default function SettingPage() {
  const navigate = useNavigate();
  const { logout, user, refreshUserData, updateUserDataImmediately } = useAuth();
  const { updateUserData } = useUser();
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
      // Convert File to ArrayBuffer
      const fileBuffer = await selectedFile.arrayBuffer();
      console.log(process.env.REACT_APP_AWS_REGION)
      const s3Client = new S3Client({
        region: process.env.REACT_APP_AWS_REGION,
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
          sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN
        }
      });

      const fileName = `profile_${userData.username}_${Date.now()}.${selectedFile.name.split('.').pop()}`;

      const command = new PutObjectCommand({
        Bucket: process.env.REACT_APP_S3_BUCKET,
        Key: fileName,
        Body: fileBuffer, // Use ArrayBuffer instead of File object
        ContentType: selectedFile.type,
        ACL: 'public-read'
      });

      await s3Client.send(command);

      // Update profile URI using the public URL format
      const profileUri = `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${fileName}`;

      // Update user profile with new image URL
      const updatedUserData = { ...userData, profile_uri: profileUri };
      const response = await userService.updateUser(updatedUserData);
      
      if (response.status === 'success') {
        setUserData(updatedUserData);
        // Update both contexts
        updateUserData(updatedUserData);
        await refreshUserData(); // This will update the AuthContext and navbar
        setShowUploadPopup(false);
        setSuccessMessage("อัพโหลดรูปโปรไฟล์สำเร็จ");
      }
    } catch (err) {
      console.error('S3 upload error:', err);
      if (err.name === 'AccessDenied') {
        setUploadError("ไม่มีสิทธิ์ในการอัพโหลดไฟล์");
      } else {
        setUploadError("ไม่สามารถอัพโหลดไฟล์ได้");
      }
    } finally {
      setUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
      const response = await userService.updateUser(userData);
      if (response.status === 'success') {
        // Update both contexts
        updateUserData(userData);
        await refreshUserData(); // This will update the AuthContext and navbar
        setSuccessMessage("อัพเดตข้อมูลสำเร็จ");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
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

  useEffect(() => {
    return () => {
      // Cleanup URL object when component unmounts or file changes
      if (selectedFile) {
        URL.revokeObjectURL(URL.createObjectURL(selectedFile));
      }
    };
  }, [selectedFile]);

  // Add useEffect to sync with AuthContext user data
  useEffect(() => {
    if (user) {
      setUserData(prevData => ({
        ...prevData,
        ...user
      }));
    }
  }, [user]);

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
            className={userStyles.profilePic}
            style={{ cursor: 'pointer' }}
            onClick={handleProfileImageClick}
            title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png";
            }}
          />
        </div>

        {/* Upload Profile Popup */}
        {showUploadPopup && (
          <div className={userStyles.popupOverlay} onClick={() => !uploading && setShowUploadPopup(false)}>
            <div className={userStyles.popupContent} onClick={e => e.stopPropagation()}>
              <h2 style={{ marginTop: 0, color: '#333' }}>อัพโหลดรูปโปรไฟล์ใหม่</h2>
              <form onSubmit={handleUploadToS3}>
                <div className={userStyles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className={userStyles.fileInput}
                    id="fileInput"
                    disabled={uploading}
                  />
                  <label htmlFor="fileInput" className={userStyles.uploadButton}>
                    เลือกรูปภาพ
                  </label>
                  <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>
                    {selectedFile ? selectedFile.name : 'รองรับไฟล์ .jpg, .png, .gif'}
                  </p>
                  {selectedFile && (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className={userStyles.imagePreview}
                    />
                  )}
                </div>
                {uploadError && (
                  <div className={userStyles.error} style={{ marginBottom: '1rem' }}>
                    {uploadError}
                  </div>
                )}
                <div className={userStyles.buttonGroup}>
                  <button
                    type="button"
                    className={userStyles.btnLogout}
                    onClick={() => setShowUploadPopup(false)}
                    disabled={uploading}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className={userStyles.btnSave}
                    disabled={!selectedFile || uploading}
                  >
                    {uploading ? (
                      <span>
                        <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                        กำลังอัพโหลด...
                      </span>
                    ) : (
                      'อัพโหลด'
                    )}
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
