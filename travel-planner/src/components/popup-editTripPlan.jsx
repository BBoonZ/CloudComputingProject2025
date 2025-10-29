import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useState } from "react";
import styles from "./EditTripPlanModal.module.css";

export default function EditTripPlanModal({ isOpen, onClose, onSave }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (file) => {
    try {
      const s3Client = new S3Client({
        region: process.env.REACT_APP_AWS_REGION,
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
          sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN

        }
      });

      const fileBuffer = await file.arrayBuffer();
      const fileName = `trip_${Date.now()}_${file.name}`;

      const command = new PutObjectCommand({
        Bucket: process.env.REACT_APP_S3_BUCKET,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.type
      });

      await s3Client.send(command);
      return `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let plan_url = null;
      if (selectedImage) {
        plan_url = await handleImageUpload(selectedImage);
      }

      const tripData = {
        // ...existing trip data...
        plan_url
      };

      onSave(tripData);
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  return (
    <div>
      {/* ...existing JSX... */}
      <div className={styles.formGroup}>
        <label>รูปภาพทริป</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files[0])}
        />
      </div>
      {/* ...existing JSX... */}
    </div>
  );
}