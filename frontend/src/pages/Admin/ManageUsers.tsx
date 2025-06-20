import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";

interface User {
  _id: string;
  name: string;
  email: string;
  profileImageUrl: string;
  role: "member" | "admin";
  createdAt: string;
  updatedAt: string;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}

function ManageUsers() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  // donwload task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "отчет_о_пользователях.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Ошибка при загрузке деталей о пользователях.");
    }
  };

  useEffect(() => {
    getAllUsers();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Работники">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Работники</h2>

          <button
            className="flex md:flex download-btn"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Скачать отчет
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] w-full">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {allUsers?.map((user) => (
              <UserCard key={user._id} userInfo={user} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ManageUsers;
