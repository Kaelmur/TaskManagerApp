import { Request, Response, NextFunction } from "express";
import Plan from "../models/Plan";
import Task from "../models/Task";
import { Types } from "mongoose";

const getPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { status } = req.query;

    let filter: { status?: string } = {};

    if (status) {
      filter.status = typeof status === "string" ? status : undefined;
    }

    let plans;

    plans = await Plan.find(filter)
      .populate("tasks")
      .populate("assignedTo", "name profileImageUrl");

    const allPlans = await Plan.countDocuments({});

    const activePlans = await Plan.countDocuments({
      ...filter,
      status: "Active",
    });

    const completedPlans = await Plan.countDocuments({
      ...filter,
      status: "Completed",
    });

    res.json({
      plans,
      statusSummary: {
        all: allPlans,
        activePlans,
        completedPlans,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const plan = await Plan.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    res.json(plan);
  } catch (err) {
    next(err);
  }
};

const createPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      name,
      goal,
      startDate,
      endDate,
      tasks,
      completedAmount,
      assignedTo,
    } = req.body;

    const businessDays: Date[] = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const day = currentDate.getDay();
      if (day !== 0 && day != 6) {
        businessDays.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (businessDays.length === 0) {
      return res
        .status(400)
        .json({ message: "No business days between start and end date" });
    }

    const perTaskAmount = Math.floor(goal / businessDays.length);
    const remainder = goal % businessDays.length;

    const plan = await Plan.create({
      name,
      goal,
      startDate,
      endDate,
      tasks,
      assignedTo,
      createdBy: req.user?._id,
      completedAmount: completedAmount || 0,
    });

    // Create tasks for each business day
    const taskPromises = businessDays.map((date, index) => {
      const amount = index < remainder ? perTaskAmount + 1 : perTaskAmount;

      const part1 = Math.floor(amount / 3);
      const part2 = Math.floor((amount - part1) / 2);
      const part3 = amount - part1 - part2;

      return Task.create({
        title: `Задача на ${date.toLocaleDateString("ru-RU", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        description: `Сгенерированная задача на ${date.toLocaleDateString(
          "ru-RU",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )} с объемом ${amount}`,
        priority: "Medium",
        dueDate: date,
        amount,
        planId: plan._id,
        createdBy: req.user?._id,
        assignedTo: plan.assignedTo,
        todoChecklist: [
          { text: `Выполнить объем ${part1}`, completed: false },
          { text: `Выполнить объем ${part2}`, completed: false },
          { text: `Выполнить объем ${part3}`, completed: false },
        ],
      });
    });

    const createdTasks = await Promise.all(taskPromises);

    plan.tasks = createdTasks.map((task) => task._id);
    await plan.save();

    await updatePlanProgress(plan._id);

    res.status(201).json({ message: "Plan created sucessfully", plan });
  } catch (err) {
    next(err);
  }
};

const updatePlan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    plan.name = req.body.name || plan.name;
    plan.goal = req.body.goal || plan.goal;
    plan.completedAmount = req.body.completedAmount || plan.completedAmount;

    let shouldUpdateTasks = false;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignedTo must be an array of user ID's" });
      }

      plan.assignedTo = req.body.assignedTo;
      shouldUpdateTasks = true;

      const updatedPlan = await plan.save();

      if (shouldUpdateTasks) {
        await Task.updateMany(
          { planId: plan._id },
          { assignedTo: plan.assignedTo }
        );
      }

      res.json({ message: "Plan updated successfully", updatedPlan });
    }
  } catch (err) {
    next(err);
  }
};

const updatePlanStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    plan.status = req.body.status || plan.status;

    if (plan.status === "Completed") {
      plan.progress = 100;
    }

    await plan.save();
    res.json({ message: "Plan status updated", plan });
  } catch (err) {
    next(err);
  }
};

const updatePlanProgress = async (
  planId: Types.ObjectId | string
): Promise<void> => {
  const tasks = await Task.find({ planId });

  const completedTasks = tasks.filter((task) => task.status === "Completed");

  const completedAmount = completedTasks.reduce(
    (sum, task) => sum + (task.amount || 0),
    0
  );

  const plan = await Plan.findById(planId);
  if (!plan) return;

  plan.completedAmount = completedAmount;
  plan.progress = plan.goal
    ? Math.min((completedAmount / plan.goal) * 100, 100)
    : 0;

  if (plan.completedAmount >= plan.goal) {
    plan.status = "Completed";
  }

  await plan.save();
};

const deletePlan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    await plan.deleteOne();
    res.json({ message: "Plan deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  updatePlanStatus,
  updatePlanProgress,
  deletePlan,
};
