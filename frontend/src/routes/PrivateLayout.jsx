import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Appbar from "../components/common/Appbar";
import { cn } from "../utils";

const PrivateLayout = () => {
  const user = useSelector((state) => state.user.user);
  const [isOpen, setOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} setOpen={setOpen} />
      <div
        className={cn("flex-1", {
          "ml-20": !isOpen,
          "ml-64": isOpen,
        })}
      >
        <Appbar />
        <Outlet />
      </div>
    </div>
  );
};

export default PrivateLayout;
