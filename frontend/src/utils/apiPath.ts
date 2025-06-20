export const BASE_URL = "https://taskmanager-orx3.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Register a new user
    LOGIN: "/api/auth/login", // Authenticate user and return JWT token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
  },

  USERS: {
    GET_ALL_USERS: "/api/users", // Get all users
    GET_USER_BY_ID: (userId: string) => `/api/users/${userId}`, // Get user by ID
    CREATE_USER: "/api/users", // Create a new user
    UPDATE_USER: (userId: string) => `/api/users/${userId}`, // Update user details
    DELETE_USER: (userId: string) => `/api/users/${userId}`, // Delete a user
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get Dashboard Data
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get User Dashboard Data
    GET_ALL_TASKS: "/api/tasks", // Get all tasks
    GET_TASK_BY_ID: (taskId: string) => `/api/tasks/${taskId}`, // Get task by ID
    CREATE_TASK: "api/tasks", // Create a new task
    UPDATE_TASK: (taskId: string) => `/api/tasks/${taskId}`, // Update task details
    DELETE_TASK: (taskId: string) => `/api/tasks/${taskId}`, // Delete a task

    UPDATE_TASK_STATUS: (taskId: string) => `/api/tasks/${taskId}/status`, // Update task status
    UPDATE_TODO_CHECKLIST: (taskId: string) => `/api/tasks/${taskId}/todo`, // Update todo checklist
    UPLOAD_ATTACHMENT: (taskId: string) => `/api/tasks/${taskId}/upload-files`, // Upload attachment to the task
    DOWNLOAD_ATTACHMENT: (taskId: string) => `/api/tasks/${taskId}/download`, // Download attachments of the task
  },

  PLANS: {
    GET_ALL_PLANS: "/api/plans", // Get all plans
    CREATE_PLAN: "/api/plans", // Create a new plan
    GET_PLAN_BY_ID: (planId: string) => `/api/plans/${planId}`, // Get plan by ID
    UPDATE_PLAN: (planId: string) => `/api/plans/${planId}`, // Update plan details
    DELETE_PLAN: (planId: string) => `/api/plans/${planId}`, // Delete a plan
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks", // Download all tasks as an Excel file
    EXPORT_USERS: "/api/reports/export/users", // Download user-task report
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
