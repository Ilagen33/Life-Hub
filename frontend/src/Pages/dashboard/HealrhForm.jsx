import React, { useState } from 'react';
import axios from '../axiosInstance';

const HealthForm = () => {
  const [weight, setWeight] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/health', { weight, calories, sleepHours, date });
      alert('Dati di salute inseriti con successo!');
      return res.data;
    } catch (err) {
      console.error('Errore durante l\'inserimento dei dati di salute:', err);
      alert('Errore durante l\'inserimento dei dati di salute');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Peso (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Calorie (kCal):</label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Ore di Sonno:</label>
        <input
          type="number"
          value={sleepHours}
          onChange={(e) => setSleepHours(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Data:</label>
        <input
          type="number"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">Salva Dati</button>
    </form>
  );
};

export default HealthForm;
