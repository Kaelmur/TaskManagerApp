import React, { useRef, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

function AttachmentsFileUpload({ taskId, setTask }) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("attachments", file));

    try {
      setUploadStatus("Uploading...");
      const response = await axiosInstance.post(
        API_PATHS.TASKS.UPLOAD_ATTACHMENT(taskId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTask(response.data.task);
      setFiles([]);
      setUploadStatus("Upload successful!");
      console.log(response.data);
    } catch (err) {
      setUploadStatus("Upload failed.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white shadow rounded-xl w-full max-w-md mx-auto">
      <p className="mb-4 text-lg font-medium text-gray-700">Upload Files</p>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="mb-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Choose Files
      </button>

      {files.length > 0 && (
        <ul className="text-sm text-gray-600 mb-2 w-full text-center">
          {files.map((file, i) => (
            <li key={i}>{file.name}</li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={handleUpload}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Upload
      </button>

      {uploadStatus && (
        <p className="mt-4 text-sm text-gray-500">{uploadStatus}</p>
      )}
    </div>
  );
}

export default AttachmentsFileUpload;
