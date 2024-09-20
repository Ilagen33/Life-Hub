import React, { useState, Suspense, lazy } from 'react';


import CalendarComponent from './CalendarComponent.jsx';
import TasksComponent from './TasksComponent.jsx';
import StatisticsComponent from "./statisticsComponent.jsx";
import DiaryPage from "../DiaryPage.jsx";
import { ToastContainer } from "react-toastify";
import ReminderForm from "./Promemoria.jsx";
import Preferences from "./Preferences.jsx";
import AddNoteForm from "../tasks/AddNoteForm.jsx";
import AddTaskForm from "../tasks/AddTaskForm.jsx";
import CalendarComponents from "../CalendarComponents.jsx";
import DocumentManager from "../DocumentManager.jsx";
import WorkoutList from "../Exercise.jsx";
import WorkoutForm from "../ExerciseForm.jsx";
import FinanceForm from "../FinanceForm.jsx";
import FinanceList from "../FinanceList.jsx";
import FinanceManager from "../FinanceManager.jsx";
import FinancialReport from "../FinancialReport.jsx";
import GooglePlacesSearch from "../GooglePlaces.jsx";
import HealthForm from "../healthForm.jsx";
import HealthPage from "../healthTracker.jsx";
import KanbanBoard from "../KanbanBoard.jsx";
import MindfulnessList from "../Minfulness.jsx";
import UpdateProfile from "../ModificaUser.jsx";
import MoodHistory from "../MoodHistory.jsx";
import MoodForm from "../MoodForm.jsx";
import PreferencesForm from "../PreferencesForm.jsx";
import SettingsComponent from "../SettingsComponent.jsx";
import ToDo from "./To-Do.jsx";
import UserInfoComponent from "./UserComponent.jsx";

const HealthChart = lazy(() => import('./HealthChart'));
const NoteList = lazy(() => import('./NoteList'));
const TaskBoard = lazy(() => import('./taskBoard'));
export default function DashHome () {

    return (
        <div className={`flex-grow transition-all duration-300 z-1`}>

            <main className="p-6 mx-10">
                <h1 className="font-semibold">Dashboard</h1>
                    <div className="flex space-x-4">
                        <div className="space-y-2">
                            <CalendarComponent />
                            <StatisticsComponent />
                        </div>
                        <div className="space-y-2">
                            <UserInfoComponent />
                            {/*<TasksComponent /> 
                            <DiaryPage />
                            <ReminderForm />
                            
                            <Preferences />
                            <AddEventForm />
                            
                            <AddRecipe />
                            <AddTaskForm />
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
                            
                            <PreferencesForm />
                            <SettingsComponent />
                            */}
                            <ToDo />
                            <Suspense fallback={<p>Loading TaskBoard...</p>}>
                                <TaskBoard />
                            </Suspense>
                            {/* <Suspense fallback={<p>Loading HealthChart...</p>}>
                                <HealthChart />
                            </Suspense> */}
                        </div>  
                        <div>
                            <Suspense fallback={<p>Loading NoteList...</p>}>
                                <NoteList />
                            </Suspense>
                            {/* <taskManager /> */}
                    </div>
                    {/* <AddNoteForm />    */}
                </div>
                <ToastContainer />
            </main>
        </div>
    )
}