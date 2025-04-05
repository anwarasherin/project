import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  MdOutlineDarkMode,
  MdOutlineTranslate,
  MdOutlinePerson,
  MdOutlineNotifications,
  MdOutlineLogout,
  MdLogout,
} from "react-icons/md";

import { cn } from "../../../utils";
import DropDownMenu from "../../common/DropDownMenu";
import { logout } from "../../../redux/slices/userSlice";

function Appbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useDispatch();

  const handleLogoutClick = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white flex flex-row justify-end items-center p-4">
      <div className="flex flex-row gap-4 justify-center items-center">
        <div className="flex flex-row gap-2">
          <MdOutlineDarkMode className=" bg-blue-500 text-white text-4xl p-1 rounded-md" />
          <MdOutlineNotifications className="bg-gray-600 text-white text-4xl p-1 rounded-md" />
          <DropDownMenu
            menuButton={
              <MdOutlinePerson className="bg-amber-500 ml-3 text-white text-4xl p-1 rounded-3xl" />
            }
            options={[
              {
                label: "Logout",
                icon: <MdLogout />,
                onClick: handleLogoutClick,
              },
            ]}
          />
        </div>
      </div>
    </header>
  );
}

export default Appbar;
