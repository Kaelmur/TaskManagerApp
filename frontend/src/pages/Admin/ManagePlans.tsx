import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DashboardLayout from "../../components/DashboardLayout";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import PlanCard from "../../components/Cards/PlanCard";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

interface User {
  profileImageUrl: string;
}

interface Plan {
  _id: string;
  name: string;
  goal: number;
  startDate: string;
  endDate: string;
  completedAmount: number;
  assignedTo: User[];
  progress: number;
  status: string;
}

interface StatusTab {
  label: string;
  count: number;
}

function ManagePlans() {
  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  const [tabs, setTabs] = useState<StatusTab[]>([]);
  const [filterStatus, setFilterStatus] = useState("Все");

  const navigate = useNavigate();

  const getAllPlans = async (status: string) => {
    setLoading(true);

    try {
      let apiStatus = "";
      switch (status) {
        case "Активные":
          apiStatus = "Active";
          break;
        case "Законченные":
          apiStatus = "Completed";
          break;
        default:
          apiStatus = ""; // "Все"
      }
      const response = await axiosInstance.get(API_PATHS.PLANS.GET_ALL_PLANS, {
        params: {
          status: apiStatus,
        },
      });

      setAllPlans(response.data?.plans?.length > 0 ? response.data.plans : []);

      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "Все", count: statusSummary.all || 0 },
        { label: "Активные", count: statusSummary.activePlans || 0 },
        { label: "Законченные", count: statusSummary.completedPlans || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (PlanData: Plan) => {
    navigate("/admin/create-plan", { state: { planId: PlanData._id } });
  };

  // download plan report
  //   const handleDownloadReport = async () => {
  //     try {
  //       const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
  //         responseType: "blob",
  //       });

  //       // Create a URL for the blob
  //       const url = window.URL.createObjectURL(new Blob([response.data]));
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", "task_details.xlsx");
  //       document.body.appendChild(link);
  //       link.click();
  //       link.parentNode?.removeChild(link);
  //       window.URL.revokeObjectURL(url);
  //     } catch (error) {
  //       console.error("Error downloading expense details:", error);
  //       toast.error("Failed to download expense details. Please try again.");
  //     }
  //   };

  useEffect(() => {
    getAllPlans(filterStatus);
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Планы">
      <div className="my-5">
        <Button
          onClick={() => navigate("/admin/create-plan")}
          className="fixed bottom-6 right-6 z-50 bg-primary text-white dark:text-black px-5 py-3 rounded-full shadow-lg dark:shadow-sm shadow-gray-400 dark:shadow-gray-600 hover:bg-blue-700 dark:hover:bg-gray-400 transition cursor-pointer"
        >
          + Создать план
        </Button>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">Планы</h2>

            {/* <button
              className="flex lg:hidden download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button> */}
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              {/* <button
                className="hidden lg:flex download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button> */}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] w-full">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {allPlans?.map((item) => (
              <PlanCard
                key={item._id}
                name={item.name}
                goal={item.goal}
                startDate={item.startDate}
                endDate={item.endDate}
                completedAmount={item.completedAmount}
                progress={item.progress}
                status={item.status}
                assignedTo={item.assignedTo?.map(
                  (user) => user.profileImageUrl
                )}
                onClick={() => {
                  handleClick(item);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ManagePlans;
