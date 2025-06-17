import { useEffect, useRef, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { gsap } from "gsap";
import { ModeToggle } from "./mode-toggle";

function Navbar({
  activeMenu,
  onLogoutClick,
}: {
  activeMenu: string;
  onLogoutClick: () => void;
}) {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const sideMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menu = sideMenuRef.current;
    if (!menu) return;

    if (openSideMenu) {
      gsap.to(menu, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
        pointerEvents: "auto",
      });
    } else {
      gsap.to(menu, {
        x: "-100%",
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          menu.style.pointerEvents = "none";
        },
      });
    }
  }, [openSideMenu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openSideMenu &&
        sideMenuRef.current &&
        !sideMenuRef.current.contains(event.target as Node)
      ) {
        setOpenSideMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSideMenu]);

  return (
    <div className="flex items-center justify-between gap-5 bg-white dark:bg-black border border-b border-gray-200/50 dark:border-gray-600/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black dark:text-white"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="text-lg font-medium text-black dark:text-white">
        Task Manager
      </h2>

      <ModeToggle />

      <div
        ref={sideMenuRef}
        style={{
          transform: "translateX(-100%)",
          opacity: 0,
          pointerEvents: "none",
        }}
        className="fixed top-[61px] left-0 w-64 h-[calc(100vh-61px)] bg-white shadow-md z-40"
      >
        <SideMenu activeMenu={activeMenu} onLogoutClick={onLogoutClick} />
      </div>
    </div>
  );
}

export default Navbar;
