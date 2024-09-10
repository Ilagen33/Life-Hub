//MoodHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MoodHistory = () => {
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        const response = await axios.get('/api/moods');
        setMoodHistory(response.data);
      } catch (error) {
        console.error('Errore durante il recupero dello storico degli umori:', error);
      }
    };

    fetchMoodHistory();
  }, []);

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
