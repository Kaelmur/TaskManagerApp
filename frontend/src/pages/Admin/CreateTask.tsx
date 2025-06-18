import DashboardLayout from "../../components/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2, LuDownload } from "react-icons/lu";
import { useEffect, useState } from "react";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import Attachment from "../../components/Attachment";
import axios from "axios";

type TodoChecklistItem = {
  text: string;
  completed: boolean;
};

type AttachmentFile = {
  url: string;
};

type TaskData = {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string | null;
  assignedTo: string[];
  todoChecklist: TodoChecklistItem[];
  attachments: AttachmentFile[];
  amount: number;
  planId: string;
};

type ServerTaskData = Omit<TaskData, "assignedTo"> & {
  _id: string;
  assignedTo: { _id: string; name: string }[];
};

function CreateTask() {
  const location = useLocation();
  const { taskId }: { taskId?: string } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
    amount: 0,
    planId: "",
  });

  const [currentTask, setCurrentTask] = useState<ServerTaskData | null>(null);
  const [plans, setPlans] = useState<{ _id: string; name: string }[]>([]);

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);

  const handleValueChange = <K extends keyof TaskData>(
    key: K,
    value: TaskData[K]
  ) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // resetForm
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
      amount: 0,
      planId: "",
    });
  };

  // Create Task
  const createTask = async () => {
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : null,
        todoChecklist: taskData.todoChecklist,
      });

      toast.success("Задача успешно создана");
      navigate("/admin/tasks");

      clearData();
    } catch (error) {
      console.error("Ошибка при создании Задачи:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Update Task
  const updateTask = async () => {
    setLoading(true);

    try {
      const todoList: TodoChecklistItem[] = taskData.todoChecklist?.map(
        (item) => {
          const prevTodoChecklist = currentTask?.todoChecklist || [];
          const matchedTask = prevTodoChecklist.find(
            (task: TodoChecklistItem) => task.text === item.text
          );

          return {
            text: item.text,
            completed: matchedTask ? matchedTask.completed : false,
          };
        }
      );

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId!), {
        ...taskData,
        dueDate: new Date(taskData.dueDate!).toISOString(),
        todoChecklist: todoList,
      });

      toast.success("Задача успешно обновлена");
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error updating task:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");

    // Input validation
    if (!taskData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due Date is required.");
      return;
    }

    if (taskData.assignedTo?.length === 0) {
      setError("Task not assigned to any member.");
      return;
    }

    if (taskData.todoChecklist?.length === 0) {
      setError("Add atleast one todo task");
      return;
    }

    if (!taskData.planId) {
      setError("Выберите план для задачи.");
      return;
    }

    if (taskId) {
      updateTask();
      return;
    }

    createTask();
  };

  // get Task by ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get<ServerTaskData>(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId!)
      );

      if (response.data) {
        const taskInfo = response.data;

        setCurrentTask(taskInfo);

        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist: taskInfo.todoChecklist,
          attachments: taskInfo?.attachments || [],
          amount: taskInfo?.amount,
          planId: taskInfo?.planId,
        });
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  // Delete Task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId!));

      setOpenDeleteAlert(false);
      toast.success("Задача успешно удаленна");
      navigate("/admin/tasks");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Request failed");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  const downloadAttachments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.get(
        API_PATHS.TASKS.DOWNLOAD_ATTACHMENT(taskId!),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `task-${taskId}-attachments.zip`);
      document.body.appendChild(link);
      link.click();

      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Ошибка загрузки", err);
      toast.error("Не удалось загрузить вложения");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.PLANS.GET_ALL_PLANS);
        const planArray = Array.isArray(response.data.plans)
          ? response.data.plans
          : [];
        setPlans(planArray);
      } catch (err) {
        console.error("fetch plans", err);
        setPlans([]);
      }
    };

    fetchPlans();

    if (taskId) {
      getTaskDetailsByID();
    }
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Задачи">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Обновить Задачу" : "Создать Задачу"}
              </h2>

              {taskId && (
                <div className="flex gap-3">
                  <button
                    className={`flex items-center gap-1.5 text-[13px] font-medium rounded px-2 py-1 border 
        ${
          loading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-100 border-blue-100 dark:border-blue-200 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer"
        }
      `}
                    onClick={() => downloadAttachments()}
                    disabled={loading}
                  >
                    <LuDownload className="text-base" />{" "}
                    {loading ? "Скачивание..." : "Скачать вложения"}
                  </button>
                  <button
                    className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                    onClick={() => setOpenDeleteAlert(true)}
                  >
                    <LuTrash2 className="text-base" /> Удалить
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Название Задачи
              </label>

              <input
                placeholder="Впишите Название Задачи"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Описание
              </label>

              <textarea
                placeholder="Опишите задачу"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                План
              </label>
              <select
                className="form-input"
                value={taskData.planId || ""}
                onChange={(e) => handleValueChange("planId", e.target.value)}
              >
                <option value="" disabled>
                  Выберите план
                </option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Приоритет
                </label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) =>
                    handleValueChange("priority", value as TaskData["priority"])
                  }
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Дата окончания
                </label>

                <input
                  placeholder="Create App UI"
                  className="form-input custom-date"
                  value={taskData.dueDate ? String(taskData.dueDate) : ""}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                  type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Назначено
                </label>

                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) =>
                    handleValueChange(
                      "assignedTo",
                      value as TaskData["assignedTo"]
                    )
                  }
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Объем
              </label>

              <input
                type="number"
                placeholder="100"
                className="form-input"
                value={taskData.amount === 0 ? "" : taskData.amount}
                onChange={({ target }) =>
                  handleValueChange("amount", Number(target.value))
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Список работ
              </label>

              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value: TodoChecklistItem[]) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            {taskData.attachments?.length > 0 && (
              <div className="mt-6">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-300">
                  Вложения
                </label>
                {taskData.attachments.map((link, index) => (
                  <Attachment key={index} link={link} index={index} />
                ))}
              </div>
            )}

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "Обновить" : "Создать"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Удалить Задачу"
      >
        <DeleteAlert
          content="Вы уверены, что хотите удалить это задачу?"
          onDelete={() => deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
}

export default CreateTask;
