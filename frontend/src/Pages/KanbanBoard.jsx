import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Board from '@lourenci/react-kanban';
import '@lourenci/react-kanban/dist/styles.css';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Errore durante il recupero delle attività:', error);
      }
    };

    fetchTasks();
  }, []);

  const kanbanBoard = {
    columns: [
      {
        id: 1,
        title: 'Da fare',
        cards: tasks.filter((task) => !task.completed),
      },
      {
        id: 2,
        title: 'Completate',
        cards: tasks.filter((task) => task.completed),
      },
    ],
  };

  return (
    <Board
      initialBoard={kanbanBoard}
      renderCard={(task) => (
        <div key={task._id}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Scadenza: {new Date(task.dueDate).toLocaleDateString()}</p>
        </div>
      )}
    />
  );
};

export default KanbanBoard;
