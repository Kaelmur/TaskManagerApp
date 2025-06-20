import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

interface Plan {
  _id: string;
  name: string;
  startDate: string;
}

interface User {
  profileImageUrl: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  createdAt: string;
  dueDate: string;
  assignedTo: User[];
  attachmentCount: number;
  attachments: [];
  completedTodoCount: number;
  todoChecklist: [];
  planId: Plan;
  amount: number;
}

interface StatusTab {
  label: string;
  count: number;
}

function ManageTasks() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const [tabs, setTabs] = useState<StatusTab[]>([]);
  const [filterStatus, setFilterStatus] = useState("Все");

  const navigate = useNavigate();

  const getAllTasks = async (status: string) => {
    setLoading(true);
    try {
      let apiStatus = "";
      switch (status) {
        case "В ожидании":
          apiStatus = "Pending";
          break;
        case "В процессе":
          apiStatus = "In Progress";
          break;
        case "Завершено":
          apiStatus = "Completed";
          break;
        default:
          apiStatus = ""; // "Все"
      }
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: apiStatus,
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      // Map statusSummary data with fixed labels and order
      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "Все", count: statusSummary.all || 0 },
        { label: "В ожидании", count: statusSummary.pendingTasks || 0 },
        { label: "В процессе", count: statusSummary.inProgress || 0 },
        { label: "Завершено", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (taskData: Task) => {
    navigate("/admin/create-task", { state: { taskId: taskData._id } });
  };

  // download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "детали_задач.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading task details:", error);
      toast.error(
        "Не удалось загрузить подробную информацию о задаче. Пожалуйста, попробуйте снова."
      );
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Задачи">
      <div className="my-5">
        <Button
          onClick={() => navigate("/admin/create-task")}
          className="fixed bottom-6 right-6 z-50 bg-primary text-white dark:text-black px-5 py-3 rounded-full shadow-lg dark:shadow-sm shadow-gray-400 dark:shadow-gray-600 hover:bg-blue-700 dark:hover:bg-gray-400 transition cursor-pointer"
        >
          + Создать задачу
        </Button>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">Задачи</h2>

            <button
              className="flex lg:hidden download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Скачать отчет
            </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button
                className="hidden lg:flex download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Скачать отчет
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] w-full">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {allTasks?.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.planId?.startDate}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map(
                  (item) => item.profileImageUrl
                )}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                planName={item.planId?.name}
                onClick={() => {
                  handleClick(item);
                }}
                amount={item.amount}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ManageTasks;
