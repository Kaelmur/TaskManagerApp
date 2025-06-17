import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment/min/moment-with-locales";

interface TaskCardProps {
  title: string;
  description: string;
  priority: string;
  status: string;
  progress: number;
  createdAt: string;
  dueDate: string;
  assignedTo: string[];
  attachmentCount: number;
  completedTodoCount: number;
  todoChecklist: { text: string; completed: boolean }[];
  planName: string;
  onClick: () => void;
  amount: number;
}

function TaskCard({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  planName,
  onClick,
  amount,
}: TaskCardProps) {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 dark:bg-cyan-10 border border-cyan-500/10 dark:border-cyan-400/10";
      case "Completed":
        return "text-lime-500 dark:text-lime-600 bg-lime-50 dark:bg-lime-20 border border-lime-500/10";
      default:
        return "text-violet-500 dark:text-violet-600 bg-violet-50 dark:bg-violet-20 border border-violet-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-500 dark:text-emerald-600 bg-emerald-50 dark:bg-emerald-20 border border-emerald-500/10 dark:border-emerald-400/10";
      case "Medium":
        return "text-amber-500 dark:text-amber-600 bg-amber-50 dark:bg-amber-20 border border-amber-500/10 dark:border-amber-400/10";
      default:
        return "text-rose-500 dark:text-rose-600 bg-rose-50 dark:bg-rose-20 border border-rose-500/10";
    }
  };

  return (
    <div
      className="bg-white dark:bg-darksecondary rounded-xl py-4 shadow-md dark:shadow-xs shadow-gray-100 dark:shadow-gray-500 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
          {(() => {
            switch (status) {
              case "Completed":
                return "Завершено";
              case "In Progress":
                return "В процессе";
              case "Pending":
                return "В ожидании";
              default:
                return "Pending";
            }
          })()}
        </div>
        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}
        >
          {(() => {
            switch (priority) {
              case "Low":
                return "Низкий";
              case "Medium":
                return "Средний";
              case "High":
                return "Высокий";
            }
          })()}{" "}
          Приоритет
        </div>
      </div>

      <div
        className={`px-4 border-l-[3px] ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-indigo-500"
            : "border-violet-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-800 dark:text-white mt-4 line-clamp-2">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>
        <p className="text-[13px] text-gray-700/80 dark:text-gray-100/80 font-medium mt-2 mb-2 leading-[18px]">
          Работ выполнено:{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {completedTodoCount} / {todoChecklist.length || 0}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Дата начала
            </label>
            <p className="text-[13px] font-medium text-gray-900 dark:text-gray-300">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Дата окончания
            </label>
            <p className="text-[13px] font-medium text-gray-900 dark:text-gray-300">
              {moment(dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} maxVisible={3} />

          <span className="text-xs">
            <b>Объем: {amount}</b>
          </span>

          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-100 px-2.5 py-1.5 rounded-lg">
              <LuPaperclip className="text-primary dark:text-blue-400" />{" "}
              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-start mt-3">
          <span className="text-sm text-black dark:text-white">
            План: {planName}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
