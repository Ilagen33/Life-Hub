import AddEventForm from "./AddEventForm";
import AddNoteForm from "./AddNoteForm";
import AddTaskForm from "./AddTaskForm";
import TaskBoard from "../dashboard/taskBoard";
import TasksComponent from "../dashboard/TasksComponent";
import TaskList from "./taskManager";
import NavbarTask from "./TaskNav";
import React,{useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import StatisticsComponent from "../dashboard/statisticsComponent.jsx";


const TaskPage = () => {
    const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

    const [tasks, setTasks] = useState([]); // Array di task
    const [loading, setLoading] = useState(false); // Variabile per controllare lo stato di caricamento
      // Funzione per recuperare i task dal backend
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true); // Inizia il caricamento
      try {
        const res = await axiosInstance.get('/task', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setTasks(res.data.tasks); // Imposta i task recuperati
      } catch (error) {
        console.error('Errore durante il recupero dei task:', error);
        toast.error('Errore durante il recupero dei task');
      } finally {
        setLoading(false); // Fine del caricamento
      }
    };

    if (authToken) {
      fetchTasks();
    }
  }, [authToken]); // Esegui il fetch solo quando `authToken` è disponibile

  return (
    <>
        <NavbarTask />
        <TaskBoard />
    </>
  );
};

export default TaskPage;
