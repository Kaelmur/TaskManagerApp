import moment from "moment/min/moment-with-locales";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

type Plan = {
  name: string;
};

type Task = {
  _id: string;
  title: string;
  status: "Completed" | "Pending" | "In Progress" | string;
  priority: "High" | "Medium" | "Low" | string;
  planId: Plan | string;
  createdAt?: string;
};

type TaskListTableProps = {
  tableData: Task[];
};

function TaskListTable({ tableData }: TaskListTableProps) {
  const { user } = useContext(UserContext);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-500 border border-green-200";
      case "Pending":
        return "bg-purple-100 text-purple-500 border border-purple-200";
      case "In Progress":
        return "bg-cyan-100 text-cyan-500 border border-cyan-200";
      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-500 border border-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-500 border border-orange-200";
      case "Low":
        return "bg-green-100 text-green-500 border border-green-200";
      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Completed":
        return "Завершенная";
      case "Pending":
        return "В ожидании";
      case "In Progress":
        return "В работе";
      default:
        return status;
    }
  };

  const getPriorityLabel = (status: string) => {
    switch (status) {
      case "High":
        return "Высокий";
      case "Medium":
        return "Средний";
      case "Low":
        return "Низкий";
      default:
        return status;
    }
  };

  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">
              Название
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">
              Статус
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">
              Приоритет
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell">
              {user?.role === "admin" ? "План" : "Создано"}
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((task) => (
            <tr key={task._id} className="border-t border-gray-200">
              <td className="my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden">
                {task.title}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(
                    task.status
                  )}`}
                >
                  {getStatusLabel(task.status)}
                </span>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(
                    task.priority
                  )}`}
                >
                  {getPriorityLabel(task.priority)}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">
                {user?.role === "admin"
                  ? typeof task.planId === "object" &&
                    task.planId !== null &&
                    "name" in task.planId
                    ? task.planId.name
                    : "N/A"
                  : task.createdAt
                  ? moment(task.createdAt).format("Do MMM YYYY")
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskListTable;
