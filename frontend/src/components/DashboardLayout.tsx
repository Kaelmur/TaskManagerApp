import { ReactNode, useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import LogoutAlert from "./LogoutAlert";

interface DashboardLayoutProps {
  children: ReactNode;
  activeMenu: string;
}

function DashboardLayout({ children, activeMenu }: DashboardLayoutProps) {
  const { user, clearUser } = useContext(UserContext);
  const [openLogoutAlert, setOpenLogoutAlert] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="">
      <Navbar
        activeMenu={activeMenu}
        onLogoutClick={() => setOpenLogoutAlert(true)}
      />

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu
              activeMenu={activeMenu}
              onLogoutClick={() => setOpenLogoutAlert(true)}
            />
          </div>

          <div className="grow mx-5">{children}</div>
        </div>
      )}
      <Modal
        isOpen={openLogoutAlert}
        onClose={() => setOpenLogoutAlert(false)}
        title="Выйти"
      >
        <LogoutAlert
          content="Вы уверены, что хотите выйти?"
          onLogout={() => handleLogout()}
        />
      </Modal>
    </div>
  );
}

export default DashboardLayout;
