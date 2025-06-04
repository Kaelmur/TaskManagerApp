import React, { useRef, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { HiOutlineTrash } from "react-icons/hi";
import toast from "react-hot-toast";

function AttachmentsFileUpload({ taskId, setTask }) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );
    setFiles(validFiles);

    e.target.value = null;
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
    } catch (err) {
      setUploadStatus("Upload failed.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-xl w-full max-w-2xl mx-auto">
      <p className="mb-4 text-lg font-medium text-gray-700 text-center">
        Загрузить вложения
      </p>

      <div className="flex items-center gap-4 mb-4 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Выбрать файл
        </button>

        <button
          type="button"
          onClick={handleUpload}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Отправить
        </button>
      </div>

      <input
        type="file"
        multiple
        accept="image/*,video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {files.length > 0 && (
        <div className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gray-300">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center bg-gray-100 border border-gray-200 rounded-md p-2 w-32 flex-shrink-0"
            >
              <div className="text-xs text-gray-700 text-center truncate w-full">
                {file.name}
              </div>
              <button
                onClick={() => handleRemoveFile(index)}
                className="absolute top-1 right-1 text-red-500 hover:text-red-700"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadStatus && (
        <p className="mt-4 text-sm text-center text-gray-500">{uploadStatus}</p>
      )}
    </div>
  );
}

export default AttachmentsFileUpload;
