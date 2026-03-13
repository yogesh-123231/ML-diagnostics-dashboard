import React, { useState } from "react";
import axios from "axios";

function UploadForm({ onUploadSuccess, apiBaseUrl }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      console.log("Uploading to:", `${apiBaseUrl}/upload`);

      const response = await axios.post(
        `${apiBaseUrl}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", response.data);

      if (response && response.data) {
        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }
      }

      alert("✅ File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);

      if (error.response) {
        alert(
          `❌ Upload failed: ${
            error.response.data?.detail || "Server error"
          }`
        );
      } else if (error.request) {
        alert("❌ No response from server. Check backend connection.");
      } else {
        alert("❌ Upload error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "2px solid #4CAF50",
        borderRadius: "8px",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2>📁 Step 1: Upload Dataset</h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ marginRight: "10px" }}
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#ccc" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "14px",
        }}
      >
        {loading ? "⏳ Uploading..." : "📤 Upload"}
      </button>
    </div>
  );
}

export default UploadForm;