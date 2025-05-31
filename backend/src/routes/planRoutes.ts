import { Router } from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware";
import {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  updatePlanStatus,
  updatePlanProgress,
  deletePlan,
} from "../controller/planController";

const router = Router();

// Plan Management Routes
router.get("/", protect, adminOnly, getPlans); // Get all plans (Admin: all)
router.get("/:id", protect, adminOnly, getPlanById); // Get task by ID
router.post("/", protect, adminOnly, createPlan); // Create a plan (Admin only)
router.put("/:id", protect, updatePlan); // Update plan details
router.delete("/:id", protect, adminOnly, deletePlan); // Delete a plan (Admin only)

export default router;
