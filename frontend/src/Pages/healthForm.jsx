//HealthForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const HealthForm = () => {
  const [sleepHours, setSleepHours] = useState('');
  const [caloriesConsumed, setCaloriesConsumed] = useState('');
  const [weight, setWeight] = useState('');
  const [healthStatus, setHealthStatus] = useState('Good');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        sleepHours,
        caloriesConsumed,
        weight,
        healthStatus,
      };
      await axios.post('/api/health/add', data);
      alert('Dati di salute aggiunti con successo!');
      setSleepHours('');
      setCaloriesConsumed('');
      setWeight('');
      setHealthStatus('Good');
    } catch (error) {
      console.error('Errore durante l\'aggiunta dei dati di salute:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inserisci i tuoi dati di salute</h2>

      <div>
        <label>Ore di sonno</label>
        <input
          type="number"
          value={sleepHours}
          onChange={(e) => setSleepHours(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Calorie consumate</label>
        <input
          type="number"
          value={caloriesConsumed}
          onChange={(e) => setCaloriesConsumed(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Peso (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Stato di salute</label>
        <select value={healthStatus} onChange={(e) => setHealthStatus(e.target.value)}>
          <option value="Good">Buono</option>
          <option value="Moderate">Moderato</option>
          <option value="Bad">Cattivo</option>
        </select>
      </div>

      <button type="submit">Salva</button>
    </form>
  );
};

export default HealthForm;
