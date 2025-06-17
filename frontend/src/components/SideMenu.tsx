import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../utils/data";
import { IconType } from "react-icons";
import DEFAULT_AVATAR from "../assets/images/default.png";

type MenuItem = {
  id: string;
  label: string;
  path: string;
  icon: IconType;
};

type SideMenuProps = {
  activeMenu: string;
  onLogoutClick: () => void;
};

function SideMenu({ activeMenu, onLogoutClick }: SideMenuProps) {
  const { user } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState<MenuItem[]>([]);

  const navigate = useNavigate();

  const handleClick = (route: string) => {
    if (route === "/logout") {
      onLogoutClick();
      return;
    }

    navigate(route);
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);
  return (
    <div className="w-64 h-[calc(100vh-61px)] dark:bg-black border-r border-gray-200/50 dark:border-gray-600/50 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img
            src={user?.profileImageUrl || DEFAULT_AVATAR}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white dark:text-black bg-primary px-3 py-0.5 rounded mt-1">
            Админ
          </div>
        )}

        <h5 className="text-gray-950 dark:text-white font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>

        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label
              ? "text-primary dark:text-gray-400 bg-linear-to-r from-blue-50/40 to-blue-100/50 dark:from-gray-600/40 dark:to-gray-400/50 border-r-3"
              : ""
          } py-3 px-6 mb-3 cursor-pointer`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default SideMenu;
