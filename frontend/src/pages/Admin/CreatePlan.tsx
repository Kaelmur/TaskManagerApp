import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import { useEffect, useState } from "react";
import SelectUsers from "../../components/Inputs/SelectUsers";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

type PlanData = {
  name: string;
  goal: number;
  startDate: Date | null | string;
  endDate: Date | null | string;
  tasks: string[];
  assignedTo: string[];
};

type PlanDetailsResponse = {
  name: string;
  goal: number;
  startDate: string;
  endDate: string;
  tasks: string[];
  assignedTo: { _id: string }[];
};

function CreatePlan() {
  const location = useLocation();
  const { planId } = location.state || {};
  const navigate = useNavigate();

  const [planData, setPlanData] = useState<PlanData>({
    name: "",
    goal: 0,
    startDate: null,
    endDate: null,
    tasks: [],
    assignedTo: [],
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);

  const handleValueChange = <K extends keyof PlanData>(
    key: K,
    value: PlanData[K]
  ) => {
    setPlanData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // resetForm
    setPlanData({
      name: "",
      goal: 0,
      startDate: null,
      endDate: null,
      tasks: [],
      assignedTo: [],
    });
  };

  // Create Plan
  const createPlan = async () => {
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.PLANS.CREATE_PLAN, {
        ...planData,
        startDate: planData.startDate
          ? new Date(planData.startDate).toISOString()
          : null,
        endDate: planData.endDate
          ? new Date(planData.endDate).toISOString()
          : null,
      });

      toast.success("План успешно создан");

      clearData();
      navigate("/admin/plans");
    } catch (error) {
      console.error("Error creating task:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Update Task
  const updatePlan = async () => {
    setLoading(true);

    try {
      await axiosInstance.put(API_PATHS.PLANS.UPDATE_PLAN(planId), {
        ...planData,
        startDate: planData.startDate
          ? new Date(planData.startDate).toISOString()
          : null,
        endDate: planData.endDate
          ? new Date(planData.endDate).toISOString()
          : null,
      });

      toast.success("План успешно обновлен");
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");

    // Input validation
    if (!planData.name.trim()) {
      setError("Требуется указать название.");
      return;
    }
    if (!planData.goal) {
      setError("Требуется указать цель.");
      return;
    }
    if (!planData.startDate) {
      setError("Дата начала обязательна.");
      return;
    }

    if (!planData.endDate) {
      setError("Дата окончания обязательна.");
      return;
    }

    if (planData.assignedTo?.length === 0) {
      setError("Задача, не назначена ни одному участнику.");
      return;
    }

    if (planId) {
      updatePlan();
      navigate("/admin/plans");
      return;
    }

    createPlan();
    navigate("/admin/plans");
  };

  // get Plan by ID
  const getPlanDetailsByID = async () => {
    try {
      const response = await axiosInstance.get<PlanDetailsResponse>(
        API_PATHS.PLANS.GET_PLAN_BY_ID(planId)
      );

      if (response.data) {
        const planInfo = response.data;

        setPlanData({
          name: planInfo.name,
          goal: planInfo.goal,
          startDate: planInfo.startDate
            ? moment(planInfo.startDate).format("YYYY-MM-DD")
            : null,
          endDate: planInfo.endDate
            ? moment(planInfo.endDate).format("YYYY-MM-DD")
            : null,
          assignedTo: planInfo?.assignedTo?.map((user) => user?._id) || [],
          tasks: planInfo?.tasks || [],
        });
      }
    } catch (error) {
      console.error("Ошибка при получении плана:", error);
    }
  };

  // Delete Task
  const deletePlan = async () => {
    try {
      await axiosInstance.delete(API_PATHS.PLANS.DELETE_PLAN(planId));

      setOpenDeleteAlert(false);
      toast.success("План удален");
      navigate("/admin/plans");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting plan:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    if (planId) {
      getPlanDetailsByID();
    }
  }, [planId]);

  return (
    <DashboardLayout activeMenu="Планы">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {planId ? "Обновить План" : "Создать План"}
              </h2>

              {planId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Удалить
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Название Плана
              </label>

              <input
                placeholder="Впишите название плана"
                className="form-input"
                value={planData.name}
                onChange={({ target }) =>
                  handleValueChange("name", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Цель
              </label>

              <input
                type="number"
                placeholder="1000"
                className="form-input"
                value={planData.goal === 0 ? "" : planData.goal}
                onChange={({ target }) =>
                  handleValueChange("goal", Number(target.value))
                }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Дата начала
                </label>

                <input
                  className="form-input custom-date"
                  value={planData.startDate ? String(planData.startDate) : ""}
                  onChange={({ target }) =>
                    handleValueChange("startDate", target.value)
                  }
                  type="date"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Дата окончания
                </label>

                <input
                  className="form-input custom-date"
                  value={planData.endDate ? String(planData.endDate) : ""}
                  onChange={({ target }) =>
                    handleValueChange("endDate", target.value)
                  }
                  type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Назначено
                </label>

                <SelectUsers
                  selectedUsers={planData.assignedTo}
                  setSelectedUsers={(value) =>
                    handleValueChange(
                      "assignedTo",
                      value as PlanData["assignedTo"]
                    )
                  }
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {planId ? "Обновить План" : "Создать План"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Удалить План"
      >
        <DeleteAlert
          content="Вы уверены что хотите удалить план?"
          onDelete={() => deletePlan()}
        />
      </Modal>
    </DashboardLayout>
  );
}

export default CreatePlan;
