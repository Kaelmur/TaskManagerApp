import DEFAULT_AVATAR from "../../assets/images/default.png";

interface UserInfo {
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

interface StatCardProps {
  label: string;
  count: number;
  status: "Pending" | "In Progress" | "Completed";
}

function UserCard({ userInfo }: { userInfo: UserInfo }) {
  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={userInfo?.profileImageUrl || DEFAULT_AVATAR}
            alt={`Avatar`}
            className="w-12 h-12 rounded-full border-2 border-white dark:border-black"
          />

          <div>
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 mt-5">
        <StatCard
          label="В ожидании"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="В процессе"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Завершено"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
}

export default UserCard;

const StatCard = ({ label, count, status }: StatCardProps) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 dark:text-cyan-300 bg-gray-50";

      case "Completed":
        return "text-indigo-500 dark:text-indigo-300 bg-gray-50";

      default:
        return "text-violet-500 dark:text-violet-400 bg-gray-50";
    }
  };

  return (
    <div
      className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded min-h-[20px] dark:bg-gray-800`}
    >
      <span className="text-[14px] font-semibold leading-none">{count} </span>
      {label}
    </div>
  );
};
