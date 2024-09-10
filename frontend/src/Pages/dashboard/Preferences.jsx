//Preferences.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Widget from './Widget'; // Componente per i widget personalizzati

const Preference = () => {
  const [preferences, setPreferences] = useState(null);
  const [layout, setLayout] = useState('default');
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('/api');
        setPreferences(response.data);
        setLayout(response.data.dashboardLayout);
        setWidgets(response.data.widgets);
      } catch (error) {
        console.error('Errore durante il recupero delle preferenze:', error);
      }
    };

    fetchPreferences();
  }, []);

  return (
    <div className={`dashboard ${layout}`}>
      <h2>Dashboard</h2>
      {widgets.map((widget) => (
        <Widget key={widget} type={widget} />
      ))}
    </div>
  );
};

export default Preference;
