import React from "react";
import DashNav from "../../Components/dashNavbar.jsx";
import CalendarComponent from './CalendarComponent.jsx';
import TasksComponent from './TasksComponent.jsx';
import StatisticsComponent from "./statisticsComponent.jsx";
import { ToastContainer } from "react-toastify";


export default function Dashboard() {
    return(
        <div className="dashboard">
            
                <DashNav />
                <main className="p-6 flex-grow mx-10">
                    <h1 className="font-semibold">Dashboard</h1>
                    <div className="flex space-x-4">
                        <CalendarComponent />
                        <TasksComponent /> 
                        <StatisticsComponent /> 
                    </div>
                    <ToastContainer />
                </main>
        </div>
        

    )
};