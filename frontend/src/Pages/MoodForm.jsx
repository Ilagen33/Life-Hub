import React, { useState } from 'react';
import axios from 'axios';

const MoodForm = () => {
  const [mood, setMood] = useState('Happy');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { mood, note };
      await axios.post('/api/moods/add', data);
      alert('Umore registrato con successo!');
      setMood('Happy');
      setNote('');
    } catch (error) {
      console.error('Errore durante la registrazione dell\'umore:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Come ti senti oggi?</h2>
      
      <div>
        <label>Umore</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="Happy">Felice</option>
          <option value="Sad">Triste</option>
          <option value="Neutral">Neutrale</option>
          <option value="Anxious">Ansioso</option>
          <option value="Excited">Eccitato</option>
        </select>
      </div>

      <div>
        <label>Note (opzionale)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Aggiungi una nota"
        />
      </div>

      <button type="submit">Salva umore</button>
    </form>
  );
};

export default MoodForm;
