"use client";
import { useState } from "react";
import Navbar from "./Navbar";
import { Prisma } from "@prisma/client";
import Sidebar from "./Sidebar";

export default function WholeNavigation({
  user,
}: {
  user: Prisma.UserGetPayload<{}> | null;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen((t) => !t);
  };

  return (
    <>
      <div className="">
        <Navbar
          isSidebarOpened={isSidebarOpen}
          openSidebar={openSidebar}
          user={user}
        />
      </div>
      <Sidebar
        user={user}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </>
  );
}
