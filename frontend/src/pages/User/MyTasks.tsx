import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";

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

function MyTasks() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  const [tabs, setTabs] = useState<StatusTab[]>([]);
  const [filterStatus, setFilterStatus] = useState("Все");

  const navigate = useNavigate();

  const getAllTasks = async (status: string) => {
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
        { label: "В процессе", count: statusSummary.inProgressTasks || 0 },
        { label: "Завершено", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleClick = (taskId: string) => {
    navigate(`/user/task-details/${taskId}`);
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Мои Задачи">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Мои Задачи</h2>

          {tabs?.[0]?.count > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

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
              assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoChecklist || []}
              planName={item.planId?.name}
              amount={item.amount}
              onClick={() => {
                handleClick(item._id);
              }}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MyTasks;
