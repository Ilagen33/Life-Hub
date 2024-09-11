//Promemoria.jsx
import React, { useState } from 'react';
import axios from '../../utils/axiosInstance.js';

const ReminderForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/send-reminder', { email });
      alert('Promemoria inviato con successo!');
    } catch (err) {
      console.error('Errore durante l\'invio del promemoria:', err);
      alert('Errore durante l\'invio del promemoria');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Inserisci l'email per il promemoria:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Invia Promemoria</button>
    </form>
  );
};

export default ReminderForm;
