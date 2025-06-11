import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
  LuSquareCheckBig,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Главная",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Задачи",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
  {
    id: "04",
    label: "Планы",
    icon: LuSquareCheckBig,
    path: "/admin/plans",
  },
  {
    id: "05",
    label: "Работники",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "06",
    label: "Выйти",
    icon: LuLogOut,
    path: "/logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "Главная",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: "02",
    label: "Мои Задачи",
    icon: LuClipboardCheck,
    path: "/user/tasks",
  },
  {
    id: "05",
    label: "Выйти",
    icon: LuLogOut,
    path: "/logout",
  },
];

export const PRIORITY_DATA = [
  { label: "Низкий", value: "Low" },
  { label: "Средний", value: "Medium" },
  { label: "Высокий", value: "High" },
];

export const STATUS_DATA = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];
