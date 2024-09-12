//MoodHistory.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance.js';
import { useAuth } from '../context/AuthContext'; // Assumi di avere un contesto di autenticazione

const MoodHistory = () => {
  const { authToken } = useAuth(); // Ottieni il token di autenticazione dal contesto

  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        const response = await axiosInstance.get('/MoodTracker', {
            headers: {
              Authorization: `Bearer ${authToken}`, // Invia il token nell'intestazione
            },
        });
        setMoodHistory(response.data);
      } catch (error) {
        console.error('Errore durante il recupero dello storico degli umori:', error);
      }
    };
    if (authToken) {
    fetchMoodHistory();
    }
  }, [authToken]);

  return (
    <div>
      <h2>Storico degli Umori</h2>
      <ul>
        {moodHistory.map((moodEntry) => (
          <li key={moodEntry._id}>
            <p>{new Date(moodEntry.date).toLocaleDateString()} - {moodEntry.mood}</p>
            {moodEntry.note && <p>Nota: {moodEntry.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodHistory;
