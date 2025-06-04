import AvatarGroup from "../AvatarGroup";
import Progress from "../Progress";
import moment from "moment/min/moment-with-locales";

interface PlanCardProps {
  name: string;
  goal: number;
  startDate: string;
  endDate: string;
  completedAmount: number;
  assignedTo: string[];
  progress: number;
  status: string;
  onClick: () => void;
}

function PlanCard({
  name,
  goal,
  startDate,
  endDate,
  completedAmount,
  progress,
  assignedTo,
  status,
  onClick,
}: PlanCardProps) {
  const getStatusTagColor = () => {
    switch (status) {
      case "Active":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/10";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Active":
        return "Активный";
      case "Completed":
        return "Законченный";
    }
  };

  //   const getPriorityTagColor = () => {
  //     switch (priority) {
  //       case "Low":
  //         return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
  //       case "Medium":
  //         return "text-amber-500 bg-amber-50 border border-amber-500/10";
  //       default:
  //         return "text-rose-500 bg-rose-50 border border-rose-500/10";
  //     }
  //   };

  return (
    <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
          {getStatusLabel(status)}
        </div>
      </div>

      <div
        className={`px-4 border-l-[3px] ${
          status === "Active" ? "border-cyan-500" : "border-indigo-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
          {name}
        </p>
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
          Цель - {goal}
        </p>
        <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
          Выполнено:{" "}
          <span className="font-semibold text-gray-700">
            {completedAmount} / {goal}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500">Дата начала</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(startDate).format("Do MMM YYYY")}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Дата окончания</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(endDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} maxVisible={3} />
        </div>
      </div>
    </div>
  );
}

export default PlanCard;
