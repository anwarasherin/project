import {
  MdChevronRight,
  MdChevronLeft,
  MdOutlineSpaceDashboard,
  MdOutlineSettings,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

import { cn } from "../../../utils";
import Logo from "../Logo";

const sidebarMenuItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <MdOutlineSpaceDashboard />,
  },
  { label: "Settings", to: "/settings", icon: <MdOutlineSettings /> },
];

function Sidebar({ isOpen, setOpen }) {
  const location = useLocation();
  const pathname = location.pathname;
  const toggleSidebar = () => setOpen(!isOpen);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 h-screen bg-white transition-all duration-100 shadow-lg",
        {
          "w-20": !isOpen,
          "w-64": isOpen,
        }
      )}
    >
      <SidebarToggleButton toggleSidebar={toggleSidebar} isOpen={isOpen} />
      <div className="flex flex-col w-full">
        <SidebarHeader isOpen={isOpen} />
        {sidebarMenuItems.map((menuItem) => (
          <SidebarMenuItem
            key={menuItem.label}
            isOpen={isOpen}
            menuItem={menuItem}
            pathname={pathname}
          />
        ))}
      </div>
    </div>
  );
}

const SidebarHeader = ({ isOpen }) => {
  return (
    <section className="flex flex-row justify-start items-center gap-6 m-4">
      <Logo className="h-12 w-12 rounded-xl" />
      {isOpen && (
        <div className="font-semibold text-black text-2xl">Textoria</div>
      )}
    </section>
  );
};

const SidebarMenuItem = ({ menuItem, pathname, isOpen }) => {
  const { to, icon, label } = menuItem;
  const isSelected = pathname.includes(to);

  return (
    <Link to={to} key={label} state={{ label }}>
      <div
        className={cn(
          "m-3 p-3 flex flex-row justify-start items-center gap-6 rounded-xl text-black",
          {
            "bg-blue-500 text-white shadow-md": isSelected,
            "hover:bg-gray": !isSelected,
            "justify-center": !isOpen,
          }
        )}
      >
        <span className="text-2xl">{icon}</span>
        {isOpen && <span>{label}</span>}
      </div>
    </Link>
  );
};

const SidebarToggleButton = ({ toggleSidebar, isOpen }) => {
  return (
    <button
      onClick={toggleSidebar}
      className="absolute top-16 -right-3 text-xl text-black bg-white rounded-full p-0.5"
    >
      {!isOpen && <MdChevronRight className="text-blue-500" />}
      {isOpen && <MdChevronLeft className="text-blue-500" />}
    </button>
  );
};

export default Sidebar;
