import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DashboardLayout from "../../components/DashboardLayout";
import moment from "moment";
import AvatarGroup from "../../components/AvatarGroup";
import AttachmentsFileUpload from "../../components/Inputs/AttachmentsFileUpload";
import Spinner from "../../components/Spinner";
import Attachment from "../../components/Attachment";
import { Priority, Status, Task } from "../../types/task";

const priorityMapping: Record<Priority, string> = {
  Low: "Низкий",
  Medium: "Средний",
  High: "Высокий",
};

const statusMapping: Record<Status, string> = {
  "In Progress": "В процессе",
  Completed: "Завершено",
  Pending: "В ожидании",
};

function ViewTaskDetails() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);

  const getStatusTagColor = (status: Status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 dark:bg-cyan-10 border border-cyan-500/10 dark:border-cyan-400/10";

      case "Completed":
        return "text-lime-500 dark:text-lime-600 bg-lime-50 dark:bg-lime-20 border border-lime-500/10";

      default:
        return "text-violet-500 dark:text-violet-600 bg-violet-50 dark:bg-violet-20 border border-violet-500/10";
    }
  };

  // get Task info by ID
  const getTaskDetailsByID = async () => {
    if (!id) {
      console.error("ID is undefined");
      return;
    }

    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );

      if (response.data) {
        const taskInfo: Task = response.data;
        setTask(taskInfo);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // handle todo check
  const updateTodoChecklist = async (index: number) => {
    if (!task) return;

    const todoChecklist = [...task.todoChecklist];
    const taskId = id;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;

      try {
        const response = await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId as string),
          { todoChecklist }
        );
        if (response.status === 200) {
          setTask(response.data?.task || task);
        } else {
          // Optionally revert the toggle if the API call fails.
          todoChecklist[index].completed = !todoChecklist[index].completed;
        }
      } catch (error) {
        todoChecklist[index].completed = !todoChecklist[index].completed;
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
    return () => {};
  }, [id]);

  if (!task) return <Spinner />;

  return (
    <DashboardLayout activeMenu="Мои Задачи">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-xl font-medium">
                  {task?.title}
                </h2>

                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(
                    task?.status
                  )} px-4 py-0.5 rounded`}
                >
                  {statusMapping[task?.status] || task?.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Описание" value={task?.description} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Приоритет"
                    value={priorityMapping[task?.priority] || task?.priority}
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Дата окончания"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("Do MMM YYYY")
                        : "N/A"
                    }
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-200">
                    Назначено
                  </label>

                  <AvatarGroup
                    avatars={
                      task?.assignedTo?.map((item) => item?.profileImageUrl) ||
                      []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-200">
                  Список работ
                </label>

                {task?.todoChecklist?.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item?.completed}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>

              <div className="mt-6 text-sm">
                {typeof id === "string" && (
                  <AttachmentsFileUpload taskId={id} setTask={setTask} />
                )}
              </div>

              {task.attachments?.length > 0 && (
                <div className="mt-6">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-200">
                    Вложения
                  </label>
                  {task.attachments.map((link, index) => (
                    <Attachment key={index} link={link} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ViewTaskDetails;

interface InfoBoxProps {
  label: string;
  value: string | number | null;
}

const InfoBox = ({ label, value }: InfoBoxProps) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500 dark:text-slate-200">
        {label}
      </label>

      <p className="text-[12px] md:text-[13px] font-medium text-gray-700 dark:text-gray-400 mt-0.5">
        {value}
      </p>
    </>
  );
};

interface TodoCheckListProps {
  text: string;
  isChecked: boolean;
  onChange: () => void;
}

const TodoCheckList = ({ text, isChecked, onChange }: TodoCheckListProps) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        disabled={isChecked}
        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
      />

      <p className="text-[13px] text-gray-800 dark:text-gray-300">{text}</p>
    </div>
  );
};
