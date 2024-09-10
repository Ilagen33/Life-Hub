//ExerciseForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const WorkoutForm = () => {
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', sets: 0, reps: 0, rest: 0 },
  ]);

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: 0, rest: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/workouts/add', { name, exercises });
      alert('Piano di allenamento aggiunto con successo!');
      setName('');
      setExercises([{ name: '', sets: 0, reps: 0, rest: 0 }]);
    } catch (error) {
      console.error('Errore durante l\'aggiunta del piano di allenamento:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crea un nuovo piano di allenamento</h2>
      <div>
        <label>Nome del piano</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <h3>Esercizi</h3>
      {exercises.map((exercise, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Nome esercizio"
            value={exercise.name}
            onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Serie"
            value={exercise.sets}
            onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Ripetizioni"
            value={exercise.reps}
            onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Riposo (secondi)"
            value={exercise.rest}
            onChange={(e) => handleExerciseChange(index, 'rest', e.target.value)}
            required
          />
        </div>
      ))}

      <button type="button" onClick={handleAddExercise}>
        Aggiungi esercizio
      </button>

      <button type="submit">Salva piano</button>
    </form>
  );
};

export default WorkoutForm;
