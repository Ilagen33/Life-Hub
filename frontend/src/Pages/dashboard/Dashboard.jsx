//Dashboard.jsx
import React from "react";
import DashNav from "../../Components/dashNavbar.jsx";
import CalendarComponent from './CalendarComponent.jsx';
import TasksComponent from './TasksComponent.jsx';
import StatisticsComponent from "./statisticsComponent.jsx";
import DiaryPage from "../DiaryPage.jsx";
import { ToastContainer } from "react-toastify";
import ReminderForm from "./Promemoria.jsx";
import HealthChart from "./HealthChart.jsx";
import Preferences from "./Preferences.jsx";
import AddEventForm from "../AddEventForm.jsx";
import AddNoteForm from "../AddNoteForm.jsx";
import AddRecipe from "../AddRecipe.jsx";
import AddTaskForm from "../AddTaskForm.jsx";
import CalendarComponents from "../CalendarComponents.jsx";
import DocumentManager from "../DocumentManager.jsx";
import WorkoutList from "../Exercise.jsx";
import WorkoutForm from "../ExerciseForm.jsx";
import FinanceForm from "../FinanceForm.jsx";
import FinanceList from "../FinanceList.jsx";
import FinanceManager from "../FinanceManager.jsx";
import FinancialReport from "../FinancialReport.jsx";
import Food from "../Food.jsx";
import GooglePlacesSearch from "../GooglePlaces.jsx";
import HealthForm from "../healthForm.jsx";
import HealthPage from "../healthTracker.jsx";
import KanbanBoard from "../KanbanBoard.jsx";
import MealPlanner from "../MealPlanner.jsx";
import MindfulnessList from "../Minfulness.jsx";
import UpdateProfile from "../ModificaUser.jsx";
import MoodHistory from "../MoodHistory.jsx";
import NoteList from "../NoteList.jsx";
import MoodForm from "../MoodForm.jsx";
import PreferencesForm from "../PreferencesForm.jsx";
import SettingsComponent from "../SettingsComponent.jsx";
import ToDo from "../To-Do.jsx";

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
                        <DiaryPage />
                        <ReminderForm />
                        <HealthChart />
                        <Preferences />
                        <AddEventForm />
                        <AddNoteForm />
                        <AddRecipe />
                        <AddTaskForm />
                        <CalendarComponents />
                        <DocumentManager />
                        <WorkoutList />
                        <WorkoutForm />
                        <FinanceForm />
                        <FinanceList />
                        <FinanceManager />
                        <FinancialReport />
                        <Food />
                        <GooglePlacesSearch />
                        <HealthForm />
                        <HealthPage />
                        <KanbanBoard />
                        <MealPlanner />
                        <MindfulnessList />
                        <UpdateProfile />
                        <MoodForm />
                        <MoodHistory />
                        <NoteList />
                        <PreferencesForm />
                        <SettingsComponent />
                        <taskManager />
                        <ToDo />
                    </div>
                    <ToastContainer />
                </main>
        </div>
        

    )
};