import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header.jsx";
import { Sidebar } from "../components/Sidebar.jsx";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#0b0f14]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-content lg:pl-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
