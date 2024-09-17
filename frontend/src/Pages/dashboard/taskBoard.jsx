//taskBoard.jsx
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axiosInstance from '../../utils/axiosInstance.js'; // Assicurati di usare la tua istanza Axios
import { useAuth } from '../../context/AuthContext.js'; // Per ottenere il token di autenticazione

const ItemType = 'TASK';

const Task = ({ task, index, moveTask }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} style={{ padding: '5px', marginBottom: '3px', backgroundColor: 'white', borderRadius: '4px' }}>
      {task.title}
    </div>
  );
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]); // Inizialmente nessun task
  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

  // Funzione per spostare i task
  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  // Funzione per recuperare i task dal backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get('/task');
        setTasks(res.data.tasks); // Imposta i task recuperati
      } catch (error) {
        console.error('Errore durante il recupero dei task:', error);
      }
    };

    if (authToken) {
      fetchTasks();
    }
  }, [authToken]); // Esegui il fetch solo quando `authToken` è disponibile

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-4 bg-white shadow-md rounded-md">
        {tasks.length === 0 ? (
          <p>Nessun task disponibile</p>
        ) : (
          tasks.map((task, index) => (
            <Task key={task._id} index={index} task={task} moveTask={moveTask} />
          ))
        )}
      </div>
    </DndProvider>
  );
};

export default TaskBoard;
