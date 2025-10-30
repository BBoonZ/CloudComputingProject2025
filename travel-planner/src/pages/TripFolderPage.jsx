import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditTripModal from "../component/popup-editTripPlan";
import ShareTripModal from "../component/popup-shareTripPlan";

import styles from "../css/tripFolder.module.css";
import nav from "../css/main-nav.module.css";
import tripTemplate from "../css/tripTemplate.module.css";

import testPDF from "../assests/images/test.pdf";
import testIMG from "../assests/images/test1.jpg";


export default function TripBudget() {
    // state สำหรับ 

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const room_id = params.get("room_id");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const tripTitle = location.state?.tripTitle || "กำลังโหลดชื่อทริป...";
    const tripDescription = location.state?.tripDescription || "";
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [previewContent, setPreviewContent] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");
    const trip = location.state?.trip || "";
    const [files, setFiles] = useState([]);
    const base_api = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await fetch(`${base_api}/getDocuments/${room_id}`);
                const data = await res.json();

                // แปลงข้อมูลจาก DB เป็นรูปแบบที่จะแสดงในหน้า
                const formatted = data.map((doc) => {
                    const fileName = doc.file.split("/").pop();
                    const ext = fileName.split(".").pop().toLowerCase();
                    let type = "other";
                    if (["jpg", "jpeg", "png", "gif"].includes(ext)) type = "image";
                    else if (ext === "pdf") type = "pdf";
                    else if (["doc", "docx"].includes(ext)) type = "doc";

                    return {
                        doc_id: doc.doc_id,
                        name: fileName,
                        url: doc.file,
                        type,  // เพิ่มตรงนี้
                        uploadDate: new Date(doc.createdAt).toLocaleDateString("th-TH"),
                        size: "-",
                    };
                });

                setFiles(formatted);
            } catch (err) {
                console.error("❌ Error fetching documents:", err);
            }
        };

        fetchDocuments();
    }, [room_id]);

    const handlePreview = (file) => {
        if (file.type === "image") {
            setPreviewContent(<img src={file.url} style={{ maxWidth: "100%", borderRadius: 8 }} />);
        } else if (file.type === "pdf") {
            setPreviewContent(<iframe src={file.url} style={{ width: "100%", height: 500 }} />);
        } else if (file.type === "doc") {
            setPreviewContent(
                <iframe
                    src={`https://docs.google.com/gview?url=${file.url}&embedded=true`}
                    style={{ width: "100%", height: 500 }}
                />
            );
        } else {
            setPreviewContent(<p>ไม่สามารถพรีวิวไฟล์นี้ได้</p>);
        }
        setPreviewModalVisible(true);
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setUploadStatus("loading");
            const formData = new FormData();
            formData.append("file", file);
            formData.append("room_id", room_id);

            const response = await fetch(`${base_api}/uploadDocument`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {

                const ext = file.name.split(".").pop().toLowerCase();
                let fileType = "other"; // ตั้งชื่อตัวแปรใหม่กันสับสน
                if (["jpg", "jpeg", "png", "gif"].includes(ext)) fileType = "image";
                else if (ext === "pdf") fileType = "pdf";
                else if (["doc", "docx"].includes(ext)) fileType = "doc";

                // const newFile = {
                //     name: file.name,
                //     url: data.fileUrl, // URL จาก S3
                //     type: file.name.split(".").pop().toLowerCase(),
                //     uploadDate: new Date().toLocaleDateString("th-TH"),
                //     size: `${(file.size / 1024).toFixed(1)} KB`,
                // };

                // setFiles((prev) => [...prev, newFile]);
                setUploadStatus("success");
                setTimeout(() => setUploadStatus(""), 1000);
                window.location.reload();

            } else {
                setUploadStatus("error");
                alert("อัปโหลดล้มเหลว: " + data.error);
                setTimeout(() => setUploadStatus(""), 2500);
            }
        } catch (err) {
            setUploadStatus("error");
            console.error("❌ Upload error:", err);
            alert("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
            setTimeout(() => setUploadStatus(""), 2500);
        }

        event.target.value = null;
    };

    const handleDelete = async (index) => {
        const fileToDelete = files[index];
        
        if (!fileToDelete || !fileToDelete.doc_id) {
            alert("เกิดข้อผิดพลาด: ไม่พบ ID ของไฟล์");
            return;
        }

        if (window.confirm(`คุณต้องการลบไฟล์ ${fileToDelete.name} จริงๆ หรือไม่? \n(การกระทำนี้จะลบไฟล์ออกจากระบบถาวร)`)) {
            try {
                // 1. ยิง API ไปที่ Backend
                const response = await fetch(`${base_api}/deleteDocument/${fileToDelete.doc_id}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || "ลบไฟล์ไม่สำเร็จ");
                }

                // 2. ถ้าลบสำเร็จ ค่อยลบออกจากหน้าจอ (State)
                
                alert("ลบไฟล์สำเร็จ!");
                window.location.reload();

            } catch (err) {
                console.error("❌ Delete error:", err);
                alert("เกิดข้อผิดพลาดในการลบไฟล์: " + err.message);
            }
        }
    };

    // ... (วางไว้แถวๆ handlePreview, handleUpload) ...

    const handleDownload = async (fileUrl, fileName) => {
        try {
            // 1. ยิง fetch ไปเอาไฟล์
            const response = await fetch(fileUrl);
            
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // 2. แปลงไฟล์เป็น "ก้อนข้อมูล" (Blob)
            const blob = await response.blob();
            
            // 3. สร้าง URL ชั่วคราวในเครื่องเบราว์เซอร์
            const url = window.URL.createObjectURL(blob);
            
            // 4. สร้างแท็ก <a> ล่องหนขึ้นมา
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName); // ตั้งชื่อไฟล์ที่จะดาวน์โหลด
            
            // 5. สั่งให้ <a> ล่องหนทำงาน (คลิก)
            document.body.appendChild(link);
            link.click();
            
            // 6. ลบ <a> ล่องหน และ URL ชั่วคราวทิ้ง
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("❌ Error downloading file:", err);
            alert("ไม่สามารถดาวน์โหลดไฟล์ได้");
        }
    };

    return (
        <>
            {/* Header */}
            <header className={nav.header}>
                <div className={nav.container}>
                    <div className={nav.logo}>
                        <a href="/tripMain">Travel Planner Pro ✈️</a>
                    </div>
                    <nav className={nav.mainNav}>
                        <ul>
                            <li><a href="/tripMain">หน้าหลัก</a></li>
                            <li><a href="/tripManage">แผนการเดินทางของฉัน</a></li>
                            <img
                                src="https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png"
                                alt="User Profile"
                                className={nav.profilePic}
                                onClick={() => (window.location.href = "/user")}
                            />
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Main */}
            <main className={tripTemplate.tripPlanMain}>
                <div className={tripTemplate.container}>
                    <div className={tripTemplate.planHeader}>
                        <h1>{tripTitle}</h1>
                        <div className={tripTemplate.planMeta}>
                            <span className={tripTemplate.planDates}></span>
                            <button className={`${tripTemplate.btn} ${tripTemplate.btnSave}`} onClick={() => setEditModalOpen(true)}>
                                <i className="fas fa-edit"></i> แก้ไข
                            </button>
                            <button className={`${tripTemplate.btn} ${tripTemplate.btnShare}`} onClick={() => setShareModalOpen(true)}>
                                <i className="fas fa-share-alt"></i> แชร์
                            </button>
                        </div>
                    </div>
                    <div class={tripTemplate.info}>
                        <div class={tripTemplate.container}>
                            <p>{tripDescription}</p>
                        </div>
                    </div>
                    <div className={tripTemplate.planLayout}>
                        <aside className={tripTemplate.planSidebar}>
                            <div className={tripTemplate.sidebarItem} onClick={() => navigate(`/tripPlan?room_id=${room_id}`, {
                                state: {
                                    tripTitle: tripTitle,
                                    tripDescription: tripDescription,
                                    trip: trip
                                }
                            })}>
                                <i className="fas fa-calendar-alt"></i> กำหนดการเดินทาง
                            </div>
                            <div className={tripTemplate.sidebarItem} onClick={() => navigate(`/tripBudget?room_id=${room_id}`, {
                                state: {
                                    tripTitle: tripTitle,
                                    tripDescription: tripDescription,
                                    trip: trip
                                }
                            })}>
                                <i className="fas fa-wallet"></i> งบประมาณ
                            </div>
                            <div className={tripTemplate.sidebarItem} onClick={() => navigate(`/tripTeam?room_id=${room_id}`, {
                                state: {
                                    tripTitle: tripTitle,
                                    tripDescription: tripDescription,
                                    trip: trip
                                }
                            })}>
                                <i className="fas fa-users"></i> สมาชิก & แชท
                            </div>
                            <div className={`${tripTemplate.sidebarItem} ${tripTemplate.active}`} onClick={() => navigate(`/tripFolder?room_id=${room_id}`, {
                                state: {
                                    tripTitle: tripTitle,
                                    tripDescription: tripDescription,
                                    trip: trip
                                }
                            })}>
                                <i className="fas fa-file-alt"></i> เอกสาร
                            </div>
                        </aside>

                        {/* Content */}
                        <div className={tripTemplate.planContent}>
                            <div className={styles.fileHeader}>
                                <h2>เอกสารประกอบการเดินทาง</h2>
                                <label htmlFor="fileUpload" className={`${styles.btn} ${styles.btnUpload}`}>
                                    <i className="fas fa-upload"></i> อัปโหลดไฟล์
                                </label>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    style={{ display: "none" }}
                                    onChange={handleUpload} // <-- ต้องเป็นฟังก์ชัน ไม่ใช่ handleUpload()
                                />
                                <div style={{ marginTop: 8, minHeight: 24 }}>
                                    {uploadStatus === "loading" && <span style={{ color: "blue" }}>⏳ กำลังอัปโหลดไฟล์...</span>}
                                    {uploadStatus === "success" && <span style={{ color: "green" }}>✅ อัปโหลดสำเร็จ!</span>}
                                    {uploadStatus === "error" && <span style={{ color: "red" }}>❌ อัปโหลดล้มเหลว</span>}
                                </div>
                            </div>

                            <div className={styles.fileList}>
                                {files.map((file, index) => (
                                    <div className={styles.fileItem} key={index}>
                                        <i className={`fas fa-file-${file.type === "pdf" ? "pdf" : file.type === "doc" ? "word" : "image"} ${styles.fileIcon} ${file.type === "pdf" ? "pdf" : file.type === "doc" ? "word" : "image"}`} />
                                        <div className={styles.fileInfo}>
                                            <span className={styles.fileName}>{file.name}</span>
                                            <span className={styles.fileMeta}>อัปโหลดเมื่อ: {file.uploadDate} · ขนาด: {file.size}</span>
                                        </div>
                                        <div className={styles.fileActions}>
                                            <button className={styles.btnIcon} onClick={() => handlePreview(file)}>
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button className={styles.btnIcon} onClick={() => handleDownload(file.url, file.name)}>
                                                <i className="fa-solid fa-download"></i>
                                            </button>
                                            <button className={styles.btnIcon} onClick={() => handleDelete(index)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {previewModalVisible && (
                            <div className={styles.previewModal}>
                                <div className={styles.previewContent}>
                                    <span className={styles.close} onClick={() => setPreviewModalVisible(false)}>
                                        &times;
                                    </span>
                                    <div className={styles.modalFit}>
                                        {previewContent}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main >

            {/* Edit Modal */}
            <EditTripModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                initialData={trip} // <-- ส่งข้อมูลทริปปัจจุบัน
                roomId={room_id}
            />


            {/* Share Modal */}
            <ShareTripModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                roomId={room_id}
            />
        </>
    );
}

