import React, { useState } from "react";
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
    const trip = location.state?.trip || "";
    const [files, setFiles] = useState([
        {
            name: "แผนการเดินทาง.pdf",
            url: testPDF,
            type: "pdf",
            uploadDate: "20 ก.ย. 2567",
            size: "1.2 MB",
        },
        {
            name: "รายชื่อสมาชิก.docx",
            url: "../src/assests/images/test1.jpg",
            type: "doc",
            uploadDate: "21 ก.ย. 2567",
            size: "256 KB",
        },
        {
            name: "บัตรจองที่พัก.png",
            url: testIMG,
            type: "image",
            uploadDate: "21 ก.ย. 2567",
            size: "500 KB",
        },
    ]);

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

    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const newFile = {
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.name.split(".").pop().toLowerCase(),
            uploadDate: new Date().toLocaleDateString("th-TH"),
            size: `${(file.size / 1024).toFixed(1)} KB`,
        };

        setFiles((prev) => [...prev, newFile]);
        event.target.value = null;
    };

    const handleDelete = (index) => {
        if (window.confirm(`คุณต้องการลบไฟล์ ${files[index].name} หรือไม่?`)) {
            setFiles((prev) => prev.filter((_, i) => i !== index));
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
                            <span className={tripTemplate.planDates}>1 - 4 ธันวาคม 2567</span>
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
                                    onChange={handleUpload}
                                />
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
                                            <a href={file.url} download={file.name} className={styles.btnIcon}>
                                                <i className="fa-solid fa-download"></i>
                                            </a>
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
            />
        </>
    );
}

