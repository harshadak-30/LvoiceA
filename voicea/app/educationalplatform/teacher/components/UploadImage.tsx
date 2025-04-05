"use client";

import { useState } from "react";

export default function UploadImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image file.");

    const formData = new FormData();
    formData.append("image", selectedFile);

    const response = await fetch("http://localhost:5000/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Image uploaded successfully!");
      setSelectedFile(null);
    } else {
      alert("Failed to upload image.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Upload
      </button>
    </div>
  );
}
