// Dashboard.jsx
import React, { useState } from "react";
import DashNav from "../../Components/dashNavbar.jsx";
import Sidebar from "../../Components/SideBar.jsx";
import { Routes, Route, Outlet, NavLink } from 'react-router-dom';
import CalendarComponent from './CalendarComponent';
import TaskBoard from './taskBoard';
import NoteList from './NoteList';
import DashHome from "./DashHome.jsx";

const DashboardLayout =() =>{
    const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
    return(
        <div className="dashboard flex">
            {/* Sidebar fissa */}
            <Sidebar isOpen={true} toggleSidebar={toggleSidebar} /> 

            {/* Contenuto principale con Navbar fissa */}
            <div className="flex-1">
                <DashNav />
                <main className="p-6">
                    {/* Rotte della dashboard */}
                    <Outlet />
                </main>
            </div>
        </div>
    )
};


// Dashboard principale con sotto rotte
const Dashboard = () => {
    return (
        <Routes>
            {/* Definiamo la rotta principale "/dashboard" */}
            <Route path="/" element={<DashboardLayout />}>
                {/* Sotto rotte della Dashboard */}
                <Route path="/" element={<DashHome />} />
                <Route path="/calendar" element={<CalendarComponent />} />
                <Route path="/tasks" element={<DashHome />} />
                <Route path="/notes" element={<NoteList />} />
                {/* Aggiungi altre sotto rotte qui */}
            </Route>
        </Routes>
    );
};

export default Dashboard;