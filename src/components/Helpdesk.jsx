import React, { useState } from "react";
import ChatPortal from "./ChatPortal";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import CustomerInformation from "./CustomerInformation";

const emptyConversation = () => {};

const Helpdesk = () => {
  const [chat, SetChat] = useState([]);
  return (
    <div className="flex h-[100vh] w-[100vw]">
      {/* Sidebar navigation */}
      <div className="flex flex-col w-[5%] min-w-[60px] bg-primary">
        <Sidebar />
      </div>

      {/* Main work section dock (Changable) */}
      <div className="flex w-[95%]">
        <Outlet />
      </div>
    </div>
  );
};

export default Helpdesk;
