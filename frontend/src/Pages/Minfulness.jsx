//Mindfulness.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MindfulnessList = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('/api/mindfulness');
        setExercises(response.data);
      } catch (error) {
        console.error('Errore durante il recupero degli esercizi di mindfulness:', error);
      }
    };

    fetchExercises();
  }, []);

  const handleCompleteExercise = async (id) => {
    try {
      await axios.post(`/api/mindfulness/complete/${id}`);
      alert('Esercizio completato con successo!');
    } catch (error) {
      console.error('Errore durante il completamento dell\'esercizio:', error);
    }
  };

  return (
    <div>
      <h2>Esercizi di Mindfulness</h2>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise._id}>
            <h3>{exercise.name} ({exercise.duration} min)</h3>
            <p>{exercise.description}</p>
            {exercise.videoUrl && (
              <div>
                <p>Guarda il video: <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer">Video</a></p>
              </div>
            )}
            <button onClick={() => handleCompleteExercise(exercise._id)}>Completa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MindfulnessList;
