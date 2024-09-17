// Dashboard.jsx
import React, { Suspense, lazy, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import DashNav from "../../Components/dashNavbar.jsx";
import Sidebar from "../../Components/SideBar.jsx";

// Lazy load dei componenti
const DashboardHome = lazy(() => import('./DashHome'));
const TaskList = lazy(() => import('./taskBoard'));
const HealthChart = lazy(() => import('./HealthChart'));
const NoteList = lazy(() => import('./NoteList'));
const ToDo = lazy(() => import('./To-Do'));

export default function Dashboard() {
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
                    <Routes>
                        {/* DashboardHome è il contenuto predefinito */}
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="/tasks" element={<Suspense fallback={<p>Loading...</p>}><TaskList /></Suspense>} />
                        <Route path="/health" element={<Suspense fallback={<p>Loading...</p>}><HealthChart /></Suspense>} />
                        <Route path="/todo" element={<Suspense fallback={<p>Loading...</p>}><ToDo /> </Suspense>} />
                        <Route path="/notes" element={<Suspense fallback={<p>Loading...</p>}><NoteList /> </Suspense>} />
                    </Routes>
                </main>
            </div>
        </div>
    )
};