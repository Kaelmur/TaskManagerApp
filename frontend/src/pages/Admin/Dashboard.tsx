import { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import moment from "moment/min/moment-with-locales";
import { IoMdCard } from "react-icons/io";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";
import Spinner from "@/components/Spinner";

moment.locale("ru");

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

function Dashboard() {
  interface DashboardData {
    charts: {
      taskDistribution: {
        All: number;
        Pending: number;
        InProgress: number;
        Completed: number;
      };
    };
    recentTasks: Array<{
      _id: string;
      title: string;
      status: string;
      priority: string;
      planId: string;
      dueDate: string;
    }>;
    statistics: {
      completedTask: number;
      overdueTask: number;
      pendingTask: number;
      totalTasks: number;
    };
  }

  type TaskDistribution = {
    Pending?: number;
    InProgress?: number;
    Completed?: number;
  };

  type TaskPriorityLevels = {
    Low?: number;
    Medium?: number;
    High?: number;
  };

  type ChartDataInput = {
    taskDistribution?: TaskDistribution;
    taskPriorityLevels?: TaskPriorityLevels;
  };

  type PieChartDatum = {
    status: string;
    count: number;
  };

  type BarChartDatum = {
    priority: string;
    count: number;
  };

  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [pieChartData, setPieChartData] = useState<PieChartDatum[]>([]);
  const [barChartData, setBarChartData] = useState<BarChartDatum[]>([]);

  const date = moment().format("dddd Do MMM YYYY");

  // Prepare Chart Data
  const prepareChartData = (data: ChartDataInput) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData: PieChartDatum[] = [
      { status: "Ожидающих", count: taskDistribution?.Pending || 0 },
      { status: "Задач в работе", count: taskDistribution?.InProgress || 0 },
      { status: "Законченные задачи", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData: BarChartDatum[] = [
      {
        priority: "Низкий",
        count: taskPriorityLevels?.Low || 0,
      },
      {
        priority: "Средний",
        count: taskPriorityLevels?.Medium || 0,
      },
      {
        priority: "Высокий",
        count: taskPriorityLevels?.High || 0,
      },
    ];

    setBarChartData(PriorityLevelData);
  };

  const getDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Главная">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px] w-full">
          <Spinner />
        </div>
      ) : (
        <div>
          <div className="card my-5">
            <div>
              <div className="col-span-3">
                <h2 className="text-xl md:text-2xl">
                  Добро пожаловать, {user?.name}!
                </h2>
                <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                  {date.charAt(0).toUpperCase() + date.slice(1)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
              <InfoCard
                icon={<IoMdCard />}
                label="Задач"
                value={Number(
                  addThousandsSeparator(
                    dashboardData?.charts?.taskDistribution?.All || 0
                  )
                )}
                color="bg-primary dark:bg-blue-300"
              />

              <InfoCard
                icon={<></>}
                label="Ожидающих задач"
                value={Number(
                  addThousandsSeparator(
                    dashboardData?.charts?.taskDistribution?.Pending || 0
                  )
                )}
                color="bg-violet-500 dark:bg-violet-400"
              />

              <InfoCard
                icon={<></>}
                label="Задач в работе"
                value={Number(
                  addThousandsSeparator(
                    dashboardData?.charts?.taskDistribution?.InProgress || 0
                  )
                )}
                color="bg-cyan-500 dark:bg-cyan-400"
              />

              <InfoCard
                icon={<></>}
                label="Законченные задачи"
                value={Number(
                  addThousandsSeparator(
                    dashboardData?.charts?.taskDistribution?.Completed || 0
                  )
                )}
                color="bg-lime-500 dark:bg-lime-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
            <div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Распределение задач</h5>
                </div>

                <CustomPieChart data={pieChartData} colors={COLORS} />
              </div>
            </div>

            <div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Уровни приоритета задач</h5>
                </div>

                <CustomBarChart data={barChartData} />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg">Недавние задачи</h5>

                  <button className="card-btn" onClick={onSeeMore}>
                    Все задачи
                    <LuArrowRight className="text-base" />
                  </button>
                </div>

                <TaskListTable tableData={dashboardData?.recentTasks || []} />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
