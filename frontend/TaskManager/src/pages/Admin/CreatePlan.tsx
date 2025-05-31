import DashboardLayout from "../../components/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import { useEffect, useState } from "react";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

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
      const response = await axiosInstance.post(API_PATHS.PLANS.CREATE_PLAN, {
        ...planData,
        startDate: planData.startDate
          ? new Date(planData.startDate).toISOString()
          : null,
        endDate: planData.endDate
          ? new Date(planData.endDate).toISOString()
          : null,
      });

      toast.success("Task Created Successfully");

      clearData();
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
      const response = await axiosInstance.put(
        API_PATHS.PLANS.UPDATE_PLAN(planId),
        {
          ...planData,
          startDate: new Date(planData.startDate).toISOString(),
          endDate: new Date(planData.endDate).toISOString(),
        }
      );

      toast.success("Task Updated Successfully");
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
    if (!planData.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!planData.goal) {
      setError("Goal is required.");
      return;
    }
    if (!planData.startDate) {
      setError("Start Date is required.");
      return;
    }

    if (!planData.endDate) {
      setError("End Date is required.");
      return;
    }

    if (planData.assignedTo?.length === 0) {
      setError("Task not assigned to any member.");
      return;
    }

    if (planId) {
      updatePlan();
      return;
    }

    createPlan();
    navigate("/admin/plans");
  };

  // get Plan by ID
  const getPlanDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.PLANS.GET_PLAN_BY_ID(planId)
      );

      if (response.data) {
        const planInfo = response.data;

        setPlanData((prevState) => ({
          name: planInfo.name,
          goal: planInfo.goal,
          startDate: planInfo.startDate
            ? moment(planInfo.startDate).format("YYYY-MM-DD")
            : null,
          endDate: planInfo.endDate
            ? moment(planInfo.endDate).format("YYYY-MM-DD")
            : null,
          assignedTo: planInfo?.assignedTo?.map((item) => item?._id) || [],
          tasks: planInfo?.tasks || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching plan details:", error);
    }
  };

  // Delete Task
  const deletePlan = async () => {
    try {
      await axiosInstance.delete(API_PATHS.PLANS.DELETE_PLAN(planId));

      setOpenDeleteAlert(false);
      toast.success("Plan deleted successfully");
      navigate("/admin/plans");
    } catch (error) {
      console.error(
        "Error deleting Plan",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    if (planId) {
      getPlanDetailsByID();
    }
    return () => {};
  }, [planId]);

  return (
    <DashboardLayout activeMenu="Plans">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {planId ? "Update Plan" : "Create Plan"}
              </h2>

              {planId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Plan Name
              </label>

              <input
                placeholder="Create new website"
                className="form-input"
                value={planData.name}
                onChange={({ target }) =>
                  handleValueChange("name", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Goal</label>

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
                <label className="text-xs font-medium text-slate-600">
                  Start Date
                </label>

                <input
                  className="form-input"
                  value={planData.startDate ? String(planData.startDate) : ""}
                  onChange={({ target }) =>
                    handleValueChange("startDate", target.value)
                  }
                  type="date"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  End Date
                </label>

                <input
                  className="form-input"
                  value={planData.endDate ? String(planData.endDate) : ""}
                  onChange={({ target }) =>
                    handleValueChange("endDate", target.value)
                  }
                  type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
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
                {planId ? "UPDATE PLAN" : "CREATE PLAN"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Plan"
      >
        <DeleteAlert
          content="Are you sure you want to delete this plan?"
          onDelete={() => deletePlan()}
        />
      </Modal>
    </DashboardLayout>
  );
}

export default CreatePlan;
