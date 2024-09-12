//Exercise.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance.js';
import { useAuth } from '../context/AuthContext'; // Assumi di avere un contesto di autenticazione

const WorkoutList = () => {
  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axiosInstance.get('/WorkoutPlan', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
          },
        });
        setWorkouts(response.data);
      } catch (error) {
        console.error('Errore durante il recupero dei piani di allenamento:', error);
      }
    };
    if(authToken) {
      fetchWorkouts();
    }
  }, [authToken]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/WorkoutPlan/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
        },
      });
      setWorkouts(workouts.filter(workout => workout._id !== id));
    } catch (error) {
      console.error('Errore durante la cancellazione del piano di allenamento:', error);
    }
  };

  return (
    <div>
      <h2>Tuoi piani di allenamento</h2>
      <ul>
        {workouts.map((workout) => (
          <li key={workout._id}>
            <h3>{workout.name}</h3>
            <ul>
              {workout.exercises.map((exercise, index) => (
                <li key={index}>
                  {exercise.name} - {exercise.sets} serie, {exercise.reps} ripetizioni, {exercise.rest} secondi di riposo
                </li>
              ))}
            </ul>
            <button onClick={() => handleDelete(workout._id)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutList;