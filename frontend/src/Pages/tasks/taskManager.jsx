//taskManager.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance.js';
import { useAuth } from '../../context/AuthContext.js'; 

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
  });
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/task');
        if (Array.isArray(response.data.tasks)) {
          setTasks(response.data.tasks);
        } else {
          console.error('I dati ricevuti non sono un array:', response.data);
        }
        console.log('Dati ricevuti:', response.data); // Logga i dati ricevuti
      } catch (error) {
        console.error('Errore durante il recupero delle attività:', error);
      }
    };
  
    fetchTasks();
  }, [authToken]);
  

  const toggleCompleted = async (taskId, completed) => {
    try {
      await axios.put(`/tasks/${taskId}`, { completed: !completed });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dell\'attività:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Errore durante l\'eliminazione dell\'attività:', error);
    }
  };

  return (
    <div className='ms-12 p-6 bg-white shadow-md rounded-md'>
      <h2>Lista delle Attività</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task._id, task.completed)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title} - {task.priority} - {new Date(task.dueDate).toLocaleDateString()}
            </span>
            <button onClick={() => deleteTask(task._id)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
