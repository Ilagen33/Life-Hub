import React, { useState, useEffect } from 'react';
import Board from 'react-trello';
import axios from '../axiosInstance';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error('Errore nel caricamento delle attività:', err);
      }
    };
    fetchTasks();
  }, []);

  const lanes = [
    {
      id: 'pending',
      title: 'Da fare',
      cards: tasks.filter((task) => task.status === 'pending').map((task) => ({
        id: task._id,
        title: task.title,
        description: task.content,
        label: task.priority
      }))
    },
    {
      id: 'in-progress',
      title: 'In corso',
      cards: tasks.filter((task) => task.status === 'in-progress').map((task) => ({
        id: task._id,
        title: task.title,
        description: task.content,
        label: task.priority
      }))
    },
    {
      id: 'completed',
      title: 'Completato',
      cards: tasks.filter((task) => task.status === 'completed').map((task) => ({
        id: task._id,
        title: task.title,
        description: task.content,
        label: task.priority
      }))
    }
  ];

  return (
    <Board
      data={{ lanes }}
      draggable
      laneDraggable={false}
      handleDragEnd={(cardId, sourceLaneId, targetLaneId) => {
        const updatedTask = tasks.find((task) => task._id === cardId);
        updatedTask.status = targetLaneId;
        axios.put(`/tasks/${cardId}`, updatedTask);
      }}
    />
  );
};

export default TaskBoard;